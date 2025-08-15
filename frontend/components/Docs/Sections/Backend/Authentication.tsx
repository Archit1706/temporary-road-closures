import React from 'react';
import { InfoBox } from '../../Common';
import EndPointCard from '../../EndPointCard';

const Authentication: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h1>
                <p className="text-lg text-gray-600">
                    Secure user authentication with OAuth2 and JWT tokens.
                </p>
            </div>

            <EndPointCard
                method="POST"
                path="/api/v1/auth/register"
                description="Register a new user account with username, email, and password."
                requestBody={`{
  "username": "chicago_mapper",
  "email": "mapper@chicago.gov",
  "password": "SecurePass123",
  "full_name": "Chicago City Mapper"
}`}
                responseBody={`{
  "id": 1,
  "username": "chicago_mapper",
  "email": "mapper@chicago.gov",
  "full_name": "Chicago City Mapper",
  "is_active": true,
  "is_moderator": false,
  "is_verified": false,
  "created_at": "2025-01-15T10:00:00Z"
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/auth/login"
                description="Authenticate user and return access token (OAuth2 compatible)."
                requestBody={`{
  "username": "chicago_mapper",
  "password": "SecurePass123"
}`}
                responseBody={`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "username": "chicago_mapper",
    "email": "mapper@chicago.gov",
    "full_name": "Chicago City Mapper",
    "is_active": true,
    "is_moderator": false,
    "is_verified": true
  }
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/auth/me"
                description="Get information about the currently authenticated user."
                responseBody={`{
  "id": 1,
  "username": "chicago_mapper",
  "email": "mapper@chicago.gov",
  "full_name": "Chicago City Mapper",
  "is_active": true,
  "is_moderator": false,
  "is_verified": true,
  "last_login_at": "2025-01-15T10:00:00Z",
  "created_at": "2025-01-15T09:00:00Z"
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/auth/change-password"
                description="Change user password with current password verification."
                requestBody={`{
  "current_password": "OldPassword123",
  "new_password": "NewSecurePass456"
}`}
                responseBody={`{
  "message": "Password changed successfully"
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/auth/regenerate-api-key"
                description="Generate a new API key for programmatic access."
                responseBody={`{
  "api_key": "osm_closures_abc123def456...",
  "created_at": "2025-01-15T10:00:00Z"
}`}
            />

            <InfoBox type="info" title="OAuth2 Integration">
                <p className="mb-4">
                    The API supports OAuth2 authentication with external providers:
                </p>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <code className="bg-white px-2 py-1 rounded text-sm">GET /api/v1/auth/oauth/google</code>
                        <span className="text-blue-600">- Initiate Google OAuth</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <code className="bg-white px-2 py-1 rounded text-sm">GET /api/v1/auth/oauth/github</code>
                        <span className="text-blue-600">- Initiate GitHub OAuth</span>
                    </div>
                </div>
            </InfoBox>
        </div>
    );
};

export default Authentication;