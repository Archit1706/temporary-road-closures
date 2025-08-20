#!/bin/bash

# OSM Road Closures Database Backup Script
set -e

# Configuration
DB_HOST="db"
DB_PORT="5432"
DB_NAME="osm_closures_prod"
DB_USER="postgres"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/osm_closures_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

echo "🗄️  Starting database backup at $(date)"
echo "📁 Backup directory: ${BACKUP_DIR}"
echo "🎯 Target file: ${BACKUP_FILE}"

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}"; do
    echo "Database not ready, waiting..."
    sleep 5
done

echo "✅ Database is ready"

# Create backup
echo "📦 Creating database dump..."
if pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
    --no-password --verbose --clean --if-exists --create \
    --format=plain --encoding=UTF8 > "${BACKUP_FILE}"; then
    
    echo "✅ Database dump created successfully"
    
    # Compress the backup
    echo "🗜️  Compressing backup..."
    if gzip "${BACKUP_FILE}"; then
        echo "✅ Backup compressed: ${COMPRESSED_FILE}"
    else
        echo "⚠️  Warning: Failed to compress backup, keeping uncompressed version"
        COMPRESSED_FILE="${BACKUP_FILE}"
    fi
    
    # Verify backup file
    if [ -f "${COMPRESSED_FILE}" ] && [ -s "${COMPRESSED_FILE}" ]; then
        BACKUP_SIZE=$(du -h "${COMPRESSED_FILE}" | cut -f1)
        echo "📊 Backup size: ${BACKUP_SIZE}"
        echo "✅ Backup verification successful"
    else
        echo "❌ Error: Backup file is empty or missing"
        exit 1
    fi
    
else
    echo "❌ Error: Database dump failed"
    exit 1
fi

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "${BACKUP_DIR}" -name "osm_closures_backup_*.sql*" -type f -mtime +7 -delete
REMAINING_BACKUPS=$(find "${BACKUP_DIR}" -name "osm_closures_backup_*.sql*" -type f | wc -l)
echo "📂 Remaining backups: ${REMAINING_BACKUPS}"

# Log backup info
echo "📝 Backup Summary:"
echo "   - Timestamp: ${TIMESTAMP}"
echo "   - File: ${COMPRESSED_FILE}"
echo "   - Size: ${BACKUP_SIZE}"
echo "   - Status: SUCCESS"

echo "🎉 Backup completed successfully at $(date)"

# Optional: Send backup status to a monitoring endpoint
# Uncomment and configure if you have monitoring setup
# curl -X POST "http://your-monitoring-endpoint/backup-status" \
#      -H "Content-Type: application/json" \
#      -d "{\"service\":\"osm-closures\",\"status\":\"success\",\"timestamp\":\"${TIMESTAMP}\",\"size\":\"${BACKUP_SIZE}\"}"

exit 0