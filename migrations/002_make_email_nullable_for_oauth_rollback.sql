-- Rollback Migration: Revert email column to NOT NULL
-- Date: 2025-11-19
-- Description: Rollback changes for nullable email

-- WARNING: This rollback will fail if there are users without email addresses!
-- You must either delete those users or provide them with email addresses first.

-- Drop the unique index on provider + provider_id
DROP INDEX IF EXISTS idx_users_provider_provider_id;

-- Drop the check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_email_or_oauth;

-- Make email NOT NULL again (will fail if any users have NULL email)
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Restore original comment
COMMENT ON COLUMN users.email IS 'User email address';
