#!/bin/sh

# OSM Road Closures Database Backup Script 
set -e

# Configuration from environment variables
DB_HOST="${POSTGRES_HOST:-db}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-osm_closures_prod}"
DB_USER="${POSTGRES_USER:-postgres}"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/osm_closures_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"
MAX_BACKUP_DAYS="${MAX_BACKUP_DAYS:-7}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "🗄️  Starting database backup at $(date)"
echo "📁 Backup directory: ${BACKUP_DIR}"
echo "🎯 Target file: ${BACKUP_FILE}"
echo "🔧 Connection: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    if pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" >/dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    echo "Database not ready, waiting... (${RETRIES} retries left)"
    sleep 10
    RETRIES=$((RETRIES - 1))
done

if [ $RETRIES -eq 0 ]; then
    echo "❌ Error: Database connection timeout"
    exit 1
fi

# Create backup
echo "📦 Creating database dump..."
if pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    --encoding=UTF8 \
    --no-owner \
    --no-privileges > "${BACKUP_FILE}"; then
    
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

# Cleanup old backups
echo "🧹 Cleaning up old backups (keeping last ${MAX_BACKUP_DAYS} days)..."
find "${BACKUP_DIR}" -name "osm_closures_backup_*.sql*" -type f -mtime +${MAX_BACKUP_DAYS} -delete 2>/dev/null || true
REMAINING_BACKUPS=$(find "${BACKUP_DIR}" -name "osm_closures_backup_*.sql*" -type f 2>/dev/null | wc -l)
echo "📂 Remaining backups: ${REMAINING_BACKUPS}"

# Log backup info
echo "📝 Backup Summary:"
echo "   - Timestamp: ${TIMESTAMP}"
echo "   - File: ${COMPRESSED_FILE}"
echo "   - Size: ${BACKUP_SIZE:-unknown}"
echo "   - Remaining backups: ${REMAINING_BACKUPS}"
echo "   - Status: SUCCESS"

echo "🎉 Backup completed successfully at $(date)"
echo "----------------------------------------"

exit 0