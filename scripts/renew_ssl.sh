#!/bin/bash
# Manual SSL certificate renewal for OSM Road Closures.
#
# Normally you do NOT need to run this — the systemd timer (or cron job) installed
# by setup_ssl_renewal.sh handles it automatically.
#
# Usage:
#   sudo bash scripts/renew_ssl.sh           # renew only if near expiry (<30 days)
#   sudo bash scripts/renew_ssl.sh --force   # renew immediately regardless of expiry

set -euo pipefail

NGINX_CONTAINER="osm_closures_nginx_prod"
WEBROOT="/var/lib/letsencrypt"
FORCE_FLAG=""
[[ ${1:-} == "--force" ]] && FORCE_FLAG="--force-renewal"

# --- helpers ---
green()  { printf '\e[0;32m%s\e[0m\n' "$*"; }
yellow() { printf '\e[1;33m%s\e[0m\n' "$*"; }
red()    { printf '\e[0;31mERROR: %s\e[0m\n' "$*" >&2; exit 1; }
step()   { echo ""; printf '\e[0;32m==> %s\e[0m\n' "$*"; }

echo "================================================"
echo " SSL Certificate Renewal – OSM Road Closures"
echo "================================================"
[[ -n "$FORCE_FLAG" ]] && echo " Mode: FORCE (renewing regardless of expiry)"

[[ $EUID -eq 0 ]] || red "Run as root:  sudo bash $0 ${1:-}"
command -v certbot &>/dev/null \
    || red "certbot is not installed. Run: sudo bash scripts/setup_ssl_renewal.sh"

step "Current certificate status"
certbot certificates

step "Renewing certificates..."
certbot renew \
    --webroot \
    --webroot-path="$WEBROOT" \
    --non-interactive \
    $FORCE_FLAG

step "Reloading nginx to apply any new certificates..."
if docker ps --format '{{.Names}}' | grep -q "^${NGINX_CONTAINER}$"; then
    if docker exec "$NGINX_CONTAINER" nginx -s reload; then
        green "  Nginx reloaded"
    else
        yellow "  WARNING: nginx reload failed. Check: docker logs $NGINX_CONTAINER"
    fi
else
    yellow "  WARNING: container '$NGINX_CONTAINER' is not running"
fi

step "Updated certificate status"
certbot certificates

echo ""
green "Done."
