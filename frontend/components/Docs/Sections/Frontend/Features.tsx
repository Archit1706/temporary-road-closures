import React from 'react';
import { MapPin as MapIcon, Edit, Smartphone, Target, Route, Zap, Lock, RefreshCw, Eye, Settings } from 'lucide-react';
import { FeatureCard, InfoBox } from '../../Common';

const Features: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Features Overview</h1>
                <p className="text-lg text-gray-600">
                    Comprehensive overview of all features available in the OSM Road Closures frontend application.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                    icon={MapIcon}
                    title="Interactive Mapping"
                    description="OpenStreetMap-based interface with real-time closure visualization"
                    iconColor="text-blue-600"
                />
                <FeatureCard
                    icon={Edit}
                    title="Community Reporting"
                    description="Easy-to-use forms for submitting closure information"
                    iconColor="text-green-600"
                />
                <FeatureCard
                    icon={Smartphone}
                    title="Mobile Responsive"
                    description="Optimized for all device types and screen sizes"
                    iconColor="text-purple-600"
                />
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

                    <InfoBox type="success" title="Automatic Route Calculation" icon={Zap}>
                        <p>
                            For road segment closures, the system automatically calculates the optimal route between
                            selected points using Valhalla routing engine, ensuring accurate representation of actual road paths.
                        </p>
                    </InfoBox>
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
                                <li>• JWT token-based authentication</li>
                                <li>• User registration and login</li>
                                <li>• Demo credentials for testing</li>
                                <li>• Automatic session management</li>
                                <li>• Secure logout and token cleanup</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">User Permissions</h3>
                            <div className="space-y-3">
                                <InfoBox type="success" title="Authenticated Users">
                                    <ul className="space-y-1 text-xs">
                                        <li>• Create permanent closures</li>
                                        <li>• Edit own submissions</li>
                                        <li>• Delete own closures</li>
                                        <li>• Access full backend features</li>
                                    </ul>
                                </InfoBox>
                                <InfoBox type="warning" title="Demo Users">
                                    <ul className="space-y-1 text-xs">
                                        <li>• View all existing closures</li>
                                        <li>• Create temporary demo closures</li>
                                        <li>• Test all interface features</li>
                                        <li>• No persistent data storage</li>
                                    </ul>
                                </InfoBox>
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

                    <InfoBox type="info" title="Status Tracking">
                        <p>
                            The application automatically categorizes closures as Active, Upcoming, or Expired based on
                            current time vs. closure start/end times, providing real-time status without manual updates.
                        </p>
                    </InfoBox>
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
};

export default Features;