-- PostGIS Initialization Script for OSM Road Closures API

-- Enable PostGIS extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Create custom enum types for closures
DO $$ BEGIN
    CREATE TYPE closure_type_enum AS ENUM (
        'construction', 
        'accident', 
        'event', 
        'maintenance', 
        'weather', 
        'emergency',
        'other',
        'sidewalk_repair',
        'bike_lane_closure',
        'bridge_closure',
        'tunnel_closure'
    );
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'closure_type_enum already exists, skipping...';
END $$;

DO $$ BEGIN
    CREATE TYPE closure_status_enum AS ENUM (
        'active', 
        'expired', 
        'cancelled', 
        'planned'
    );
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'closure_status_enum already exists, skipping...';
END $$;

-- Set default timezone
SET timezone = 'UTC';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE osm_closures_dev TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display PostGIS version for verification
SELECT 'PostGIS Version: ' || PostGIS_Version() as version_info;

-- Display available spatial reference systems
SELECT 'Available SRS count: ' || count(*) as srs_count FROM spatial_ref_sys;

-- Verify WGS84 (EPSG:4326) is available
SELECT 'WGS84 (EPSG:4326) available: ' || 
    CASE WHEN EXISTS(SELECT 1 FROM spatial_ref_sys WHERE srid = 4326) 
         THEN 'YES' 
         ELSE 'NO' 
    END as wgs84_status;

-- Create a test table to verify PostGIS functionality supports both Point and LineString
CREATE TABLE IF NOT EXISTS postgis_test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    geom GEOMETRY(GEOMETRY, 4326)  -- Changed to support both Point and LineString
);

-- Insert test geometries (Point and LineString)
INSERT INTO postgis_test (name, geom) 
VALUES 
    ('Chicago Point', ST_GeomFromText('POINT(-87.6298 41.8781)', 4326)),
    ('Chicago Line', ST_GeomFromText('LINESTRING(-87.6298 41.8781, -87.6290 41.8785)', 4326))
ON CONFLICT DO NOTHING;

-- Add constraint to ensure only Point or LineString geometries
DO $$ BEGIN
    ALTER TABLE postgis_test 
    ADD CONSTRAINT check_test_geometry_type 
    CHECK (ST_GeometryType(geom) IN ('ST_Point', 'ST_LineString'));
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Constraint check_test_geometry_type already exists, skipping...';
END $$;

-- Verify spatial queries work for both geometry types
SELECT 'PostGIS Point test: ' || 
    ST_AsText(geom) || ' (' || name || ')' as test_result 
FROM postgis_test 
WHERE name = 'Chicago Point';

SELECT 'PostGIS LineString test: ' || 
    ST_AsText(geom) || ' (' || name || ')' as test_result 
FROM postgis_test 
WHERE name = 'Chicago Line';

-- Clean up test table
DROP TABLE IF EXISTS postgis_test;