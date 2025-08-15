import React from 'react';
import { Server, MapPin, Route, Database, Zap, Globe, Layers, RefreshCw, Settings, Code, ArrowRight } from 'lucide-react';
import { InfoBox, TechStackItem } from '../../Common';
import CodeBlock from '../../CodeBlock';

const TechnicalArchitecture: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Technical Architecture</h1>
                <p className="text-lg text-gray-600">
                    Under-the-hood look at how closure-aware routing works, including the technologies,
                    algorithms, and data flow that power intelligent route calculation.
                </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Architecture Overview</h2>
                <p className="text-gray-700 mb-6">
                    The closure-aware routing system integrates multiple components to deliver real-time,
                    intelligent routing decisions. It combines spatial databases, routing engines, and
                    smart filtering logic to provide optimal routes for different transportation modes.
                </p>

                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-blue-900 text-sm">Closure Database</h3>
                        <p className="text-blue-700 text-xs">PostGIS spatial data</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-900 text-sm">Valhalla Routing</h3>
                        <p className="text-green-700 text-xs">Open-source routing</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Layers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-purple-900 text-sm">Smart Filtering</h3>
                        <p className="text-purple-700 text-xs">Mode-aware logic</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Route className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-orange-900 text-sm">Route Optimization</h3>
                        <p className="text-orange-700 text-xs">Multi-criteria analysis</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Data Flow */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <RefreshCw className="w-6 h-6 text-indigo-600" />
                        <span>Data Flow and Processing Pipeline</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Step-by-Step Process</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-4">
                                    {[
                                        {
                                            step: 1,
                                            title: "User Input Processing",
                                            description: "Source, destination coordinates and transportation mode validation",
                                            tech: "Frontend form validation, coordinate normalization"
                                        },
                                        {
                                            step: 2,
                                            title: "Spatial Boundary Calculation",
                                            description: "Calculate bounding box with 1-mile buffer around potential route",
                                            tech: "Geometric buffer calculation, coordinate math"
                                        },
                                        {
                                            step: 3,
                                            title: "Closure Data Retrieval",
                                            description: "Fetch all closures within the calculated boundary from database",
                                            tech: "PostGIS spatial queries, REST API calls"
                                        },
                                        {
                                            step: 4,
                                            title: "Transportation Mode Filtering",
                                            description: "Filter closures based on which ones affect the selected travel mode",
                                            tech: "JavaScript filtering logic, closure type mapping"
                                        },
                                        {
                                            step: 5,
                                            title: "Exclusion Point Generation",
                                            description: "Convert relevant closures to coordinate points for route avoidance",
                                            tech: "GeoJSON processing, coordinate extraction"
                                        },
                                        {
                                            step: 6,
                                            title: "Parallel Route Calculation",
                                            description: "Calculate both direct route and closure-aware route simultaneously",
                                            tech: "Valhalla API calls, async processing"
                                        },
                                        {
                                            step: 7,
                                            title: "Result Processing & Comparison",
                                            description: "Process routes, calculate metrics, and prepare comparison data",
                                            tech: "Polyline decoding, distance/time calculation"
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                <p className="text-gray-600 text-sm">{item.description}</p>
                                                <p className="text-indigo-600 text-xs mt-1">{item.tech}</p>
                                            </div>
                                            {index < 6 && (
                                                <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Code Example: Transportation Mode Filtering</h3>
                            <CodeBlock
                                code={`// Define which closure types affect which transportation modes
const closureTypeEffects: Record<string, TransportationMode[]> = {
  'construction': ['auto', 'bicycle'],     // Road work blocks vehicles
  'accident': ['auto', 'bicycle'],         // Traffic accidents affect vehicles
  'event': ['auto'],                       // Street events often allow pedestrians/bikes
  'maintenance': ['auto', 'bicycle'],      // Road maintenance affects vehicles
  'weather': ['auto', 'bicycle', 'pedestrian'], // Weather affects everyone
  'emergency': ['auto', 'bicycle', 'pedestrian'], // Emergency closures affect all
  'sidewalk_repair': ['pedestrian'],       // Only affects walkers
  'bike_lane_closure': ['bicycle'],        // Only affects cyclists
  'bridge_closure': ['auto', 'bicycle', 'pedestrian'], // Affects all modes
};

// Filter closures by transportation mode
const filterClosuresByMode = (closures: Closure[], mode: TransportationMode) => {
  return closures.filter(closure => {
    // Only consider active closures
    if (closure.status !== 'active') return false;
    
    // Check if this closure affects the selected transportation mode
    const affectedModes = closureTypeEffects[closure.closure_type] || 
                         ['auto', 'bicycle', 'pedestrian']; // Default: affects all
    return affectedModes.includes(mode);
  });
};`}
                                language="typescript"
                            />
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <Settings className="w-6 h-6 text-green-600" />
                        <span>Technology Stack</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Frontend Technologies</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="Next.js 15 with TypeScript"
                                    description="Frontend framework and type safety"
                                    items={[
                                        "React-based user interface",
                                        "Client-side routing and state management",
                                        "TypeScript for type safety",
                                        "Real-time user interactions"
                                    ]}
                                    bgColor="bg-blue-50 border border-blue-200"
                                />
                                <TechStackItem
                                    title="React-Leaflet + OpenStreetMap"
                                    description="Interactive mapping interface"
                                    items={[
                                        "Interactive map rendering",
                                        "Custom markers and polylines",
                                        "Real-time route visualization",
                                        "User click/interaction handling"
                                    ]}
                                    bgColor="bg-green-50 border border-green-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend and Routing</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="FastAPI + PostGIS"
                                    description="Spatial data backend"
                                    items={[
                                        "RESTful API for closure data",
                                        "PostGIS spatial queries",
                                        "Real-time closure status",
                                        "Authentication and authorization"
                                    ]}
                                    bgColor="bg-purple-50 border border-purple-200"
                                />
                                <TechStackItem
                                    title="Valhalla Routing Engine"
                                    description="Open-source routing calculation"
                                    items={[
                                        "Multi-modal routing support",
                                        "Point exclusion capabilities",
                                        "Optimized path calculation",
                                        "Distance and time estimation"
                                    ]}
                                    bgColor="bg-orange-50 border border-orange-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Spatial Data Processing</h3>
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <h4 className="font-medium text-indigo-900 mb-3">GeoSpatial Operations</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-indigo-800">Coordinate Systems:</span>
                                        <ul className="text-indigo-700 mt-1 space-y-1">
                                            <li>• WGS84 (EPSG:4326)</li>
                                            <li>• Latitude/longitude pairs</li>
                                            <li>• GeoJSON standard format</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-indigo-800">Spatial Queries:</span>
                                        <ul className="text-indigo-700 mt-1 space-y-1">
                                            <li>• Bounding box intersections</li>
                                            <li>• Point-in-polygon tests</li>
                                            <li>• Distance calculations</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-indigo-800">Geometry Processing:</span>
                                        <ul className="text-indigo-700 mt-1 space-y-1">
                                            <li>• LineString to point extraction</li>
                                            <li>• Route polyline decoding</li>
                                            <li>• Buffer zone calculation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Valhalla Integration */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <Globe className="w-6 h-6 text-blue-600" />
                        <span>Valhalla Routing Engine Integration</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Valhalla?</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Advantages:</h4>
                                    <ul className="space-y-1 text-gray-600 text-sm">
                                        <li>• Open-source and free to use</li>
                                        <li>• Multi-modal routing (auto, bike, pedestrian)</li>
                                        <li>• Point exclusion capabilities</li>
                                        <li>• High-quality OpenStreetMap integration</li>
                                        <li>• Fast performance and accurate results</li>
                                        <li>• Active development community</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Technical Features:</h4>
                                    <ul className="space-y-1 text-gray-600 text-sm">
                                        <li>• RESTful JSON API</li>
                                        <li>• Precise polyline geometry</li>
                                        <li>• Detailed route instructions</li>
                                        <li>• Customizable routing preferences</li>
                                        <li>• Real-time traffic consideration</li>
                                        <li>• Multiple costing models</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">API Request Structure</h3>
                            <CodeBlock
                                code={`// Valhalla route request with point exclusions
const valhallaRequest = {
  locations: [
    { lat: sourcePoint.lat, lon: sourcePoint.lng, type: 'break' },
    { lat: destinationPoint.lat, lon: destinationPoint.lng, type: 'break' }
  ],
  costing: transportationMode, // 'auto', 'bicycle', or 'pedestrian'
  directions_options: {
    units: 'kilometers',
    format: 'json'
  },
  // Exclude closure points (up to 49 locations)
  exclude_locations: excludeLocations.map(([lat, lng]) => ({ lat, lon: lng }))
};

// Send request to Valhalla API
const response = await fetch('https://valhalla1.openstreetmap.de/route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(valhallaRequest)
});`}
                                language="javascript"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Response Processing</h3>
                            <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-medium text-green-800 mb-2">Key Response Elements:</h4>
                                <ul className="space-y-2 text-green-700 text-sm">
                                    <li>• <strong>Route Shape:</strong> Encoded polyline geometry (precision 6)</li>
                                    <li>• <strong>Summary:</strong> Total distance (km) and time (seconds)</li>
                                    <li>• <strong>Legs:</strong> Route segments with detailed information</li>
                                    <li>• <strong>Maneuvers:</strong> Turn-by-turn navigation instructions</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Polyline Decoding</h3>
                            <CodeBlock
                                code={`// Decode Valhalla polyline (precision 6) to coordinates
function decodePolyline(str: string, precision: number = 6): [number, number][] {
  let index = 0, lat = 0, lng = 0;
  const coordinates: [number, number][] = [];
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    // Decode latitude delta
    let shift = 0, result = 0;
    let byte: number;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));

    // Decode longitude delta  
    shift = 0; result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));

    coordinates.push([lat / factor, lng / factor]);
  }
  return coordinates;
}`}
                                language="typescript"
                            />
                        </div>
                    </div>
                </div>

                {/* Performance and Optimization */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        <span>Performance & Optimization</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Optimization Strategies</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Frontend Optimizations:</h4>
                                    <ul className="space-y-1 text-gray-600 text-sm">
                                        <li>• Debounced map interactions</li>
                                        <li>• Efficient React state management</li>
                                        <li>• Memoized expensive calculations</li>
                                        <li>• Lazy loading of map components</li>
                                        <li>• Optimized re-rendering patterns</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Backend Optimizations:</h4>
                                    <ul className="space-y-1 text-gray-600 text-sm">
                                        <li>• Spatial indexing in PostGIS</li>
                                        <li>• Efficient bounding box queries</li>
                                        <li>• Parallel route calculations</li>
                                        <li>• Response caching strategies</li>
                                        <li>• Optimized API payload sizes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Scalability Considerations</h3>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-medium text-yellow-800 mb-2">Current Limits:</h4>
                                        <ul className="space-y-1 text-yellow-700 text-sm">
                                            <li>• 49 exclusion points max (Valhalla limit)</li>
                                            <li>• 1-mile search radius</li>
                                            <li>• Single route calculation</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-yellow-800 mb-2">Future Enhancements:</h4>
                                        <ul className="space-y-1 text-yellow-700 text-sm">
                                            <li>• Multiple route alternatives</li>
                                            <li>• Intelligent exclusion prioritization</li>
                                            <li>• Real-time traffic integration</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-yellow-800 mb-2">Error Handling:</h4>
                                        <ul className="space-y-1 text-yellow-700 text-sm">
                                            <li>• Graceful API failure recovery</li>
                                            <li>• Fallback to direct routing</li>
                                            <li>• User-friendly error messages</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <InfoBox type="info" title="Open Source Foundation">
                    <p className="mb-3">
                        <strong>All components of the closure-aware routing system are built on open-source technologies:</strong>
                    </p>
                    <ul className="space-y-1 text-sm">
                        <li>• <strong>Valhalla:</strong> Open-source routing engine by Mapzen (now maintained by the community)</li>
                        <li>• <strong>OpenStreetMap:</strong> Collaborative, open-source map data</li>
                        <li>• <strong>PostGIS:</strong> Open-source spatial database extension</li>
                        <li>• <strong>React/Next.js:</strong> Open-source frontend frameworks</li>
                        <li>• <strong>Leaflet:</strong> Open-source interactive maps library</li>
                    </ul>
                    <p className="mt-3 text-sm">
                        This ensures the system remains accessible, auditable, and extensible by the broader
                        OpenStreetMap and open-source communities.
                    </p>
                </InfoBox>
            </div>
        </div>
    );
};

export default TechnicalArchitecture;