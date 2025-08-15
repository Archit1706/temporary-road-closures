"use client"
import React from 'react';
import {
    Construction,
    Code,
    Server,
    Users,
    MapPin,
    Shield,
    Zap,
    ExternalLink,
    Heart,
    Globe,
    Book,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import EndPointCard from './EndPointCard';

// Main Content Component
const DocsContent = ({ activeSection }: { activeSection: string }) => {

    const renderContent = () => {
        switch (activeSection) {
            case 'introduction':
                return (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                OSM Road Closures API Documentation
                            </h1>
                            <p className="text-xl text-gray-600 mb-6">
                                A comprehensive REST API for managing temporary road closures in the OpenStreetMap ecosystem.
                                Built for Google Summer of Code 2025.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Server className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">REST API</h3>
                                    <p className="text-gray-600 text-sm">Complete CRUD operations with authentication and authorization</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <MapPin className="w-8 h-8 text-green-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">OpenLR Integration</h3>
                                    <p className="text-gray-600 text-sm">Location referencing standard for cross-platform compatibility</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Shield className="w-8 h-8 text-purple-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Secure & Scalable</h3>
                                    <p className="text-gray-600 text-sm">OAuth2 authentication with JWT tokens and role-based access</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                            <p className="text-gray-600 mb-4">
                                The OSM Road Closures API provides a centralized system for collecting and disseminating
                                temporary road closure information. It's designed specifically for the OpenStreetMap ecosystem
                                and supports integration with navigation applications like OsmAnd.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span><strong>Geospatial Support:</strong> PostGIS-powered spatial queries and geometry storage</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span><strong>OpenLR Integration:</strong> Generate map-agnostic location references</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span><strong>Real-time Updates:</strong> Live closure status and validation</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span><strong>Authentication:</strong> OAuth2 + JWT with Google and GitHub integration</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span><strong>Multiple Geometry Types:</strong> Support for both Point and LineString closures</span>
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Technology Stack</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• FastAPI (Python 3.11+)</li>
                                        <li>• PostgreSQL 15 + PostGIS 3.5</li>
                                        <li>• SQLAlchemy + GeoAlchemy2</li>
                                        <li>• Redis (caching & rate limiting)</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Integration</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• OpenLR location referencing</li>
                                        <li>• OAuth2 (Google, GitHub)</li>
                                        <li>• Docker containerization</li>
                                        <li>• OpenAPI 3.0 specification</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'getting-started':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h1>
                            <p className="text-lg text-gray-600">
                                Quick guide to start using the OSM Road Closures API.
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <Zap className="w-6 h-6 text-yellow-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Quick Start</h3>
                                    <p className="text-yellow-700">
                                        The API is currently running in development mode. For production deployment,
                                        follow the deployment guide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Base URL</h2>
                                <CodeBlock code="http://localhost:8000/api/v1" language="text" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Documentation</h2>
                                <p className="text-gray-600 mb-4">
                                    The API provides interactive documentation using Swagger UI:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Swagger UI</h3>
                                        <p className="text-sm text-gray-600 mb-3">Interactive API explorer with authentication</p>
                                        <a
                                            href="http://localhost:8000/api/v1/docs"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                        >
                                            <span>Open Swagger UI</span>
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">OpenAPI Schema</h3>
                                        <p className="text-sm text-gray-600 mb-3">Machine-readable API specification</p>
                                        <a
                                            href="http://localhost:8000/api/v1/openapi.json"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                        >
                                            <span>View Schema</span>
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                                <p className="text-gray-600 mb-4">
                                    The API supports multiple authentication methods:
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Register an Account</h3>
                                        <CodeBlock
                                            code={`curl -X POST "http://localhost:8000/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "your_username",
    "email": "your@email.com",
    "password": "SecurePass123",
    "full_name": "Your Full Name"
  }'`}
                                            language="bash"
                                        />
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Login to Get Token</h3>
                                        <CodeBlock
                                            code={`curl -X POST "http://localhost:8000/api/v1/auth/login" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=your_username&password=SecurePass123"`}
                                            language="bash"
                                        />
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Use Token in Requests</h3>
                                        <CodeBlock
                                            code={`curl -X GET "http://localhost:8000/api/v1/auth/me" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}
                                            language="bash"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Example: Create a Closure</h2>
                                <CodeBlock
                                    code={`curl -X POST "http://localhost:8000/api/v1/closures/" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometry": {
      "type": "LineString",
      "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
    },
    "description": "Water main repair blocking eastbound traffic",
    "closure_type": "construction",
    "start_time": "2025-07-09T08:00:00Z",
    "end_time": "2025-07-09T18:00:00Z",
    "source": "City of Chicago",
    "confidence_level": 9,
    "is_bidirectional": false
  }'`}
                                    language="bash"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'authentication':
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

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">OAuth2 Integration</h3>
                            <p className="text-blue-700 mb-4">
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
                        </div>
                    </div>
                );

            case 'closures':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Closures</h1>
                            <p className="text-lg text-gray-600">
                                Manage temporary road closures with spatial and temporal data.
                            </p>
                        </div>

                        <EndPointCard
                            method="POST"
                            path="/api/v1/closures/"
                            description="Submit a new temporary road closure with geometry and metadata."
                            requestBody={`{
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "start_time": "2025-07-09T08:00:00Z",
  "end_time": "2025-07-09T18:00:00Z",
  "source": "City of Chicago",
  "confidence_level": 9,
  "is_bidirectional": false
}`}
                            responseBody={`{
  "id": 123,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "start_time": "2025-07-09T08:00:00Z",
  "end_time": "2025-07-09T18:00:00Z",
  "status": "active",
  "openlr_code": "CwRbWyNG/ztP",
  "submitter_id": 456,
  "source": "City of Chicago",
  "confidence_level": 9,
  "is_bidirectional": false,
  "is_valid": true,
  "duration_hours": 10.0,
  "created_at": "2025-07-08T14:30:00Z",
  "updated_at": "2025-07-08T14:30:00Z"
}`}
                        />

                        <EndPointCard
                            method="GET"
                            path="/api/v1/closures/"
                            description="Query closures with spatial, temporal, and other filters."
                            parameters={[
                                { name: 'bbox', type: 'string', description: 'Bounding box: min_lon,min_lat,max_lon,max_lat' },
                                { name: 'valid_only', type: 'boolean', description: 'Return only currently valid closures', required: false },
                                { name: 'closure_type', type: 'string', description: 'Filter by closure type', required: false },
                                { name: 'is_bidirectional', type: 'boolean', description: 'Filter by direction', required: false },
                                { name: 'page', type: 'integer', description: 'Page number (default: 1)', required: false },
                                { name: 'size', type: 'integer', description: 'Page size (default: 50)', required: false }
                            ]}
                            responseBody={`{
  "items": [
    {
      "id": 123,
      "geometry": {...},
      "description": "Water main repair...",
      "closure_type": "construction",
      "status": "active",
      "is_valid": true,
      "created_at": "2025-07-08T14:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 50,
  "pages": 1
}`}
                        />

                        <EndPointCard
                            method="GET"
                            path="/api/v1/closures/{closure_id}"
                            description="Get detailed information about a specific closure."
                            parameters={[
                                { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                            ]}
                            responseBody={`{
  "id": 123,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "status": "active",
  "openlr_code": "CwRbWyNG/ztP",
  "is_valid": true,
  "duration_hours": 10.0,
  "is_bidirectional": false,
  "created_at": "2025-07-08T14:30:00Z"
}`}
                        />

                        <EndPointCard
                            method="PUT"
                            path="/api/v1/closures/{closure_id}"
                            description="Update an existing closure. Only the submitter or moderators can edit."
                            parameters={[
                                { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                            ]}
                            requestBody={`{
  "description": "Updated: Water main repair with lane restrictions",
  "end_time": "2025-07-09T20:00:00Z",
  "confidence_level": 8
}`}
                            responseBody={`{
  "id": 123,
  "description": "Updated: Water main repair with lane restrictions",
  "end_time": "2025-07-09T20:00:00Z",
  "confidence_level": 8,
  "updated_at": "2025-07-08T15:00:00Z"
}`}
                        />

                        <EndPointCard
                            method="DELETE"
                            path="/api/v1/closures/{closure_id}"
                            description="Delete a closure. Only the submitter or moderators can delete."
                            parameters={[
                                { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                            ]}
                        />
                        <EndPointCard
                            method="GET"
                            path="/api/v1/closures/statistics/summary"
                            description="Get statistical summary of closures in the system."
                            responseBody={`{
  "total_closures": 150,
  "valid_closures": 45,
  "by_type": {
    "construction": 80,
    "accident": 30,
    "event": 25,
    "maintenance": 15
  },
  "by_status": {
    "active": 45,
    "expired": 90,
    "cancelled": 10,
    "planned": 5
  },
  "avg_duration_hours": 8.5
}`}
                        />

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Supported Geometry Types</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-green-700">LineString (Recommended)</h4>
                                    <p className="text-green-600 text-sm">For road segments and linear closures. Supports OpenLR encoding.</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-700">Point</h4>
                                    <p className="text-green-600 text-sm">For intersection closures or specific locations. OpenLR not applicable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'users':
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

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-orange-800 mb-3">Moderator-Only Endpoints</h3>
                            <p className="text-orange-700 mb-4">
                                The following endpoints require moderator privileges:
                            </p>
                            <div className="space-y-2 text-sm">
                                <div><code className="bg-white px-2 py-1 rounded">GET /api/v1/users/</code> - List all users</div>
                                <div><code className="bg-white px-2 py-1 rounded">{"PUT /api/v1/users/{user_id}"}</code> - Update any user</div>
                                <div><code className="bg-white px-2 py-1 rounded">{"POST /api/v1/users/{user_id}/promote"}</code> - Promote user</div>
                                <div><code className="bg-white px-2 py-1 rounded">{"POST /api/v1/users/{user_id}/deactivate"}</code> - Deactivate user</div>
                                <div><code className="bg-white px-2 py-1 rounded">GET /api/v1/users/search</code> - Search users by username, email, or name</div>
                            </div>
                        </div>
                    </div>
                );

            case 'openlr':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">OpenLR</h1>
                            <p className="text-lg text-gray-600">
                                Open Location Referencing for cross-platform compatibility.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">About OpenLR</h3>
                            <p className="text-blue-700">
                                OpenLR (Open Location Referencing) is a standard for describing road locations in a
                                map-agnostic way. This enables any OSM-based navigation app to accurately map closures
                                onto their own road network, even if the underlying map data differs slightly.
                            </p>
                        </div>

                        <EndPointCard
                            method="GET"
                            path="/api/v1/openlr/info"
                            description="Get OpenLR configuration and statistics."
                            responseBody={`{
  "enabled": true,
  "format": "base64",
  "accuracy_tolerance": 50.0,
  "settings": {
    "enabled": true,
    "format": "base64",
    "max_points": 15,
    "min_distance": 15.0,
    "validate_roundtrip": true
  }
}`}
                        />

                        <EndPointCard
                            method="POST"
                            path="/api/v1/openlr/encode"
                            description="Encode a GeoJSON geometry to OpenLR format with optional validation."
                            requestBody={`{
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "validate_roundtrip": true
}`}
                            responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "accuracy_meters": 12.5,
  "valid": true,
  "metadata": {
    "tolerance_meters": 50.0,
    "original_geometry": {...}
  }
}`}
                        />

                        <EndPointCard
                            method="POST"
                            path="/api/v1/openlr/decode"
                            description="Decode an OpenLR code to GeoJSON geometry."
                            requestBody={`{
  "openlr_code": "CwRbWyNG/ztP"
}`}
                            responseBody={`{
  "success": true,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "metadata": {
    "openlr_code": "CwRbWyNG/ztP",
    "format_detected": "auto"
  }
}`}
                        />

                        <EndPointCard
                            method="POST"
                            path="/api/v1/openlr/encode-osm-way"
                            description="Encode an OpenStreetMap way to OpenLR format."
                            requestBody={`{
  "way_id": 123456789,
  "start_node": 1001,
  "end_node": 1002
}`}
                            responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "metadata": {
    "way_id": 123456789,
    "start_node": 1001,
    "end_node": 1002,
    "source": "OpenStreetMap"
  }
}`}
                        />

                        <EndPointCard
                            method="POST"
                            path="/api/v1/openlr/validate"
                            description="Validate an OpenLR code format and accuracy."
                            requestBody={`{
  "openlr_code": "CwRbWyNG/ztP"
}`}
                            responseBody={`{
  "valid": true,
  "tolerance_meters": 50.0,
  "decoded_geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "openlr_code": "CwRbWyNG/ztP"
}`}
                        />

                        <EndPointCard
                            method="GET"
                            path="/api/v1/openlr/test/coordinates"
                            description="Quick test endpoint for encoding coordinate pairs."
                            parameters={[
                                { name: 'coordinates', type: 'string', description: 'Comma-separated coordinates: lon1,lat1,lon2,lat2,...', required: true }
                            ]}
                            responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "metadata": {
    "input_coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]],
    "coordinate_count": 2
  }
}`}
                        />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Notes</h3>
                            <ul className="space-y-2 text-yellow-700">
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>OpenLR encoding only works with LineString geometries, not Points</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Encoding accuracy depends on the quality of the input geometry</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Roundtrip validation is recommended for production use</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            case 'health':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Check</h1>
                            <p className="text-lg text-gray-600">
                                System health and status monitoring endpoints.
                            </p>
                        </div>

                        <EndPointCard
                            method="GET"
                            path="/health"
                            description="Basic health check endpoint for service monitoring."
                            responseBody={`{
  "status": "healthy",
  "timestamp": 1705492800.0,
  "version": "1.0.0",
  "database": "connected",
  "openlr": {
    "enabled": true,
    "format": "base64"
  }
}`}
                        />

                        <EndPointCard
                            method="GET"
                            path="/health/detailed"
                            description="Detailed health check with system information."
                            responseBody={`{
  "status": "healthy",
  "timestamp": 1705492800.0,
  "version": "1.0.0",
  "environment": "development",
  "database": {
    "postgresql_version": "PostgreSQL 15.3...",
    "postgis_version": "3.5.0",
    "pool_size": 5,
    "checked_out": 2,
    "overflow": 0
  },
  "system": {
    "platform": "Linux-5.15.0-91-generic-x86_64",
    "python_version": "3.11.7",
    "cpu_count": 8,
    "memory_total": 16777216000,
    "memory_available": 8388608000,
    "disk_usage": 45.2
  },
  "openlr": {
    "enabled": true,
    "format": "base64",
    "settings": {
      "accuracy_tolerance": 50.0,
      "validate_roundtrip": true
    }
  }
}`}
                        />

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Monitoring Integration</h3>
                            <p className="text-green-700 mb-4">
                                Use these endpoints for monitoring and alerting:
                            </p>
                            <div className="space-y-2 text-sm text-green-600">
                                <div><strong>Basic monitoring:</strong> <code>/health</code> - Returns 200 if healthy</div>
                                <div><strong>Detailed monitoring:</strong> <code>/health/detailed</code> - Full system status</div>
                                <div><strong>Database check:</strong> Verifies PostgreSQL and PostGIS connectivity</div>
                                <div><strong>OpenLR status:</strong> Configuration and feature availability</div>
                            </div>
                        </div>
                    </div>
                );

            case 'deployment':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Deployment</h1>
                            <p className="text-lg text-gray-600">
                                Guide for deploying the OSM Road Closures API in production.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Quick Start with Docker</h3>
                            <p className="text-blue-700 mb-4">
                                The easiest way to deploy the API is using Docker Compose:
                            </p>
                            <CodeBlock
                                code={`# Clone the repository
git clone https://github.com/Archit1706/temporary-road-closures
cd temporary-road-closures/backend

# Start all services
docker-compose up -d

# Check status
docker-compose ps`}
                                language="bash"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables</h2>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variable</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-900">DATABASE_URL</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">PostgreSQL connection string</td>
                                                <td className="px-6 py-4 text-sm text-green-600">Yes</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-900">SECRET_KEY</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">JWT signing key</td>
                                                <td className="px-6 py-4 text-sm text-green-600">Yes</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-900">ENVIRONMENT</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">Environment (production/development)</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">No</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-900">REDIS_URL</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">Redis connection for caching</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">No</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Configuration</h2>
                                <CodeBlock
                                    code={`# Production environment settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Database (use managed PostgreSQL in production)
DATABASE_URL=postgresql://user:pass@db.example.com:5432/osm_closures

# Security (generate a secure secret key)
SECRET_KEY=your-production-secret-key-256-bits
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (restrict to your domain)
ALLOWED_ORIGINS=["https://your-frontend-domain.com"]
ALLOWED_HOSTS=["your-api-domain.com"]

# Performance
RATE_LIMIT_REQUESTS=1000
DB_POOL_SIZE=20`}
                                    language="env"
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Setup</h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">1. PostgreSQL with PostGIS</h3>
                                        <CodeBlock
                                            code={`# Create database and enable PostGIS
CREATE DATABASE osm_closures;
\\c osm_closures
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;`}
                                            language="sql"
                                        />
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">2. Run Database Migrations</h3>
                                        <CodeBlock
                                            code={`# Initialize database tables
docker-compose exec api alembic upgrade head

# Or manually
python -m alembic upgrade head`}
                                            language="bash"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Monitoring & Logging</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Health Checks</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• <code>/health</code> - Basic health check</li>
                                            <li>• <code>/health/detailed</code> - System information</li>
                                            <li>• Returns 200 when healthy</li>
                                            <li>• Checks database connectivity</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Logging</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• Structured JSON logging</li>
                                            <li>• Configurable log levels</li>
                                            <li>• Request/response logging</li>
                                            <li>• Error tracking and alerts</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'contribute':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contribute</h1>
                            <p className="text-lg text-gray-600">
                                Help improve the OSM Road Closures API project.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Google Summer of Code 2025</h3>
                            <p className="text-blue-700">
                                This project is being developed as part of GSoC 2025 with OpenStreetMap.
                                We welcome community contributions and feedback!
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Setup</h2>
                                    <CodeBlock
                                        code={`# Clone the repository
git clone https://github.com/Archit1706/temporary-road-closures
cd temporary-road-closures

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings

# Start development server
uvicorn app.main:app --reload

# Frontend setup
cd ../frontend
npm install
npm run dev`}
                                        language="bash"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing</h2>
                                    <CodeBlock
                                        code={`# Run backend tests
cd backend
pytest

# Run with coverage
pytest --cov=app

# Test specific modules
pytest tests/test_closures.py -v`}
                                        language="bash"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Ways to Contribute</h2>
                                    <div className="space-y-4">
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">🐛 Bug Reports</h3>
                                            <p className="text-gray-600 text-sm">
                                                Found an issue? Please report it with detailed steps to reproduce.
                                            </p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">✨ Feature Requests</h3>
                                            <p className="text-gray-600 text-sm">
                                                Have an idea for improvement? We'd love to hear about it!
                                            </p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">📖 Documentation</h3>
                                            <p className="text-gray-600 text-sm">
                                                Help improve documentation, examples, and guides.
                                            </p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">🧪 Testing</h3>
                                            <p className="text-gray-600 text-sm">
                                                Test the API with real-world data and edge cases.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Style</h2>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span><strong>Python:</strong> Black formatter, isort for imports</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span><strong>TypeScript:</strong> ESLint with Next.js rules</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span><strong>Documentation:</strong> Comprehensive docstrings</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span><strong>Testing:</strong> Pytest with good coverage</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Links</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <a
                                    href="https://github.com/Archit1706/temporary-road-closures"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <Code className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <div className="font-semibold text-gray-900">GitHub Repository</div>
                                        <div className="text-sm text-gray-600">Source code and issues</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>

                                <a
                                    href="https://summerofcode.withgoogle.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <Globe className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <div className="font-semibold text-gray-900">GSoC 2025</div>
                                        <div className="text-sm text-gray-600">Project information</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>

                                <a
                                    href="https://www.openstreetmap.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <MapPin className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <div className="font-semibold text-gray-900">OpenStreetMap</div>
                                        <div className="text-sm text-gray-600">Join the community</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                );

            case 'acknowledgements':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Acknowledgements</h1>
                            <p className="text-lg text-gray-600">
                                This project is made possible by the amazing open source community and supporters.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                            <div className="text-center mb-8">
                                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Built with ❤️ for the OSM Community</h2>
                                <p className="text-gray-600">
                                    This project exists thanks to the support and collaboration of many individuals and organizations.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                    <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Google Summer of Code</h3>
                                    <p className="text-gray-600 text-sm">For supporting open source development and student participation in OSS projects.</p>
                                </div>

                                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                    <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">OpenStreetMap Foundation</h3>
                                    <p className="text-gray-600 text-sm">For providing the platform and community that makes this project valuable.</p>
                                </div>

                                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Project Mentors</h3>
                                    <p className="text-gray-600 text-sm">Simon Poole and Ian Wagner for their guidance, expertise, and support.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Thanks</h2>
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Open Source Tools & Libraries</h3>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• <strong>FastAPI Team</strong> - Outstanding web framework</li>
                                                <li>• <strong>PostGIS Team</strong> - Excellent geospatial database capabilities</li>
                                                <li>• <strong>PostgreSQL Community</strong> - Robust database foundation</li>
                                                <li>• <strong>Python Ecosystem</strong> - Rich libraries and tools</li>
                                                <li>• <strong>React & Next.js Teams</strong> - Modern frontend framework</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Standards & Specifications</h3>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• <strong>TomTom</strong> - OpenLR specification and reference implementations</li>
                                                <li>• <strong>OGC</strong> - Open geospatial standards</li>
                                                <li>• <strong>OpenAPI Initiative</strong> - API specification standards</li>
                                                <li>• <strong>OSM Community</strong> - Map data standards and practices</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Team</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Archit Rathod</h3>
                                            <p className="text-gray-600 text-sm">Student Developer</p>
                                            <p className="text-gray-500 text-xs mt-1">University of Illinois Chicago</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Simon Poole</h3>
                                            <p className="text-gray-600 text-sm">Project Mentor</p>
                                            <p className="text-gray-500 text-xs mt-1">OpenStreetMap Foundation</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Ian Wagner</h3>
                                            <p className="text-gray-600 text-sm">Project Mentor</p>
                                            <p className="text-gray-500 text-xs mt-1">Stadia Maps</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">University Support</h2>
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start space-x-4">
                                        <Book className="w-8 h-8 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">University of Illinois Chicago</h3>
                                            <p className="text-gray-600 mb-3">
                                                For providing academic support and research opportunities that made this project possible.
                                                Special thanks to the Computer Science department for fostering innovation in geospatial technologies.
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                MS Computer Science Program • Data Science & Geospatial Analytics Track
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">Community Recognition</h3>
                                <p className="text-blue-700 mb-4">
                                    We acknowledge the foundational work of OSM contributors worldwide and the open-source
                                    ecosystem that makes projects like this possible. Every bug report, feature suggestion,
                                    and piece of feedback helps make this project better.
                                </p>
                                <div className="flex justify-center space-x-6">
                                    <a
                                        href="https://github.com/Archit1706/temporary-road-closures/stargazers"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        ⭐ Star the project on GitHub
                                    </a>
                                    <a
                                        href="https://github.com/Archit1706/temporary-road-closures/issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        💬 Join the discussion
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                        <p className="text-gray-600">This section is under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 md:ml-80 p-6 max-w-5xl">
            {renderContent()}
        </div>
    );
};

export default DocsContent;