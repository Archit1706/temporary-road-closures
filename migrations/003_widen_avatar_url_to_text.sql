-- Migration: Widen avatar_url column from VARCHAR(255) to TEXT
-- Date: 2026-03-05
-- Description: OAuth providers (especially OSM and Google) can return avatar URLs
--              that exceed 255 characters. This migration changes the column type
--              to TEXT to prevent StringDataRightTruncation errors during OAuth login.
--              See: GitHub Issue #18

-- Widen avatar_url column to TEXT (no data loss, no downtime)
ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;

-- Add comment to explain the change
COMMENT ON COLUMN users.avatar_url IS 'Avatar URL from OAuth provider (TEXT to support long URLs)';
