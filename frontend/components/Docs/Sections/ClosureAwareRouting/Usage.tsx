import React from 'react';
import { Play, Info, AlertCircle, CheckCircle, Target, Route, Edit, Settings, Wifi, RefreshCw, MousePointer, MapPin, Navigation, Car, Bike, User, Clock } from 'lucide-react';
import { InfoBox, StepCard } from '../../Common';
import CodeBlock from '../../CodeBlock';

const ClosureRoutingUsage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Usage Guide</h1>
                <p className="text-lg text-gray-600">
                    Step-by-step guide to using closure-aware routing for planning routes that avoid temporary road closures.
                </p>
            </div>

            <InfoBox type="success" title="Interactive Demo Available" icon={Play}>
                <p>
                    Follow along with this guide using the live demo at <code>/closure-aware-routing</code>.
                    The demo includes sample closures in the Chicago area for testing purposes.
                </p>
            </InfoBox>

            <div className="space-y-8">
                <StepCard stepNumber={1} title="Accessing the Routing Feature">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Opening the Application</h3>
                            <ol className="space-y-2 text-gray-600">
                                <li>1. Navigate to the closure-aware routing page: <code className="bg-gray-100 px-2 py-1 rounded">/closure-aware-routing</code></li>
                                <li>2. Wait for the map and interface to load completely</li>
                                <li>3. You'll see an interactive map with existing closures displayed</li>
                                <li>4. The sidebar on the left shows routing controls and options</li>
                            </ol>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                [Add screenshot: Initial view of the closure-aware routing interface showing the map with sample closures,
                                the routing form sidebar, and transportation mode selector]
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding the Interface</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Map Elements:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• 🔴 Red lines/markers: Active closures</li>
                                        <li>• ⚫ Gray lines/markers: Expired closures</li>
                                        <li>• 🔵 Blue route: Direct path (no closure avoidance)</li>
                                        <li>• 🟢 Green route: Closure-aware optimal path</li>
                                        <li>• 📍 Markers: Start and end points</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Sidebar Controls:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• Transportation mode selector</li>
                                        <li>• Source and destination input fields</li>
                                        <li>• Route calculation button</li>
                                        <li>• Route comparison statistics</li>
                                        <li>• Affected closures list</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </StepCard>

                <StepCard stepNumber={2} title="Selecting Transportation Mode">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Your Travel Method</h3>
                            <p className="text-gray-600 mb-3">
                                First, select how you'll be traveling. This is important because different closure types
                                affect different modes of transportation differently.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Car className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-blue-800">Auto (Car)</span>
                                </div>
                                <p className="text-blue-700 text-sm mb-2">Best for:</p>
                                <ul className="space-y-1 text-blue-600 text-xs">
                                    <li>• Cars, trucks, motorcycles</li>
                                    <li>• Delivery vehicles</li>
                                    <li>• Emergency vehicles</li>
                                    <li>• Any motorized transport</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Bike className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-800">Bicycle</span>
                                </div>
                                <p className="text-green-700 text-sm mb-2">Best for:</p>
                                <ul className="space-y-1 text-green-600 text-xs">
                                    <li>• Bicycles and e-bikes</li>
                                    <li>• Scooters and similar</li>
                                    <li>• Cycling commuters</li>
                                    <li>• Bike delivery services</li>
                                </ul>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <User className="w-5 h-5 text-purple-600" />
                                    <span className="font-medium text-purple-800">Pedestrian</span>
                                </div>
                                <p className="text-purple-700 text-sm mb-2">Best for:</p>
                                <ul className="space-y-1 text-purple-600 text-xs">
                                    <li>• Walking</li>
                                    <li>• Wheelchairs</li>
                                    <li>• Mobility devices</li>
                                    <li>• Foot traffic</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">GIF Placeholder</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                [Add animated GIF: Clicking through the different transportation mode options and showing
                                how the interface updates, including the icon changes in the header]
                            </p>
                        </div>

                        <InfoBox type="warning" title="Why Mode Selection Matters">
                            <p className="mb-2">Different closure types affect transportation modes differently:</p>
                            <ul className="space-y-1 text-sm">
                                <li>• <strong>Construction:</strong> Blocks cars and bikes, but pedestrians might pass through</li>
                                <li>• <strong>Bike lane closure:</strong> Only affects cyclists</li>
                                <li>• <strong>Sidewalk repair:</strong> Only affects pedestrians</li>
                                <li>• <strong>Bridge closure:</strong> Affects all modes of transport</li>
                            </ul>
                        </InfoBox>
                    </div>
                </StepCard>

                <StepCard stepNumber={3} title="Setting Source and Destination">
                    <InfoBox type="warning" title="Demo vs Authenticated Mode" icon={AlertCircle}>
                        <p>
                            The routing demo works without authentication and includes sample Chicago area data for testing purposes.
                        </p>
                    </InfoBox>

                    <div className="space-y-4 mt-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Input Your Route Points</h3>
                            <p className="text-gray-600 mb-3">
                                You can set your starting point and destination using multiple methods:
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Method 1: Click on Map</h4>
                                <ol className="space-y-1 text-sm text-gray-600">
                                    <li>1. Click "Click to select on map" for source or destination</li>
                                    <li>2. Click anywhere on the map to set that point</li>
                                    <li>3. The coordinates will automatically populate the input field</li>
                                    <li>4. Repeat for the other point</li>
                                </ol>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Method 2: Manual Coordinates</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    Enter coordinates directly in latitude, longitude format:
                                </p>
                                <CodeBlock
                                    code={`Source: 41.8781, -87.6298 (Downtown Chicago)
Destination: 41.8919, -87.6051 (Near Lincoln Park)`}
                                    language="text"
                                />
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Method 3: Use Sample Locations</h4>
                                <p className="text-gray-600 text-sm">
                                    The demo includes preset Chicago locations you can quickly select for testing.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">GIF Placeholder</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                [Add animated GIF: Demonstrating all three methods of setting source and destination -
                                clicking on map, entering coordinates manually, and using sample locations]
                            </p>
                        </div>

                        <InfoBox type="info" title="Demo Area Coverage">
                            <p>
                                The demo focuses on Chicago with sample closures throughout the downtown and surrounding areas.
                                For best results, choose points within the Chicago metropolitan area.
                            </p>
                        </InfoBox>
                    </div>
                </StepCard>

                <StepCard stepNumber={4} title="Calculating Routes">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Run the Route Calculation</h3>
                            <ol className="space-y-2 text-gray-600">
                                <li>1. Ensure both source and destination are set</li>
                                <li>2. Verify your transportation mode is selected</li>
                                <li>3. Click "Calculate Route" button</li>
                                <li>4. Watch as the system processes your request</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">What Happens Behind the Scenes</h3>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">The Calculation Process:</h4>
                                <ol className="space-y-2 text-blue-700 text-sm">
                                    <li>1. <strong>Boundary Detection:</strong> Creates a search area around your route with 1-mile buffer</li>
                                    <li>2. <strong>Closure Fetching:</strong> Retrieves all active closures in that area</li>
                                    <li>3. <strong>Mode Filtering:</strong> Identifies which closures affect your transportation mode</li>
                                    <li>4. <strong>Direct Route:</strong> Calculates the normal fastest route (baseline)</li>
                                    <li>5. <strong>Closure-Aware Route:</strong> Calculates optimal route avoiding relevant closures</li>
                                    <li>6. <strong>Comparison:</strong> Shows both routes for comparison</li>
                                </ol>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                [Add screenshot: Route calculation in progress, showing the loading state and then the
                                completed calculation with both routes displayed]
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding the Results</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2">🔵 Direct Route (Blue)</h4>
                                    <ul className="space-y-1 text-blue-700 text-sm">
                                        <li>• Fastest route ignoring closures</li>
                                        <li>• Shows what traditional routing would suggest</li>
                                        <li>• Baseline for comparison</li>
                                        <li>• May go through blocked areas</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-800 mb-2">🟢 Closure-Aware Route (Green)</h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                        <li>• Optimal route avoiding closures</li>
                                        <li>• Actually passable in real conditions</li>
                                        <li>• Recommended route to follow</li>
                                        <li>• May be longer but saves time</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Route Statistics</h3>
                            <p className="text-gray-600 text-sm mb-2">
                                The interface displays useful metrics for both routes:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Distance:</span>
                                        <p className="text-gray-600">Total route length in kilometers</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Duration:</span>
                                        <p className="text-gray-600">Estimated travel time in minutes</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Closures Avoided:</span>
                                        <p className="text-gray-600">Number of closures bypassed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </StepCard>

                <StepCard stepNumber={5} title="Analyzing Results and Closures">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviewing Affected Closures</h3>
                            <p className="text-gray-600 mb-3">
                                After route calculation, the bottom section of the sidebar shows detailed information
                                about closures that were considered in your route:
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Closure List Features:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• Total closures found in your route area</li>
                                        <li>• Number that specifically affect your transportation mode</li>
                                        <li>• Individual closure details with descriptions</li>
                                        <li>• Visual indicators for closure types and status</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Understanding Closure Information:</h4>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <ul className="space-y-1 text-yellow-800 text-sm">
                                            <li>• <strong>Description:</strong> What's causing the closure</li>
                                            <li>• <strong>Type:</strong> Construction, accident, event, etc.</li>
                                            <li>• <strong>Affects Mode:</strong> Whether it impacts your travel method</li>
                                            <li>• <strong>Status:</strong> Active, upcoming, or expired</li>
                                            <li>• <strong>Duration:</strong> How long it's expected to last</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Screenshot Placeholder</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                [Add screenshot: Bottom section of sidebar showing the closures list with detailed information,
                                highlighting which closures affect the selected transportation mode]
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Making Route Decisions</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">When to Use Direct Route:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• No relevant closures affecting your mode</li>
                                        <li>• Closures are minor or allow passage</li>
                                        <li>• Time savings are minimal with avoidance</li>
                                        <li>• You have local knowledge of conditions</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">When to Use Closure-Aware Route:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• Multiple active closures in your path</li>
                                        <li>• Major construction or accident sites</li>
                                        <li>• Unfamiliar with the area</li>
                                        <li>• Time-sensitive travel</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <InfoBox type="success" title="Pro Tip: Compare Before You Go">
                            <p>
                                Always review both routes and the closure list before making your decision. Sometimes the
                                "direct" route might still be passable, while other times the closure-aware route provides
                                significant time savings and stress reduction.
                            </p>
                        </InfoBox>
                    </div>
                </StepCard>

                <StepCard stepNumber={6} title="Using Routes for Navigation">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Following Your Chosen Route</h3>
                            <p className="text-gray-600 mb-3">
                                Once you've calculated and reviewed your routes, here's how to use the information:
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">For Real Navigation:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• Note the key waypoints and turns from the green route</li>
                                        <li>• Screenshot or write down the route path</li>
                                        <li>• Use the coordinate information for GPS navigation</li>
                                        <li>• Share route details with others if needed</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Integration with Navigation Apps:</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-blue-700 text-sm mb-2">
                                            <strong>Future Enhancement:</strong> Direct integration with navigation apps is planned.
                                            For now, you can use the closure information to manually adjust routes in your preferred navigation app.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Testing and Experimentation</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-800 mb-2">🧪 Try Different Scenarios:</h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                        <li>• Change transportation modes for same route</li>
                                        <li>• Test routes during different times</li>
                                        <li>• Compare routes with many vs. few closures</li>
                                        <li>• Experiment with different start/end points</li>
                                    </ul>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h4 className="font-medium text-purple-800 mb-2">📊 Understanding Patterns:</h4>
                                    <ul className="space-y-1 text-purple-700 text-sm">
                                        <li>• See how construction affects different routes</li>
                                        <li>• Learn which areas have frequent closures</li>
                                        <li>• Compare time impacts of avoiding closures</li>
                                        <li>• Understand mode-specific restrictions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                            <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">You're Ready to Route!</h3>
                                <p className="text-gray-600 mb-4">
                                    You now know how to use closure-aware routing to plan better journeys.
                                    The more you use it, the more you'll appreciate having real-time closure information.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <a
                                        href="/closure-aware-routing"
                                        className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        <span>Try Demo Now</span>
                                    </a>
                                    <a
                                        href="/closures"
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <span>Report Closures</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </StepCard>
            </div>
        </div>
    );
};

export default ClosureRoutingUsage; 