import React from 'react';
import { Server, MapPin, Shield } from 'lucide-react';
import { SectionHeader, FeatureCard, TechStackItem } from '../../Common';

const Introduction: React.FC = () => {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="OSM Road Closures API Documentation"
                description="A comprehensive REST API for managing temporary road closures in the OpenStreetMap ecosystem. Built for Google Summer of Code 2025."
            >
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Server}
                        title="REST API"
                        description="Complete CRUD operations with authentication and authorization"
                        iconColor="text-blue-600"
                    />
                    <FeatureCard
                        icon={MapPin}
                        title="OpenLR Integration"
                        description="Location referencing standard for cross-platform compatibility"
                        iconColor="text-green-600"
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Secure & Scalable"
                        description="OAuth2 authentication with JWT tokens and role-based access"
                        iconColor="text-purple-600"
                    />
                </div>
            </SectionHeader>

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
                    <TechStackItem
                        title="Backend"
                        description=""
                        items={[
                            "FastAPI (Python 3.11+)",
                            "PostgreSQL 15 + PostGIS 3.5",
                            "SQLAlchemy + GeoAlchemy2",
                            "Redis (caching & rate limiting)"
                        ]}
                    />
                    <TechStackItem
                        title="Integration"
                        description=""
                        items={[
                            "OpenLR location referencing",
                            "OAuth2 (Google, GitHub)",
                            "Docker containerization",
                            "OpenAPI 3.0 specification"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Introduction;