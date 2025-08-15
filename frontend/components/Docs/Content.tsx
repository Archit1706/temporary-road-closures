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
    Monitor,
    Smartphone,
    Edit,
    Target,
    Route,
    Navigation,
    Eye,
    Settings,
    Database,
    Layers,
    Play,
    Download,
    Terminal,
    Chrome,
    Wifi,
    Lock,
    CheckCircle,
    AlertCircle,
    Info,
    Palette,
    Layout,
    RefreshCw,
    MousePointer,
    Map as MapIcon,
    Clock,
    Calendar,
    User,
    Building2
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

            // Frontend Documentation Sections Start Here
            case 'frontend-intro':
                return (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Frontend Closure Reporting
                            </h1>
                            <p className="text-xl text-gray-600 mb-6">
                                User-friendly web application for reporting and viewing temporary road closures.
                                Built with Next.js and designed for the OpenStreetMap community.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Monitor className="w-8 h-8 text-green-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Web Application</h3>
                                    <p className="text-gray-600 text-sm">Interactive map-based interface for community reporting</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Smartphone className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
                                    <p className="text-gray-600 text-sm">Works seamlessly on desktop, tablet, and mobile devices</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Users className="w-8 h-8 text-purple-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                                    <p className="text-gray-600 text-sm">Designed for OSM contributors and navigation app users</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the Frontend Application?</h2>
                            <p className="text-gray-600 mb-4">
                                The OSM Road Closures Frontend is a web application that allows community members to easily
                                report temporary road closures and view existing ones on an interactive map. It serves as
                                the primary user interface for the OSM Road Closures system, making it accessible to
                                non-technical users who want to contribute to keeping navigation data up-to-date.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Who Can Use It?</h3>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">👥 Community Members</h4>
                                    <ul className="space-y-1 text-blue-700 text-sm">
                                        <li>• OpenStreetMap contributors</li>
                                        <li>• Local residents reporting closures</li>
                                        <li>• City officials and organizations</li>
                                        <li>• Navigation app users</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-900 mb-2">🎯 Use Cases</h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                        <li>• Report construction work</li>
                                        <li>• Alert about traffic accidents</li>
                                        <li>• Notify about public events</li>
                                        <li>• Share emergency road conditions</li>
                                    </ul>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Interactive OpenStreetMap</h4>
                                        <p className="text-gray-600 text-sm">View and navigate the map to see existing closures and select locations for new reports.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Edit className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Easy Reporting Form</h4>
                                        <p className="text-gray-600 text-sm">Step-by-step guided form to report closures with all necessary details and validation.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Eye className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Real-time Visualization</h4>
                                        <p className="text-gray-600 text-sm">See active, upcoming, and expired closures with clear visual indicators and status information.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Route className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Geometry Support</h4>
                                        <p className="text-gray-600 text-sm">Support for both point closures (intersections) and road segment closures with route calculation.</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Two Operating Modes</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-orange-900 mb-2">🎮 Demo Mode</h4>
                                    <p className="text-orange-700 text-sm mb-3">
                                        Try the application without authentication using sample data from the Chicago area.
                                    </p>
                                    <ul className="space-y-1 text-orange-600 text-sm">
                                        <li>• View 25+ sample closures</li>
                                        <li>• Create temporary demo closures</li>
                                        <li>• Test all features safely</li>
                                        <li>• No permanent data storage</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-900 mb-2">🔐 Authenticated Mode</h4>
                                    <p className="text-green-700 text-sm mb-3">
                                        Login to access the full backend API with persistent data storage.
                                    </p>
                                    <ul className="space-y-1 text-green-600 text-sm">
                                        <li>• Create permanent closure reports</li>
                                        <li>• Edit and delete your closures</li>
                                        <li>• Access advanced features</li>
                                        <li>• OpenLR encoding integration</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Globe className="w-5 h-5" />
                                        <span>Google Summer of Code 2025 Project</span>
                                    </div>
                                </h3>
                                <p className="text-blue-700">
                                    This frontend application is part of a comprehensive GSoC 2025 project that includes
                                    a FastAPI backend, OpenLR integration, and planned OsmAnd navigation app integration.
                                    It demonstrates how modern web technologies can make OSM data more accessible to the community.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'frontend-usage':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Usage Guide</h1>
                            <p className="text-lg text-gray-600">
                                Step-by-step guide to using the OSM Road Closures frontend application.
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <Play className="w-6 h-6 text-green-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Getting Started</h3>
                                    <p className="text-green-700">
                                        You can start using the application immediately in demo mode, or log in for full functionality.
                                        This guide covers both scenarios with detailed step-by-step instructions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Step 1: Accessing the Application */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    <span>Accessing the Application</span>
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Opening the Web App</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Open your web browser (Chrome, Firefox, Safari, or Edge)</li>
                                            <li>2. Navigate to the application URL (typically <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code> for local development)</li>
                                            <li>3. Wait for the map to load completely</li>
                                        </ol>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                                        </div>
                                        <p className="text-blue-700 text-sm">
                                            [Add screenshot: Main application interface showing the map, header, and sidebar]
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding the Interface</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">Main Components:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• Header with title and login/logout buttons</li>
                                                    <li>• Left sidebar showing list of closures</li>
                                                    <li>• Central interactive map</li>
                                                    <li>• Status indicators in bottom-right corner</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">Status Indicators:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• 🟢 Backend Connected (authenticated)</li>
                                                    <li>• 🟠 Demo Mode (not authenticated)</li>
                                                    <li>• Connection and data source status</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Authentication (Optional) */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <span>Authentication (Optional)</span>
                                </h2>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                        <span className="font-medium text-amber-800">Demo vs Authenticated Mode</span>
                                    </div>
                                    <p className="text-amber-700 text-sm mt-1">
                                        You can use the app without logging in (demo mode), but authentication enables permanent data storage and advanced features.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Logging In</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Click the "Login" button in the top-right corner</li>
                                            <li>2. Fill in your username and password</li>
                                            <li>3. Use demo credentials if testing: <code className="bg-gray-100 px-2 py-1 rounded">chicago_mapper / SecurePass123</code></li>
                                            <li>4. Click "Sign in" to authenticate</li>
                                        </ol>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                                        </div>
                                        <p className="text-blue-700 text-sm">
                                            [Add screenshot: Login modal with form fields and demo credentials section]
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating an Account</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Click "Sign up here" on the login page</li>
                                            <li>2. Fill in the registration form with your details</li>
                                            <li>3. Choose a secure password (minimum 8 characters)</li>
                                            <li>4. Complete registration and automatic login</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Viewing Existing Closures */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <span>Viewing Existing Closures</span>
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Exploring the Map</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li>• <strong>Navigation:</strong> Click and drag to pan, scroll to zoom in/out</li>
                                            <li>• <strong>Closure Markers:</strong> Red lines/points show active closures, gray shows expired ones</li>
                                            <li>• <strong>Direction Arrows:</strong> Arrows on road segments show traffic direction</li>
                                            <li>• <strong>Click for Details:</strong> Click any closure to see detailed information</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                                        </div>
                                        <p className="text-blue-700 text-sm">
                                            [Add screenshot: Map showing various closures with different colors and direction arrows]
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Using the Sidebar</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Closure List Features:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• Summary statistics (Active/Upcoming/Expired)</li>
                                                    <li>• Geometry type breakdown (Points/Segments)</li>
                                                    <li>• Individual closure cards with details</li>
                                                    <li>• Click any closure to focus on map</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Status Colors:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• 🔴 Red badge: Currently active</li>
                                                    <li>• 🟡 Yellow badge: Upcoming/scheduled</li>
                                                    <li>• ⚫ Gray badge: Expired/completed</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding Closure Information</h3>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-medium text-blue-800 mb-2">Each closure shows:</h4>
                                            <ul className="space-y-1 text-sm text-blue-700">
                                                <li>• Description of the closure (e.g., "Water main repair")</li>
                                                <li>• Type and reason (construction, accident, event, etc.)</li>
                                                <li>• Duration and timing information</li>
                                                <li>• Confidence level (1-10 scale)</li>
                                                <li>• Direction info (Point, Bidirectional, or Unidirectional)</li>
                                                <li>• Source organization or reporter</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4: Reporting a New Closure */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    <span>Reporting a New Closure</span>
                                </h2>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-green-800">Authentication Required</span>
                                    </div>
                                    <p className="text-green-700 text-sm mt-1">
                                        You must be logged in to report new closures. In demo mode, you can practice but changes won't be saved permanently.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Starting the Report Process</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Click the "Report Closure" button in the header</li>
                                            <li>2. A step-by-step form will open on the right side</li>
                                            <li>3. The form has 3 steps: Details, Location & Timing, and Review</li>
                                        </ol>

                                        <div className="bg-gray-50 rounded-lg p-4 mt-3">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Info className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                                            </div>
                                            <p className="text-blue-700 text-sm">
                                                [Add screenshot: Report Closure button highlighted and form opening on the right]
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Closure Details</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium text-gray-700">Required Information:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600 mt-1">
                                                    <li>• <strong>Description:</strong> Clear explanation of the closure (minimum 10 characters)</li>
                                                    <li>• <strong>Closure Type:</strong> Point (intersection) or Road Segment (linear closure)</li>
                                                    <li>• <strong>Reason:</strong> Construction, accident, event, maintenance, etc.</li>
                                                    <li>• <strong>Confidence Level:</strong> How certain you are (1=unsure to 10=confirmed)</li>
                                                </ul>
                                            </div>

                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                                <h4 className="font-medium text-orange-800 mb-2">Choosing Geometry Type:</h4>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div>
                                                        <h5 className="font-medium text-orange-700 text-sm flex items-center space-x-1">
                                                            <Target className="w-4 h-4" />
                                                            <span>Point Closure</span>
                                                        </h5>
                                                        <p className="text-orange-600 text-xs">For intersections, specific addresses, or localized blockages</p>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-orange-700 text-sm flex items-center space-x-1">
                                                            <Route className="w-4 h-4" />
                                                            <span>Road Segment</span>
                                                        </h5>
                                                        <p className="text-orange-600 text-xs">For construction zones, parade routes, or multi-block closures</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Location & Timing</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Selecting Location:</h4>
                                                <ol className="space-y-1 text-sm text-gray-600">
                                                    <li>1. Click "Select Points" to activate map selection mode</li>
                                                    <li>2. For Point closures: Click once on the map</li>
                                                    <li>3. For Road Segments: Click multiple points to define the route</li>
                                                    <li>4. The system automatically calculates the best road path using Valhalla routing</li>
                                                    <li>5. Click "Done" when finished selecting points</li>
                                                </ol>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Info className="w-4 h-4 text-blue-600" />
                                                    <span className="font-medium text-blue-800">GIF Placeholder</span>
                                                </div>
                                                <p className="text-blue-700 text-sm">
                                                    [Add animated GIF: Showing point selection process for both Point and LineString geometries]
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Additional Settings:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• <strong>Start/End Times:</strong> When the closure begins and ends</li>
                                                    <li>• <strong>Direction (Road Segments only):</strong> Bidirectional or one-way closure</li>
                                                    <li>• <strong>Source:</strong> Organization or person reporting the closure</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 3: Review & Submit</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium text-gray-700">Final Review:</h4>
                                                <ul className="space-y-1 text-sm text-gray-600 mt-1">
                                                    <li>• Check all details for accuracy</li>
                                                    <li>• Verify location and route calculation</li>
                                                    <li>• Confirm timing and direction settings</li>
                                                    <li>• Review data source and integration notices</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700">Submission Options:</h4>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="bg-green-50 border border-green-200 rounded p-3">
                                                        <h5 className="font-medium text-green-800 text-sm">Authenticated Mode</h5>
                                                        <p className="text-green-700 text-xs">Saves to backend database with OpenLR encoding</p>
                                                    </div>
                                                    <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                                        <h5 className="font-medium text-orange-800 text-sm">Demo Mode</h5>
                                                        <p className="text-orange-700 text-xs">Creates temporary closure for testing (resets on refresh)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                                                <Edit className="w-5 h-5" />
                                                <span>Submit Closure Report</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 5: Managing Your Closures */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                                    <span>Managing Your Closures</span>
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Editing and Deleting</h3>
                                        <p className="text-gray-600 mb-3">
                                            When authenticated, you can modify closures that you've created:
                                        </p>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Find your closure in the sidebar (marked with green edit icon)</li>
                                            <li>2. Hover over the closure card to reveal edit/delete buttons</li>
                                            <li>3. Click the edit button to modify details, timing, or status</li>
                                            <li>4. Use delete button to remove incorrect or outdated closures</li>
                                        </ol>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                                        </div>
                                        <p className="text-blue-700 text-sm">
                                            [Add screenshot: Sidebar showing closures with edit/delete buttons visible on hover]
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Status Updates</h3>
                                        <p className="text-gray-600 mb-2">
                                            You can update the status of your closures:
                                        </p>
                                        <ul className="space-y-1 text-sm text-gray-600">
                                            <li>• <strong>Active:</strong> Currently blocking traffic</li>
                                            <li>• <strong>Cancelled:</strong> Closure was cancelled or postponed</li>
                                            <li>• <strong>Expired:</strong> Closure has ended</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Step 6: Tips and Best Practices */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                                    <span>Tips and Best Practices</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Reporting Guidelines</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Be specific in descriptions (include street names, landmarks)</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Set accurate time ranges for scheduled work</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Use appropriate confidence levels based on your source</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Update or delete closures when situations change</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Tips</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <Settings className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Works on desktop, tablet, and mobile browsers</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Wifi className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Requires internet connection for map and API access</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <RefreshCw className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Map data updates automatically as you navigate</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <MousePointer className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Use precise clicking for accurate location selection</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                                    <h4 className="font-medium text-yellow-800 mb-2">🎯 Remember</h4>
                                    <p className="text-yellow-700 text-sm">
                                        This application feeds into the broader OpenStreetMap ecosystem. Accurate and timely
                                        closure reports help navigation apps provide better routing for everyone in the community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'frontend-setup':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Local Setup</h1>
                            <p className="text-lg text-gray-600">
                                Complete guide to setting up the Next.js frontend application locally for development.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <Terminal className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Development Environment</h3>
                                    <p className="text-blue-700">
                                        This setup guide covers installing dependencies, configuring the environment,
                                        and running the development server. Suitable for contributors and local testing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Prerequisites */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Software</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Node.js 18+</h4>
                                                <p className="text-gray-600 text-sm mb-2">JavaScript runtime for running the development server</p>
                                                <a
                                                    href="https://nodejs.org/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    <span>Download Node.js</span>
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Git</h4>
                                                <p className="text-gray-600 text-sm mb-2">Version control for cloning the repository</p>
                                                <a
                                                    href="https://git-scm.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    <span>Download Git</span>
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Package Managers (Choose One)</h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <h4 className="font-medium text-green-800 text-sm">npm (Recommended)</h4>
                                                <p className="text-green-700 text-xs">Comes with Node.js installation</p>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <h4 className="font-medium text-blue-800 text-sm">yarn</h4>
                                                <p className="text-blue-700 text-xs">Alternative package manager</p>
                                            </div>
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                <h4 className="font-medium text-purple-800 text-sm">pnpm</h4>
                                                <p className="text-purple-700 text-xs">Fast, disk space efficient</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend API (Optional)</h3>
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <p className="text-amber-700 text-sm">
                                                <strong>Note:</strong> The frontend works in demo mode without the backend.
                                                For full functionality, set up the FastAPI backend first (see Backend API section).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Installation Steps */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation Steps</h2>

                                <div className="space-y-6">
                                    {/* Step 1: Clone Repository */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                            <span>Clone the Repository</span>
                                        </h3>
                                        <CodeBlock
                                            code={`# Clone the project repository
git clone https://github.com/Archit1706/temporary-road-closures.git

# Navigate to the frontend directory
cd temporary-road-closures/frontend`}
                                            language="bash"
                                        />
                                    </div>

                                    {/* Step 2: Install Dependencies */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                            <span>Install Dependencies</span>
                                        </h3>
                                        <p className="text-gray-600 mb-3">Choose your preferred package manager:</p>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Using npm (Recommended)</h4>
                                                <CodeBlock code="npm install" language="bash" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Using yarn</h4>
                                                <CodeBlock code="yarn install" language="bash" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Using pnpm</h4>
                                                <CodeBlock code="pnpm install" language="bash" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: Environment Configuration */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                            <span>Environment Configuration</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Create Environment File</h4>
                                                <CodeBlock
                                                    code={`# Create .env.local file in the frontend directory
cp .env.example .env.local

# Or create manually
touch .env.local`}
                                                    language="bash"
                                                />
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Configure Environment Variables</h4>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    Add the following variables to your <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file:
                                                </p>
                                                <CodeBlock
                                                    code={`# Backend API URL (adjust if your backend runs on different port)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Enable debug mode for development
NEXT_PUBLIC_DEBUG=true

# Optional: Valhalla routing service URL (if different from backend)
NEXT_PUBLIC_VALHALLA_URL=http://localhost:8002`}
                                                    language="env"
                                                />
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <h4 className="font-medium text-yellow-800 mb-2">Environment Variables Explained</h4>
                                                <ul className="space-y-1 text-sm text-yellow-700">
                                                    <li>• <code>NEXT_PUBLIC_API_URL</code>: Backend FastAPI server URL</li>
                                                    <li>• <code>NEXT_PUBLIC_DEBUG</code>: Enables console logging for debugging</li>
                                                    <li>• <code>NEXT_PUBLIC_VALHALLA_URL</code>: Valhalla routing service endpoint</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 4: Start Development Server */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                            <span>Start Development Server</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Run the Development Server</h4>
                                                <CodeBlock
                                                    code={`# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev`}
                                                    language="bash"
                                                />
                                            </div>

                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-800 mb-2">Success Indicators</h4>
                                                <p className="text-green-700 text-sm mb-2">
                                                    If everything is working correctly, you should see:
                                                </p>
                                                <ul className="space-y-1 text-sm text-green-600">
                                                    <li>• Server starting on <code>http://localhost:3000</code></li>
                                                    <li>• No compilation errors in the terminal</li>
                                                    <li>• Browser automatically opens to the application</li>
                                                    <li>• Map loads and displays demo closures</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification and Testing */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification and Testing</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Access the Application</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Open your browser and navigate to <a href="http://localhost:3000" className="text-blue-600 hover:underline">http://localhost:3000</a></li>
                                            <li>2. Wait for the map to load completely</li>
                                            <li>3. Check that demo closures are visible on the map</li>
                                            <li>4. Verify the sidebar shows closure statistics</li>
                                            <li>5. Confirm the demo control panel appears in the bottom-right</li>
                                        </ol>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Testing Core Features</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-800 mb-2">Demo Mode Testing</h4>
                                                <ul className="space-y-1 text-sm text-blue-700">
                                                    <li>• Map navigation (pan, zoom)</li>
                                                    <li>• Closure visibility and clicking</li>
                                                    <li>• Sidebar interaction</li>
                                                    <li>• Demo closure creation</li>
                                                </ul>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-800 mb-2">Backend Integration Testing</h4>
                                                <ul className="space-y-1 text-sm text-green-700">
                                                    <li>• Login functionality</li>
                                                    <li>• Persistent closure creation</li>
                                                    <li>• Edit/delete operations</li>
                                                    <li>• OpenLR encoding display</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Issues and Solutions</h3>
                                        <div className="space-y-3">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h4 className="font-medium text-red-800 mb-2">Port Already in Use</h4>
                                                <p className="text-red-700 text-sm mb-2">Error: "Port 3000 is already in use"</p>
                                                <CodeBlock
                                                    code={`# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001`}
                                                    language="bash"
                                                />
                                            </div>

                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h4 className="font-medium text-red-800 mb-2">Map Not Loading</h4>
                                                <p className="text-red-700 text-sm mb-2">Check browser console for errors</p>
                                                <ul className="space-y-1 text-sm text-red-600">
                                                    <li>• Ensure internet connection for map tiles</li>
                                                    <li>• Check for JavaScript errors in console</li>
                                                    <li>• Verify Leaflet CSS is loading properly</li>
                                                    <li>• Try hard refresh (Ctrl+F5)</li>
                                                </ul>
                                            </div>

                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h4 className="font-medium text-red-800 mb-2">Backend Connection Issues</h4>
                                                <p className="text-red-700 text-sm mb-2">API calls failing or demo mode stuck</p>
                                                <ul className="space-y-1 text-sm text-red-600">
                                                    <li>• Verify NEXT_PUBLIC_API_URL in .env.local</li>
                                                    <li>• Check if backend server is running</li>
                                                    <li>• Test backend health: <code>http://localhost:8000/health</code></li>
                                                    <li>• Check browser network tab for CORS errors</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Development Scripts */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Scripts</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Commands</h3>
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Development Server</h4>
                                                <CodeBlock code="npm run dev" language="bash" />
                                                <p className="text-gray-600 text-sm mt-2">Starts development server with hot reload at http://localhost:3000</p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Production Build</h4>
                                                <CodeBlock code="npm run build" language="bash" />
                                                <p className="text-gray-600 text-sm mt-2">Creates optimized production build in .next folder</p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Production Server</h4>
                                                <CodeBlock code="npm run start" language="bash" />
                                                <p className="text-gray-600 text-sm mt-2">Runs production server (requires build first)</p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Linting</h4>
                                                <CodeBlock code="npm run lint" language="bash" />
                                                <p className="text-gray-600 text-sm mt-2">Runs ESLint to check code quality and style</p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Type Checking</h4>
                                                <CodeBlock code="npx tsc --noEmit" language="bash" />
                                                <p className="text-gray-600 text-sm mt-2">Checks TypeScript types without generating files</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Development Workflow</h3>
                                        <ol className="space-y-2 text-gray-600">
                                            <li>1. Start development server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
                                            <li>2. Make changes to source files</li>
                                            <li>3. Check browser for hot-reloaded changes</li>
                                            <li>4. Run linting: <code className="bg-gray-100 px-2 py-1 rounded">npm run lint</code></li>
                                            <li>5. Test production build: <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code></li>
                                            <li>6. Commit changes to git</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Browser Support */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Support & Requirements</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Supported Browsers</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-3">
                                                <Chrome className="w-5 h-5 text-orange-500" />
                                                <span className="text-gray-700">Chrome 88+</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Globe className="w-5 h-5 text-orange-500" />
                                                <span className="text-gray-700">Firefox 85+</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Globe className="w-5 h-5 text-blue-500" />
                                                <span className="text-gray-700">Safari 14+</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Globe className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-700">Edge 88+</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>JavaScript enabled</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Internet connection for map tiles</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Local storage for demo mode</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Geolocation API (optional)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'frontend-features':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Features Overview</h1>
                            <p className="text-lg text-gray-600">
                                Comprehensive overview of all features available in the OSM Road Closures frontend application.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <MapIcon className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-semibold text-blue-900 mb-2">Interactive Mapping</h3>
                                <p className="text-blue-700 text-sm">OpenStreetMap-based interface with real-time closure visualization</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <Edit className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-semibold text-green-900 mb-2">Community Reporting</h3>
                                <p className="text-green-700 text-sm">Easy-to-use forms for submitting closure information</p>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <Smartphone className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="font-semibold text-purple-900 mb-2">Mobile Responsive</h3>
                                <p className="text-purple-700 text-sm">Optimized for all device types and screen sizes</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Map Features */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <MapIcon className="w-6 h-6 text-blue-600" />
                                    <span>Interactive Map Features</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Navigation</h3>
                                            <ul className="space-y-1 text-gray-600 text-sm">
                                                <li>• Pan by clicking and dragging</li>
                                                <li>• Zoom with mouse wheel or touch gestures</li>
                                                <li>• Automatic bounds adjustment for closures</li>
                                                <li>• Smooth animations and transitions</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Closure Visualization</h3>
                                            <ul className="space-y-1 text-gray-600 text-sm">
                                                <li>• Color-coded status indicators (red=active, gray=expired)</li>
                                                <li>• Point markers for intersection closures</li>
                                                <li>• Road segment lines for linear closures</li>
                                                <li>• Direction arrows for traffic flow indication</li>
                                                <li>• Bidirectional closure indicators</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Elements</h3>
                                            <ul className="space-y-1 text-gray-600 text-sm">
                                                <li>• Click closures for detailed popups</li>
                                                <li>• Hover effects for better UX</li>
                                                <li>• Selection highlighting</li>
                                                <li>• Real-time cursor changes for selection mode</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dynamic Loading</h3>
                                            <ul className="space-y-1 text-gray-600 text-sm">
                                                <li>• Automatic data fetching based on map bounds</li>
                                                <li>• Efficient rendering for large datasets</li>
                                                <li>• Progressive loading indicators</li>
                                                <li>• Error handling and retry mechanisms</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Geometry Support */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Route className="w-6 h-6 text-orange-600" />
                                    <span>Geometry Type Support</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Target className="w-5 h-5 text-orange-600" />
                                            <h3 className="font-semibold text-orange-900">Point Closures</h3>
                                        </div>
                                        <ul className="space-y-1 text-orange-700 text-sm">
                                            <li>• Single location intersections</li>
                                            <li>• Building entrances and specific addresses</li>
                                            <li>• Accident locations</li>
                                            <li>• Emergency service blockages</li>
                                            <li>• One-click selection process</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Route className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-semibold text-blue-900">Road Segment Closures</h3>
                                        </div>
                                        <ul className="space-y-1 text-blue-700 text-sm">
                                            <li>• Construction zones spanning multiple blocks</li>
                                            <li>• Parade and event routes</li>
                                            <li>• Multi-point route calculation</li>
                                            <li>• Valhalla integration for accurate paths</li>
                                            <li>• Bidirectional traffic control</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                                        <Zap className="w-5 h-5" />
                                        <span>Automatic Route Calculation</span>
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        For road segment closures, the system automatically calculates the optimal route between
                                        selected points using Valhalla routing engine, ensuring accurate representation of actual road paths.
                                    </p>
                                </div>
                            </div>

                            {/* Form Features */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Edit className="w-6 h-6 text-green-600" />
                                    <span>Reporting and Forms</span>
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Multi-Step Form Process</h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Step 1: Details</h4>
                                                <ul className="space-y-1 text-blue-700 text-xs">
                                                    <li>• Closure description</li>
                                                    <li>• Geometry type selection</li>
                                                    <li>• Reason/category</li>
                                                    <li>• Confidence level</li>
                                                    <li>• Status (for edits)</li>
                                                </ul>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-900 mb-2">Step 2: Location & Time</h4>
                                                <ul className="space-y-1 text-green-700 text-xs">
                                                    <li>• Interactive point selection</li>
                                                    <li>• Route calculation</li>
                                                    <li>• Start/end timing</li>
                                                    <li>• Traffic direction</li>
                                                    <li>• Source organization</li>
                                                </ul>
                                            </div>
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                <h4 className="font-medium text-purple-900 mb-2">Step 3: Review</h4>
                                                <ul className="space-y-1 text-purple-700 text-xs">
                                                    <li>• Summary verification</li>
                                                    <li>• OpenLR integration status</li>
                                                    <li>• Backend connection info</li>
                                                    <li>• Final submission</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Form Validation and UX</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">Real-time Validation</h4>
                                                <ul className="space-y-1 text-gray-600 text-sm">
                                                    <li>• Field-by-field error checking</li>
                                                    <li>• Progress indicators</li>
                                                    <li>• Step completion status</li>
                                                    <li>• Inline help text</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">User Experience</h4>
                                                <ul className="space-y-1 text-gray-600 text-sm">
                                                    <li>• Collapsible sidebar interface</li>
                                                    <li>• Mobile-optimized layouts</li>
                                                    <li>• Clear visual feedback</li>
                                                    <li>• Confirmation dialogs</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Authentication and User Management */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Lock className="w-6 h-6 text-purple-600" />
                                    <span>Authentication and User Management</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentication Features</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>JWT token-based authentication</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>User registration and login</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Demo credentials for testing</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Automatic session management</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Secure logout and token cleanup</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">User Permissions</h3>
                                        <div className="space-y-3">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <h4 className="font-medium text-green-800 text-sm">Authenticated Users</h4>
                                                <ul className="space-y-1 text-green-700 text-xs">
                                                    <li>• Create permanent closures</li>
                                                    <li>• Edit own submissions</li>
                                                    <li>• Delete own closures</li>
                                                    <li>• Access full backend features</li>
                                                </ul>
                                            </div>
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                <h4 className="font-medium text-orange-800 text-sm">Demo Users</h4>
                                                <ul className="space-y-1 text-orange-700 text-xs">
                                                    <li>• View all existing closures</li>
                                                    <li>• Create temporary demo closures</li>
                                                    <li>• Test all interface features</li>
                                                    <li>• No persistent data storage</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Real-time Features */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <RefreshCw className="w-6 h-6 text-indigo-600" />
                                    <span>Real-time and Live Features</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Data Updates</h3>
                                        <ul className="space-y-1 text-gray-600 text-sm">
                                            <li>• Automatic closure status calculation</li>
                                            <li>• Real-time expiration tracking</li>
                                            <li>• Dynamic sidebar statistics</li>
                                            <li>• Live geometry type analysis</li>
                                            <li>• Connection status monitoring</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Feedback</h3>
                                        <ul className="space-y-1 text-gray-600 text-sm">
                                            <li>• Toast notifications for actions</li>
                                            <li>• Loading states and progress indicators</li>
                                            <li>• Error handling with user-friendly messages</li>
                                            <li>• Success confirmations</li>
                                            <li>• Real-time form validation</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-indigo-900 mb-2">Status Tracking</h3>
                                    <p className="text-indigo-700 text-sm">
                                        The application automatically categorizes closures as Active, Upcoming, or Expired based on
                                        current time vs. closure start/end times, providing real-time status without manual updates.
                                    </p>
                                </div>
                            </div>

                            {/* Accessibility and Performance */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Eye className="w-6 h-6 text-cyan-600" />
                                    <span>Accessibility and Performance</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Accessibility Features</h3>
                                        <ul className="space-y-1 text-gray-600 text-sm">
                                            <li>• WCAG-compliant color contrast</li>
                                            <li>• Keyboard navigation support</li>
                                            <li>• Screen reader friendly markup</li>
                                            <li>• Focus indicators and management</li>
                                            <li>• Alternative text for visual elements</li>
                                            <li>• Clear visual hierarchy</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Optimizations</h3>
                                        <ul className="space-y-1 text-gray-600 text-sm">
                                            <li>• Code splitting and lazy loading</li>
                                            <li>• Efficient map rendering</li>
                                            <li>• Optimized API request batching</li>
                                            <li>• Image and asset optimization</li>
                                            <li>• Client-side caching strategies</li>
                                            <li>• Progressive enhancement</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Development and Debug Features */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Settings className="w-6 h-6 text-gray-600" />
                                    <span>Development and Debug Features</span>
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Demo Control Panel</h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Advanced debug panel available in bottom-right corner showing:
                                        </p>
                                        <ul className="space-y-1 text-gray-600 text-sm">
                                            <li>• Backend connection status</li>
                                            <li>• Authentication state</li>
                                            <li>• Data source information</li>
                                            <li>• API endpoint health</li>
                                            <li>• Demo data reset functionality</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Handling</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">User-Facing</h4>
                                                <ul className="space-y-1 text-gray-600 text-sm">
                                                    <li>• Graceful fallbacks for API failures</li>
                                                    <li>• Clear error messages</li>
                                                    <li>• Retry mechanisms</li>
                                                    <li>• Offline mode indicators</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-1">Developer Tools</h4>
                                                <ul className="space-y-1 text-gray-600 text-sm">
                                                    <li>• Console logging for debugging</li>
                                                    <li>• Network request monitoring</li>
                                                    <li>• Error boundary components</li>
                                                    <li>• Development warnings</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'frontend-architecture':
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Architecture & Technical Stack</h1>
                            <p className="text-lg text-gray-600">
                                Detailed overview of the frontend architecture, technology choices, and implementation details
                                for the OSM Road Closures reporting application.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack Overview</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Code className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Frontend Framework</h3>
                                    <p className="text-gray-600 text-sm">Next.js 15 with TypeScript and App Router</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <Palette className="w-8 h-8 text-green-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Styling</h3>
                                    <p className="text-gray-600 text-sm">Tailwind CSS v4 with responsive design</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <MapIcon className="w-8 h-8 text-red-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Mapping</h3>
                                    <p className="text-gray-600 text-sm">Leaflet.js with React-Leaflet integration</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Core Architecture */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Layout className="w-6 h-6 text-purple-600" />
                                    <span>Application Architecture</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Next.js App Router Structure</h3>
                                        <CodeBlock
                                            code={`frontend/
├── app/                      # Next.js 15 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── closures/           # Main application
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── docs/               # Documentation
│   ├── login/              # Authentication
│   └── register/           # User registration
├── components/             # React components
│   ├── Auth/               # Authentication components
│   ├── Layout/             # Layout components
│   ├── Map/                # Map-related components
│   ├── Forms/              # Form components
│   ├── Docs/               # Documentation components
│   └── Demo/               # Demo/debug components
├── context/                # React Context providers
├── services/               # API clients and utilities
├── data/                   # Static/mock data
└── public/                 # Static assets`}
                                            language="text"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Component Architecture</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Layout Components</h4>
                                                <ul className="space-y-1 text-blue-700 text-sm">
                                                    <li>• <code>Header</code>: Navigation and authentication</li>
                                                    <li>• <code>Sidebar</code>: Closures list and statistics</li>
                                                    <li>• <code>Layout</code>: Main layout wrapper</li>
                                                    <li>• <code>StatsDashboard</code>: Analytics modal</li>
                                                </ul>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-900 mb-2">Feature Components</h4>
                                                <ul className="space-y-1 text-green-700 text-sm">
                                                    <li>• <code>MapComponent</code>: Interactive Leaflet map</li>
                                                    <li>• <code>ClosureForm</code>: Multi-step reporting form</li>
                                                    <li>• <code>EditClosureForm</code>: Edit existing closures</li>
                                                    <li>• <code>DemoControlPanel</code>: Debug interface</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">State Management Pattern</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <CodeBlock
                                                code={`// React Context + useReducer pattern
interface ClosuresState {
  closures: Closure[];
  selectedClosure: Closure | null;
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  editingClosure: Closure | null;
}

// Actions for state management
type ClosuresAction = 
  | { type: 'SET_CLOSURES'; payload: Closure[] }
  | { type: 'ADD_CLOSURE'; payload: Closure }
  | { type: 'UPDATE_CLOSURE'; payload: Closure }
  | { type: 'DELETE_CLOSURE'; payload: number }
  | { type: 'SELECT_CLOSURE'; payload: Closure }
  | { type: 'SET_LOADING'; payload: boolean };`}
                                                language="typescript"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technology Stack Details */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Layers className="w-6 h-6 text-indigo-600" />
                                    <span>Technology Stack Details</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Framework</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Next.js 15</h4>
                                                <ul className="space-y-1 text-blue-700 text-sm">
                                                    <li>• App Router for modern routing</li>
                                                    <li>• Server-side rendering (SSR)</li>
                                                    <li>• Automatic code splitting</li>
                                                    <li>• Built-in image optimization</li>
                                                    <li>• TypeScript support</li>
                                                </ul>
                                            </div>
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                <h4 className="font-medium text-purple-900 mb-2">TypeScript</h4>
                                                <ul className="space-y-1 text-purple-700 text-sm">
                                                    <li>• Strict type checking</li>
                                                    <li>• Interface definitions for all APIs</li>
                                                    <li>• Enhanced IDE support</li>
                                                    <li>• Runtime error prevention</li>
                                                    <li>• Better code documentation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Styling and UI</h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                                <h4 className="font-medium text-cyan-900 mb-2">Tailwind CSS v4</h4>
                                                <ul className="space-y-1 text-cyan-700 text-sm">
                                                    <li>• Utility-first styling</li>
                                                    <li>• Responsive design system</li>
                                                    <li>• Dark mode support ready</li>
                                                    <li>• Custom component classes</li>
                                                </ul>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-900 mb-2">Lucide React</h4>
                                                <ul className="space-y-1 text-green-700 text-sm">
                                                    <li>• Consistent icon system</li>
                                                    <li>• SVG-based icons</li>
                                                    <li>• Tree-shakeable imports</li>
                                                    <li>• Customizable styling</li>
                                                </ul>
                                            </div>
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                                <h4 className="font-medium text-orange-900 mb-2">React Hot Toast</h4>
                                                <ul className="space-y-1 text-orange-700 text-sm">
                                                    <li>• User notifications</li>
                                                    <li>• Success/error messages</li>
                                                    <li>• Customizable styling</li>
                                                    <li>• Auto-dismiss timers</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mapping and Geospatial</h3>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-medium text-red-900 mb-3">Leaflet.js + React-Leaflet</h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="font-medium text-red-800 text-sm mb-1">Core Features:</h5>
                                                    <ul className="space-y-1 text-red-700 text-sm">
                                                        <li>• Interactive map interface</li>
                                                        <li>• OpenStreetMap tile layers</li>
                                                        <li>• Custom markers and polylines</li>
                                                        <li>• Popup and tooltip system</li>
                                                        <li>• Event handling for user interactions</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-red-800 text-sm mb-1">Integration:</h5>
                                                    <ul className="space-y-1 text-red-700 text-sm">
                                                        <li>• React component wrappers</li>
                                                        <li>• TypeScript type definitions</li>
                                                        <li>• Server-side rendering compatibility</li>
                                                        <li>• Dynamic import for client-only loading</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Form Management</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                                <h4 className="font-medium text-emerald-900 mb-2">React Hook Form</h4>
                                                <ul className="space-y-1 text-emerald-700 text-sm">
                                                    <li>• Performant form handling</li>
                                                    <li>• Built-in validation</li>
                                                    <li>• TypeScript integration</li>
                                                    <li>• Minimal re-renders</li>
                                                    <li>• Custom validation rules</li>
                                                </ul>
                                            </div>
                                            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                                                <h4 className="font-medium text-violet-900 mb-2">Multi-step Forms</h4>
                                                <ul className="space-y-1 text-violet-700 text-sm">
                                                    <li>• Progressive validation</li>
                                                    <li>• Step navigation</li>
                                                    <li>• Form state persistence</li>
                                                    <li>• Error boundary handling</li>
                                                    <li>• Mobile-optimized UX</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Management</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">API Integration</h4>
                                                <ul className="space-y-1 text-blue-700 text-sm">
                                                    <li>• Axios for HTTP requests</li>
                                                    <li>• Request/response interceptors</li>
                                                    <li>• Error handling and retries</li>
                                                    <li>• Token management</li>
                                                    <li>• API abstraction layer</li>
                                                </ul>
                                            </div>
                                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                                                <h4 className="font-medium text-teal-900 mb-2">Date Handling</h4>
                                                <ul className="space-y-1 text-teal-700 text-sm">
                                                    <li>• date-fns for date operations</li>
                                                    <li>• Timezone-aware processing</li>
                                                    <li>• Relative time formatting</li>
                                                    <li>• Duration calculations</li>
                                                    <li>• Locale support</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Reporting Workflow */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <RefreshCw className="w-6 h-6 text-green-600" />
                                    <span>Live Reporting Workflow</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Real-time Data Flow</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <CodeBlock
                                                code={`// Closure reporting workflow
1. User Authentication
   ├── JWT token validation
   ├── User permissions check
   └── Backend connectivity status

2. Location Selection
   ├── Interactive map point selection
   ├── Geometry type determination (Point/LineString)
   ├── Valhalla route calculation (for LineString)
   └── Coordinate validation

3. Form Submission
   ├── Multi-step form validation
   ├── Data transformation and formatting
   ├── OpenLR encoding request (backend)
   └── Database persistence

4. Real-time Updates
   ├── Closure status calculation
   ├── Map visualization update
   ├── Sidebar statistics refresh
   └── User notification`}
                                                language="text"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">API Integration Architecture</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-medium text-green-900 mb-2">Backend Communication</h4>
                                                <ul className="space-y-1 text-green-700 text-sm">
                                                    <li>• RESTful API endpoints</li>
                                                    <li>• JWT token authentication</li>
                                                    <li>• Request/response validation</li>
                                                    <li>• Error handling and retry logic</li>
                                                    <li>• Automatic token refresh</li>
                                                </ul>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Valhalla Integration</h4>
                                                <ul className="space-y-1 text-blue-700 text-sm">
                                                    <li>• Route calculation for road segments</li>
                                                    <li>• Automatic path optimization</li>
                                                    <li>• Multiple waypoint support</li>
                                                    <li>• Distance and duration estimation</li>
                                                    <li>• Fallback to direct line on failure</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">State Management Flow</h3>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <CodeBlock
                                                code={`// React Context state management
const ClosuresContext = createContext();

// Reducer for complex state updates
function closuresReducer(state, action) {
  switch (action.type) {
    case 'SET_CLOSURES':
      return { ...state, closures: action.payload };
    case 'ADD_CLOSURE':
      return { 
        ...state, 
        closures: [...state.closures, action.payload] 
      };
    case 'UPDATE_CLOSURE':
      return {
        ...state,
        closures: state.closures.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    // ... more actions
  }
}

// API integration with state updates
const createClosure = async (data) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const closure = await closuresApi.create(data);
    dispatch({ type: 'ADD_CLOSURE', payload: closure });
    toast.success('Closure created successfully');
  } catch (error) {
    toast.error('Failed to create closure');
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};`}
                                                language="typescript"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Optimizations</h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <h4 className="font-medium text-yellow-900 mb-2">Map Performance</h4>
                                                <ul className="space-y-1 text-yellow-700 text-sm">
                                                    <li>• Dynamic layer management</li>
                                                    <li>• Bounds-based data fetching</li>
                                                    <li>• Efficient marker clustering</li>
                                                    <li>• Debounced map events</li>
                                                </ul>
                                            </div>
                                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                                <h4 className="font-medium text-pink-900 mb-2">Component Loading</h4>
                                                <ul className="space-y-1 text-pink-700 text-sm">
                                                    <li>• Dynamic imports for heavy components</li>
                                                    <li>• Lazy loading of map component</li>
                                                    <li>• Code splitting by route</li>
                                                    <li>• Progressive enhancement</li>
                                                </ul>
                                            </div>
                                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                                <h4 className="font-medium text-indigo-900 mb-2">Data Caching</h4>
                                                <ul className="space-y-1 text-indigo-700 text-sm">
                                                    <li>• In-memory closure caching</li>
                                                    <li>• API response optimization</li>
                                                    <li>• Efficient re-rendering patterns</li>
                                                    <li>• Selective component updates</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security and Data Handling */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Shield className="w-6 h-6 text-red-600" />
                                    <span>Security and Data Handling</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Measures</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>JWT token secure storage and validation</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>CORS policy compliance</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Input validation and sanitization</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>XSS prevention measures</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Environment variable protection</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Privacy</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>No persistent storage in demo mode</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Minimal data collection</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Location data anonymization</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>User consent for data processing</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>GDPR compliance ready</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Future Enhancements */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Zap className="w-6 h-6 text-yellow-600" />
                                    <span>Future Enhancements</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Planned Features</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <Clock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                                <span>Real-time collaboration and live updates</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Smartphone className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                <span>Progressive Web App (PWA) capabilities</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Globe className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                                                <span>Offline mode with sync capabilities</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Database className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                                                <span>Advanced filtering and search features</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Integration Roadmap</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <Navigation className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                                                <span>OsmAnd mobile app integration</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Users className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                                                <span>Community moderation tools</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <MapIcon className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                                                <span>Additional map provider support</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Settings className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                                                <span>Enhanced analytics and reporting</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center space-x-2">
                                        <Heart className="w-4 h-4" />
                                        <span>Community Contribution</span>
                                    </h4>
                                    <p className="text-yellow-700 text-sm">
                                        This frontend application is designed to be community-driven and open for contributions.
                                        The modular architecture and comprehensive documentation make it easy for developers to
                                        extend functionality and add new features that benefit the broader OSM ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

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
