-- Rollback Migration: Remove transport_mode, attribution, and data_license fields
-- Date: 2025-01-18
-- Description: Rollback for adding transport mode, attribution, and polygon support

-- Drop indexes
DROP INDEX IF EXISTS idx_closures_transport_mode;
DROP INDEX IF EXISTS idx_closures_attribution;

-- Drop check constraint
ALTER TABLE closures DROP CONSTRAINT IF EXISTS check_transport_mode;

-- Remove columns
ALTER TABLE closures DROP COLUMN IF EXISTS transport_mode;
ALTER TABLE closures DROP COLUMN IF EXISTS attribution;
ALTER TABLE closures DROP COLUMN IF EXISTS data_license;

-- Restore original geometry comment
COMMENT ON COLUMN closures.geometry IS 'Road segment geometry as Point or LineString in WGS84';

-- Drop enum type (only if not in use elsewhere)
-- Note: This will fail if the enum is still referenced, which is expected
-- DROP TYPE IF EXISTS transport_mode_enum CASCADE;
