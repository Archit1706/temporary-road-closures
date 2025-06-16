-- -- scripts/init_postgis.sql
-- -- PostGIS Initialization Script for OSM Road Closures API

-- -- Enable PostGIS extensions
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE EXTENSION IF NOT EXISTS postgis_topology;
-- CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
-- CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- -- Create custom enum types for closures
-- DO $$ BEGIN
--     CREATE TYPE closure_type_enum AS ENUM (
--         'construction', 
--         'accident', 
--         'event', 
--         'maintenance', 
--         'weather', 
--         'other'
--     );
-- EXCEPTION
--     WHEN duplicate_object THEN 
--         RAISE NOTICE 'closure_type_enum already exists, skipping...';
-- END $$;

-- DO $$ BEGIN
--     CREATE TYPE closure_status_enum AS ENUM (
--         'active', 
--         'expired', 
--         'cancelled', 
--         'planned'
--     );
-- EXCEPTION
--     WHEN duplicate_object THEN 
--         RAISE NOTICE 'closure_status_enum already exists, skipping...';
-- END $$;

-- -- Create indexes for spatial operations
-- -- These will be created automatically by SQLAlchemy, but we ensure they exist

-- -- Set default timezone
-- SET timezone = 'UTC';

-- -- Grant permissions
-- GRANT ALL PRIVILEGES ON DATABASE osm_closures_dev TO postgres;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- -- Display PostGIS version for verification
-- SELECT 'PostGIS Version: ' || PostGIS_Version() as version_info;

-- -- Display available spatial reference systems
-- SELECT 'Available SRS count: ' || count(*) as srs_count FROM spatial_ref_sys;

-- -- Verify WGS84 (EPSG:4326) is available
-- SELECT 'WGS84 (EPSG:4326) available: ' || 
--     CASE WHEN EXISTS(SELECT 1 FROM spatial_ref_sys WHERE srid = 4326) 
--          THEN 'YES' 
--          ELSE 'NO' 
--     END as wgs84_status;

-- -- Create a simple test table to verify PostGIS functionality
-- CREATE TABLE IF NOT EXISTS postgis_test (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50),
--     geom GEOMETRY(POINT, 4326)
-- );

-- -- Insert a test point (Chicago coordinates)
-- INSERT INTO postgis_test (name, geom) 
-- VALUES ('Chicago', ST_GeomFromText('POINT(-87.6298 41.8781)', 4326))
-- ON CONFLICT DO NOTHING;

-- -- Verify spatial query works
-- SELECT 'PostGIS test query: ' || 
--     ST_AsText(geom) || ' (' || name || ')' as test_result 
-- FROM postgis_test 
-- WHERE name = 'Chicago';

-- -- Clean up test table
-- DROP TABLE IF EXISTS postgis_test;

-- RAISE NOTICE 'PostGIS initialization completed successfully!';


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
        'other'
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

-- Create a simple test table to verify PostGIS functionality
CREATE TABLE IF NOT EXISTS postgis_test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    geom GEOMETRY(POINT, 4326)
);

-- Insert a test point (Chicago coordinates)
INSERT INTO postgis_test (name, geom) 
VALUES ('Chicago', ST_GeomFromText('POINT(-87.6298 41.8781)', 4326))
ON CONFLICT DO NOTHING;

-- Verify spatial query works
SELECT 'PostGIS test query: ' || 
    ST_AsText(geom) || ' (' || name || ')' as test_result 
FROM postgis_test 
WHERE name = 'Chicago';

-- Clean up test table
DROP TABLE IF EXISTS postgis_test;