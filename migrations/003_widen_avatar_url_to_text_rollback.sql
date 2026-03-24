-- Rollback: Revert avatar_url column from TEXT back to VARCHAR(255)
-- WARNING: This will truncate any avatar_url values longer than 255 characters

ALTER TABLE users ALTER COLUMN avatar_url TYPE VARCHAR(255);

COMMENT ON COLUMN users.avatar_url IS 'Avatar URL from OAuth provider';
