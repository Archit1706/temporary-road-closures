#!/bin/bash
# One-time SSL auto-renewal setup for the OSM Road Closures production server.
#
# Run as root on the production server:
#   sudo bash scripts/setup_ssl_renewal.sh
#
# What this does:
#   1. Installs certbot on the host (if not already installed)
#   2. Creates a deploy hook that reloads the nginx Docker container after every renewal
#   3. Force-renews all configured certs immediately (fixes any expired cert)
#   4. Enables certbot's systemd timer (runs twice daily), or adds a cron job as fallback
#
# Why host certbot instead of the Docker certbot container?
#   The certbot/certbot Docker image has no Docker CLI installed, so the
#   --deploy-hook 'docker exec nginx ...' command silently fails inside the container.
#   Running certbot directly on the host allows it to properly reload the nginx
#   container via 'docker exec' after each successful renewal.

set -euo pipefail

NGINX_CONTAINER="osm_closures_nginx_prod"
WEBROOT="/var/lib/letsencrypt"
DEPLOY_HOOK_FILE="/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh"

# --- helpers ---
green()  { printf '\e[0;32m%s\e[0m\n' "$*"; }
yellow() { printf '\e[1;33m%s\e[0m\n' "$*"; }
red()    { printf '\e[0;31mERROR: %s\e[0m\n' "$*" >&2; exit 1; }
step()   { echo ""; printf '\e[0;32m==> %s\e[0m\n' "$*"; }

# --- 1. Must run as root ---
[[ $EUID -eq 0 ]] || red "Run as root:  sudo bash $0"

# --- 2. Install certbot if not present ---
step "Checking certbot installation..."
if ! command -v certbot &>/dev/null; then
    step "Installing certbot..."
    apt-get update -qq
    apt-get install -y certbot
    green "  certbot installed: $(certbot --version)"
else
    green "  certbot found: $(certbot --version)"
fi

# --- 3. Nginx container must be running ---
step "Checking nginx container '$NGINX_CONTAINER'..."
docker ps --format '{{.Names}}' | grep -q "^${NGINX_CONTAINER}$" \
    || red "'$NGINX_CONTAINER' is not running. Start it first:\n  docker compose -f docker-compose.prod.yml up -d nginx"
green "  OK – container is running"

# --- 4. Install the deploy hook ---
# This script runs automatically after every successful cert renewal.
# It tells the nginx Docker container to reload its config (and pick up the new cert).
step "Installing deploy hook: $DEPLOY_HOOK_FILE"
mkdir -p "$(dirname "$DEPLOY_HOOK_FILE")"
cat > "$DEPLOY_HOOK_FILE" << 'HOOK'
#!/bin/bash
# Reloads the nginx Docker container after a Let's Encrypt cert renewal.
# Placed in /etc/letsencrypt/renewal-hooks/deploy/ so certbot runs it automatically.

CONTAINER="osm_closures_nginx_prod"
LOG_TAG="certbot-deploy-hook"

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker exec "$CONTAINER" nginx -t 2>&1 | logger -t "$LOG_TAG"; then
        docker exec "$CONTAINER" nginx -s reload
        echo "[$(date -Iseconds)] nginx reloaded OK after cert renewal" | logger -t "$LOG_TAG"
    else
        echo "[$(date -Iseconds)] nginx config test FAILED – not reloading" | logger -t "$LOG_TAG" >&2
        exit 1
    fi
else
    echo "[$(date -Iseconds)] container '$CONTAINER' not running – skipped reload" | logger -t "$LOG_TAG" >&2
fi
HOOK
chmod +x "$DEPLOY_HOOK_FILE"
green "  Deploy hook installed"

# --- 5. Ensure webroot directory exists (nginx serves challenges from here) ---
mkdir -p "$WEBROOT"

# --- 6. Force-renew all configured certs ---
# --force-renewal bypasses the "30 days before expiry" guard, renewing immediately.
# This fixes any currently expired cert.
step "Force-renewing all certificates..."
certbot renew \
    --webroot \
    --webroot-path="$WEBROOT" \
    --force-renewal \
    --non-interactive

# --- 7. Reload nginx to pick up the fresh certs ---
step "Reloading nginx..."
if docker exec "$NGINX_CONTAINER" nginx -t 2>&1; then
    docker exec "$NGINX_CONTAINER" nginx -s reload
    green "  Nginx reloaded – new certificates are now active"
else
    yellow "  WARNING: nginx config test failed. Check nginx logs:"
    yellow "    docker logs $NGINX_CONTAINER"
fi

# --- 8. Enable automatic renewal (systemd timer preferred, cron as fallback) ---
step "Setting up automatic renewal..."
if systemctl list-unit-files certbot.timer &>/dev/null 2>&1; then
    systemctl enable --now certbot.timer
    green "  certbot.timer enabled (runs twice daily at a random time)"
    systemctl status certbot.timer --no-pager -l || true
else
    yellow "  systemd certbot.timer not available – adding cron job instead"
    # Run at 03:00 and 15:00 daily; logs go to syslog via logger
    CRON_JOB="0 3,15 * * * /usr/bin/certbot renew --webroot --webroot-path=${WEBROOT} --quiet 2>&1 | /usr/bin/logger -t certbot"
    # Remove any old certbot cron entry, then add the new one
    ( crontab -l 2>/dev/null | grep -v 'certbot renew' ; echo "$CRON_JOB" ) | crontab -
    green "  Cron job added: $CRON_JOB"
fi

# --- 9. Show final certificate status ---
step "Certificate status:"
certbot certificates

echo ""
green "==> Auto-renewal setup complete."
echo ""
echo "  Deploy hook : $DEPLOY_HOOK_FILE"
echo "  Renewal     : twice daily (systemd timer or cron)"
echo ""
echo "  To verify auto-renewal works:   sudo certbot renew --dry-run"
echo "  To manually renew early:        sudo bash scripts/renew_ssl.sh --force"
echo "  To check renewal logs:          journalctl -t certbot -t certbot-deploy-hook"
