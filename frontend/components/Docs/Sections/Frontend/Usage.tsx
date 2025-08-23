import React from 'react';
import { Play, Info, AlertCircle, CheckCircle, Target, Route, Edit, Settings, Wifi, RefreshCw, MousePointer } from 'lucide-react';
import { InfoBox, StepCard } from '../../Common';
import Image from 'next/image';

const Usage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Usage Guide</h1>
                <p className="text-lg text-gray-600">
                    Step-by-step guide to using the OSM Road Closures frontend application.
                </p>
            </div>

            <InfoBox type="success" title="Getting Started" icon={Play}>
                <p>
                    You can start using the application immediately in demo mode, or log in for full functionality.
                    This guide covers both scenarios with detailed step-by-step instructions.
                </p>
            </InfoBox>

            <div className="space-y-8">
                <StepCard stepNumber={1} title="Accessing the Application">
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
                            <Image src="/assets/closures/main_start.png" alt="Opening the Web App" width={1000} height={1000} />
                            <p className="text-blue-700 text-sm text-center">
                                Main application interface showing the map, header, and sidebar (demo mode)
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
                </StepCard>

                <StepCard stepNumber={2} title="Authentication (Optional)">
                    <InfoBox type="warning" title="Demo vs Authenticated Mode" icon={AlertCircle}>
                        <p>
                            You can use the app without logging in (demo mode), but authentication enables permanent data storage and advanced features.
                        </p>
                    </InfoBox>

                    <div className="space-y-4 mt-4">
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
                            <Image src="/assets/closures/login.png" alt="Login Modal" width={1000} height={1000} />
                            <p className="text-blue-700 text-sm text-center">
                                Login form with form fields and demo credentials section
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
                </StepCard>

                <StepCard stepNumber={3} title="Viewing Existing Closures">
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
                            <Image src="/assets/closures/closures.png" alt="Map View" width={1000} height={1000} />
                            <p className="text-blue-700 text-sm text-center">
                                Map showing various closures with different colors and direction arrows
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

                        <InfoBox type="info" title="Understanding Closure Information">
                            <h4 className="font-medium mb-2">Each closure shows:</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• Description of the closure (e.g., "Water main repair")</li>
                                <li>• Type and reason (construction, accident, event, etc.)</li>
                                <li>• Duration and timing information</li>
                                <li>• Confidence level (1-10 scale)</li>
                                <li>• Direction info (Point, Bidirectional, or Unidirectional)</li>
                                <li>• Source organization or reporter</li>
                            </ul>
                        </InfoBox>
                    </div>
                </StepCard>

                <StepCard stepNumber={4} title="Reporting a New Closure">
                    <InfoBox type="success" title="Authentication Required" icon={CheckCircle}>
                        <p>
                            You must be logged in to report new closures. In demo mode, you can practice but changes won't be saved permanently.
                        </p>
                    </InfoBox>

                    <div className="space-y-6 mt-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Starting the Report Process</h3>
                            <ol className="space-y-2 text-gray-600">
                                <li>1. Click the "Report Closure" button in the header</li>
                                <li>2. A step-by-step form will open on the right side</li>
                                <li>3. The form has 3 steps: Details, Location & Timing, and Review</li>
                            </ol>

                            <div className="bg-gray-50 rounded-lg p-4 mt-3">
                                <Image src="/assets/closures/closure_form.png" alt="Report Closure" width={1000} height={1000} />
                                <p className="text-blue-700 text-sm text-center">
                                    Report Closure button highlighted and form opening on the right
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

                                <InfoBox type="warning" title="Choosing Geometry Type">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <h5 className="font-medium text-sm flex items-center space-x-1">
                                                <Target className="w-4 h-4" />
                                                <span>Point Closure</span>
                                            </h5>
                                            <p className="text-xs">For intersections, specific addresses, or localized blockages</p>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-sm flex items-center space-x-1">
                                                <Route className="w-4 h-4" />
                                                <span>Road Segment</span>
                                            </h5>
                                            <p className="text-xs">For construction zones, parade routes, or multi-block closures</p>
                                        </div>
                                    </div>
                                </InfoBox>
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
                                    <Image src="/assets/closures/point_selection.png" alt="Point Selection" width={1000} height={1000} />
                                    <p className="text-blue-700 text-sm text-center">
                                        Showing point selection process for both Point and LineString geometries
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
                </StepCard>

                <StepCard stepNumber={5} title="Managing Your Closures">
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
                            <Image src="/assets/closures/edit_closure.png" alt="Sidebar" width={1000} height={1000} />
                            <p className="text-blue-700 text-sm text-center">
                                Sidebar showing closures with edit/delete buttons visible on hover
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
                </StepCard>

                <StepCard stepNumber={6} title="Tips and Best Practices">
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

                    <InfoBox type="warning" title="🎯 Remember">
                        <p>
                            This application feeds into the broader OpenStreetMap ecosystem. Accurate and timely
                            closure reports help navigation apps provide better routing for everyone in the community.
                        </p>
                    </InfoBox>
                </StepCard>
            </div>
        </div>
    );
};

export default Usage;