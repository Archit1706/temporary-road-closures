#!/bin/bash

# SSL Certificate Renewal Script for OSM Road Closures
# This script renews Let's Encrypt SSL certificates for closures.osm.ch
set -e

echo "🔐 SSL Certificate Renewal for OSM Road Closures"
echo "================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Error: This script must be run as root (use sudo)"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "❌ Error: certbot is not installed"
    echo "💡 Install certbot with: sudo apt-get update && sudo apt-get install certbot python3-certbot-nginx"
    exit 1
fi

# Domain names
FRONTEND_DOMAIN="closures.osm.ch"
API_DOMAIN="api.closures.osm.ch"

echo ""
echo "📋 Checking current certificate status..."
echo ""

# Check current certificates
certbot certificates

echo ""
echo "🔄 Renewing SSL certificates..."
echo ""

# Renew certificates (dry-run first to test)
echo "Running dry-run to test renewal..."
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✅ Dry-run successful! Proceeding with actual renewal..."
    echo ""

    # Actual renewal
    certbot renew --quiet

    if [ $? -eq 0 ]; then
        echo "✅ SSL certificates renewed successfully!"
        echo ""

        # Reload nginx to use new certificates
        echo "🔄 Reloading nginx to apply new certificates..."

        # Check if nginx is running in Docker
        if docker ps | grep -q osm_closures_nginx_prod; then
            echo "Detected Docker nginx container..."
            docker exec osm_closures_nginx_prod nginx -t
            docker exec osm_closures_nginx_prod nginx -s reload
            echo "✅ Nginx reloaded successfully!"
        else
            # Reload system nginx
            nginx -t && systemctl reload nginx
            echo "✅ System nginx reloaded successfully!"
        fi

        echo ""
        echo "📊 New certificate details:"
        certbot certificates

        echo ""
        echo "✨ Certificate renewal complete!"
        echo ""
        echo "🔗 Your domains are now secured with renewed SSL certificates:"
        echo "   - https://$FRONTEND_DOMAIN"
        echo "   - https://$API_DOMAIN"

    else
        echo "❌ Error: Certificate renewal failed"
        exit 1
    fi
else
    echo "❌ Error: Dry-run failed. Please check certbot configuration"
    exit 1
fi

# Show expiration dates
echo ""
echo "📅 Certificate expiration dates:"
certbot certificates | grep "Expiry Date"

echo ""
echo "💡 Tip: Set up automatic renewal with a cron job:"
echo "   sudo crontab -e"
echo "   Add: 0 0 * * * /path/to/renew_ssl.sh >> /var/log/certbot-renewal.log 2>&1"
