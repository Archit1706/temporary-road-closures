-- Migration: Make email nullable for OAuth users without email (e.g., OSM)
-- Date: 2025-11-19
-- Description: Allow OAuth users from providers like OpenStreetMap that don't
--              always provide email addresses to register successfully.

-- Make email column nullable
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Add a check constraint to ensure either email is provided OR OAuth provider info is present
ALTER TABLE users ADD CONSTRAINT check_email_or_oauth
    CHECK (
        email IS NOT NULL OR (provider IS NOT NULL AND provider_id IS NOT NULL)
    );

-- Add unique constraint on provider + provider_id to prevent duplicate OAuth accounts
CREATE UNIQUE INDEX idx_users_provider_provider_id
    ON users (provider, provider_id)
    WHERE provider IS NOT NULL AND provider_id IS NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN users.email IS 'User email address (nullable for OAuth users without email)';
