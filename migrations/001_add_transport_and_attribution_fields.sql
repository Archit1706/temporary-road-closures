-- Migration: Add transport_mode, attribution, and data_license fields to closures table
-- Date: 2025-01-18
-- Description: Adds support for transport mode filtering, data attribution, and polygon geometries

-- Add transport_mode enum type
DO $$ BEGIN
    CREATE TYPE transport_mode_enum AS ENUM (
        'all',
        'car',
        'hgv',
        'bicycle',
        'foot',
        'motorcycle',
        'bus',
        'emergency'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add transport_mode column to closures table
ALTER TABLE closures ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(50) NOT NULL DEFAULT 'all';

-- Add attribution column for third-party data sources
ALTER TABLE closures ADD COLUMN IF NOT EXISTS attribution TEXT;

-- Add data_license column for data licensing information
ALTER TABLE closures ADD COLUMN IF NOT EXISTS data_license VARCHAR(100);

-- Create index on transport_mode for faster filtering
CREATE INDEX IF NOT EXISTS idx_closures_transport_mode ON closures(transport_mode);

-- Create index on attribution for data source queries
CREATE INDEX IF NOT EXISTS idx_closures_attribution ON closures(attribution);

-- Update geometry column comment to reflect polygon support
COMMENT ON COLUMN closures.geometry IS 'Road segment geometry as Point, LineString, or Polygon in WGS84';

-- Add check constraint for transport_mode (optional, for data integrity)
ALTER TABLE closures
DROP CONSTRAINT IF EXISTS check_transport_mode;

ALTER TABLE closures
ADD CONSTRAINT check_transport_mode
CHECK (transport_mode IN ('all', 'car', 'hgv', 'bicycle', 'foot', 'motorcycle', 'bus', 'emergency'));

COMMENT ON COLUMN closures.transport_mode IS 'Mode of transport affected by this closure';
COMMENT ON COLUMN closures.attribution IS 'Attribution string for third-party data sources';
COMMENT ON COLUMN closures.data_license IS 'License under which the closure data is provided';
