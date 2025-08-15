import React from 'react';
import { Monitor, Smartphone, Users, MapPin as MapIcon, Edit, Eye, Route, Globe, Heart } from 'lucide-react';
import { SectionHeader, FeatureCard, InfoBox } from '../../Common';

const FrontendIntroduction: React.FC = () => {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Frontend Closure Reporting"
                description="User-friendly web application for reporting and viewing temporary road closures. Built with Next.js and designed for the OpenStreetMap community."
            >
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Monitor}
                        title="Web Application"
                        description="Interactive map-based interface for community reporting"
                        iconColor="text-green-600"
                    />
                    <FeatureCard
                        icon={Smartphone}
                        title="Mobile Responsive"
                        description="Works seamlessly on desktop, tablet, and mobile devices"
                        iconColor="text-blue-600"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Community Driven"
                        description="Designed for OSM contributors and navigation app users"
                        iconColor="text-purple-600"
                    />
                </div>
            </SectionHeader>

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

                <InfoBox type="info" title="Google Summer of Code 2025 Project" icon={Globe}>
                    <p>
                        This frontend application is part of a comprehensive GSoC 2025 project that includes
                        a FastAPI backend, OpenLR integration, and planned OsmAnd navigation app integration.
                        It demonstrates how modern web technologies can make OSM data more accessible to the community.
                    </p>
                </InfoBox>
            </div>
        </div>
    );
};

export default FrontendIntroduction;