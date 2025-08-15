import React from 'react';
import { InfoBox } from '../../Common';
import EndPointCard from '../../EndPointCard';

const Users: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Users</h1>
                <p className="text-lg text-gray-600">
                    User management and profile operations.
                </p>
            </div>

            <EndPointCard
                method="GET"
                path="/api/v1/users/{user_id}"
                description="Get user information by user ID (public endpoint)."
                parameters={[
                    { name: 'user_id', type: 'integer', description: 'User ID', required: true }
                ]}
                responseBody={`{
  "id": 1,
  "username": "chicago_mapper",
  "email": "mapper@chicago.gov",
  "full_name": "Chicago City Mapper",
  "is_active": true,
  "is_moderator": false,
  "is_verified": true,
  "created_at": "2025-01-15T09:00:00Z"
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/users/{user_id}/stats"
                description="Get user activity statistics."
                parameters={[
                    { name: 'user_id', type: 'integer', description: 'User ID', required: true }
                ]}
                responseBody={`{
  "total_closures": 25,
  "active_closures": 8,
  "last_submission": "2025-01-15T08:30:00Z"
}`}
            />

            <EndPointCard
                method="PUT"
                path="/api/v1/users/me"
                description="Update current user's profile information."
                requestBody={`{
  "full_name": "Updated Full Name",
  "email": "new.email@example.com"
}`}
                responseBody={`{
  "id": 1,
  "username": "chicago_mapper",
  "email": "new.email@example.com",
  "full_name": "Updated Full Name",
  "is_verified": false,
  "updated_at": "2025-01-15T10:30:00Z"
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/users/search"
                description="Search users by username, email, or name."
                parameters={[
                    { name: 'q', type: 'string', description: 'Search query (min 3 characters)', required: true },
                    { name: 'limit', type: 'integer', description: 'Maximum results (1-50, default: 10)', required: false }
                ]}
                responseBody={`[
  {
    "id": 1,
    "username": "chicago_mapper",
    "full_name": "Chicago City Mapper",
    "is_moderator": false,
    "created_at": "2025-01-15T09:00:00Z"
  }
]`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/users/me/api-key"
                description="Get current user's API key for programmatic access."
                responseBody={`{
  "api_key": "osm_closures_abc123def456...",
  "created_at": "2025-01-15T09:00:00Z"
}`}
            />

            <InfoBox type="warning" title="Moderator-Only Endpoints">
                <p className="mb-4">
                    The following endpoints require moderator privileges:
                </p>
                <div className="space-y-2 text-sm">
                    <div><code className="bg-white px-2 py-1 rounded">GET /api/v1/users/</code> - List all users</div>
                    <div><code className="bg-white px-2 py-1 rounded">{"PUT /api/v1/users/{user_id}"}</code> - Update any user</div>
                    <div><code className="bg-white px-2 py-1 rounded">{"POST /api/v1/users/{user_id}/promote"}</code> - Promote user</div>
                    <div><code className="bg-white px-2 py-1 rounded">{"POST /api/v1/users/{user_id}/deactivate"}</code> - Deactivate user</div>
                    <div><code className="bg-white px-2 py-1 rounded">GET /api/v1/users/search</code> - Search users by username, email, or name</div>
                </div>
            </InfoBox>
        </div>
    );
};

export default Users;