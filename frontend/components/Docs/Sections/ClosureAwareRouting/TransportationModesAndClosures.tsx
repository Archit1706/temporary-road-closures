import React from 'react';
import { Car, Bike, User, Construction, AlertTriangle, Calendar, Wrench, Cloud, Zap, TrainFrontTunnel as Tunnel, Footprints } from 'lucide-react';
import { InfoBox, TechStackItem } from '../../Common';

const TransportationModesAndClosures: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Transportation Modes & Closure Types</h1>
                <p className="text-lg text-gray-600">
                    Understanding how different types of road closures affect various transportation modes
                    and how the routing system makes intelligent decisions.
                </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Smart Filtering Logic</h2>
                <p className="text-gray-700 mb-4">
                    The closure-aware routing system doesn't just avoid all closures for all users. Instead,
                    it intelligently determines which closures actually affect your chosen mode of transportation
                    and only avoids those that would genuinely impact your journey.
                </p>
                <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-sm">
                        <strong>Example:</strong> A sidewalk repair closure affects pedestrians but not cars driving on the adjacent road.
                        Similarly, a bike lane closure affects cyclists but pedestrians can still use the sidewalk and cars can use the main road.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Transportation Modes Detail */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Transportation Modes</h2>

                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <Car className="w-8 h-8 text-blue-600" />
                                <h3 className="text-xl font-semibold text-blue-900">Auto (Motorized Vehicles)</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-blue-800 mb-2">Includes:</h4>
                                    <ul className="space-y-1 text-blue-700 text-sm">
                                        <li>• Cars and trucks</li>
                                        <li>• Motorcycles and scooters</li>
                                        <li>• Delivery vehicles</li>
                                        <li>• Emergency vehicles</li>
                                        <li>• Buses and public transit</li>
                                        <li>• RVs and larger vehicles</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-800 mb-2">Routing Characteristics:</h4>
                                    <ul className="space-y-1 text-blue-700 text-sm">
                                        <li>• Restricted to roadways and legal routes</li>
                                        <li>• Cannot bypass most physical barriers</li>
                                        <li>• Affected by weight/height restrictions</li>
                                        <li>• Must follow traffic regulations</li>
                                        <li>• Cannot use pedestrian-only areas</li>
                                        <li>• Most impacted by road closures</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-blue-100 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Closure Types That Affect Cars:</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-blue-700">Physical Blockages:</span>
                                        <ul className="text-blue-600 text-xs mt-1">
                                            <li>• Road construction</li>
                                            <li>• Traffic accidents</li>
                                            <li>• Bridge/tunnel closures</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Traffic Restrictions:</span>
                                        <ul className="text-blue-600 text-xs mt-1">
                                            <li>• Street events/parades</li>
                                            <li>• Emergency situations</li>
                                            <li>• Road maintenance</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Weather/Safety:</span>
                                        <ul className="text-blue-600 text-xs mt-1">
                                            <li>• Weather-related closures</li>
                                            <li>• Emergency evacuations</li>
                                            <li>• Safety hazards</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <Bike className="w-8 h-8 text-green-600" />
                                <h3 className="text-xl font-semibold text-green-900">Bicycle</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Includes:</h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                        <li>• Traditional bicycles</li>
                                        <li>• Electric bikes (e-bikes)</li>
                                        <li>• Electric scooters</li>
                                        <li>• Bike-share vehicles</li>
                                        <li>• Cargo bikes</li>
                                        <li>• Adaptive cycling equipment</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Routing Characteristics:</h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                        <li>• Can use bike lanes and paths</li>
                                        <li>• May share roads with cars</li>
                                        <li>• Can sometimes bypass car restrictions</li>
                                        <li>• Access to some pedestrian areas</li>
                                        <li>• More flexible routing options</li>
                                        <li>• Moderately affected by closures</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-green-100 rounded-lg p-4">
                                <h4 className="font-medium text-green-800 mb-2">Bicycle-Specific Considerations:</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <span className="font-medium text-green-700">Affected By:</span>
                                        <ul className="text-green-600 text-sm mt-1 space-y-1">
                                            <li>• Bike lane closures</li>
                                            <li>• Major road construction</li>
                                            <li>• Bridge and tunnel closures</li>
                                            <li>• Weather hazards</li>
                                            <li>• Emergency situations</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-green-700">Often Not Affected By:</span>
                                        <ul className="text-green-600 text-sm mt-1 space-y-1">
                                            <li>• Car-only traffic restrictions</li>
                                            <li>• Parking-related closures</li>
                                            <li>• Small vehicle accidents</li>
                                            <li>• Some street events</li>
                                            <li>• Sidewalk repairs</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <User className="w-8 h-8 text-purple-600" />
                                <h3 className="text-xl font-semibold text-purple-900">Pedestrian</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-purple-800 mb-2">Includes:</h4>
                                    <ul className="space-y-1 text-purple-700 text-sm">
                                        <li>• Walking pedestrians</li>
                                        <li>• Wheelchair users</li>
                                        <li>• Mobility device users</li>
                                        <li>• Parents with strollers</li>
                                        <li>• Runners and joggers</li>
                                        <li>• Anyone traveling on foot</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-purple-800 mb-2">Routing Characteristics:</h4>
                                    <ul className="space-y-1 text-purple-700 text-sm">
                                        <li>• Use sidewalks and crosswalks</li>
                                        <li>• Access to pedestrian-only areas</li>
                                        <li>• Can often find alternative paths</li>
                                        <li>• Least restricted by traffic rules</li>
                                        <li>• Most flexible routing options</li>
                                        <li>• Least affected by road closures</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-purple-100 rounded-lg p-4">
                                <h4 className="font-medium text-purple-800 mb-2">Pedestrian-Specific Impacts:</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <span className="font-medium text-purple-700">Usually Affected By:</span>
                                        <ul className="text-purple-600 text-sm mt-1 space-y-1">
                                            <li>• Sidewalk repairs and construction</li>
                                            <li>• Bridge and tunnel closures</li>
                                            <li>• Emergency cordons and safety zones</li>
                                            <li>• Weather-related hazards</li>
                                            <li>• Building construction blocking sidewalks</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-medium text-purple-700">Rarely Affected By:</span>
                                        <ul className="text-purple-600 text-sm mt-1 space-y-1">
                                            <li>• Road resurfacing (cars only)</li>
                                            <li>• Traffic accidents in roadway</li>
                                            <li>• Vehicle-only restrictions</li>
                                            <li>• Parking-related issues</li>
                                            <li>• Most street events (can walk around)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closure Types Detail */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Closure Types and Their Impact</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Construction className="w-6 h-6 text-orange-600" />
                                <h3 className="font-semibold text-orange-900">Construction</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">
                                        Affects: Cars, Bicycles
                                    </span>
                                </div>
                                <p className="text-orange-700 text-sm">
                                    Road work, utility repairs, building construction that blocks vehicle access.
                                </p>
                                <div className="text-orange-600 text-xs">
                                    <strong>Why pedestrians aren't affected:</strong> Usually includes temporary sidewalks or walkways
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="font-semibold text-red-900">Accident</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                                        Affects: Cars, Bicycles
                                    </span>
                                </div>
                                <p className="text-red-700 text-sm">
                                    Traffic accidents, vehicle breakdowns, emergency situations.
                                </p>
                                <div className="text-red-600 text-xs">
                                    <strong>Typically roadway-only:</strong> Pedestrians can usually pass on sidewalks
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">Event</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                        Affects: Cars only
                                    </span>
                                </div>
                                <p className="text-blue-700 text-sm">
                                    Parades, festivals, street fairs, public gatherings.
                                </p>
                                <div className="text-blue-600 text-xs">
                                    <strong>Often allows foot traffic:</strong> Bikes/pedestrians may be permitted
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Wrench className="w-6 h-6 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Maintenance</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        Affects: Cars, Bicycles
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Routine road maintenance, street cleaning, landscaping.
                                </p>
                                <div className="text-gray-600 text-xs">
                                    <strong>Vehicle-focused:</strong> Sidewalks usually remain open
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Cloud className="w-6 h-6 text-purple-600" />
                                <h3 className="font-semibold text-purple-900">Weather</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                                        Affects: All modes
                                    </span>
                                </div>
                                <p className="text-purple-700 text-sm">
                                    Flooding, ice storms, fallen trees, snow accumulation.
                                </p>
                                <div className="text-purple-600 text-xs">
                                    <strong>Safety hazard:</strong> Dangerous for all types of travelers
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <Zap className="w-6 h-6 text-yellow-600" />
                                <h3 className="font-semibold text-yellow-900">Emergency</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                        Affects: All modes
                                    </span>
                                </div>
                                <p className="text-yellow-700 text-sm">
                                    Police activity, fire department operations, hazmat situations.
                                </p>
                                <div className="text-yellow-600 text-xs">
                                    <strong>Complete restriction:</strong> Safety requires avoiding entire area
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialized Closure Types</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Footprints className="w-5 h-5 text-indigo-600" />
                                    <span className="font-medium text-indigo-900">Sidewalk Repair</span>
                                </div>
                                <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded mb-1">
                                    Pedestrians only
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Sidewalk construction, utility work affecting walkways
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Bike className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-900">Bike Lane Closure</span>
                                </div>
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-1">
                                    Bicycles only
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Bike lane maintenance, temporary bike path closures
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Tunnel className="w-5 h-5 text-slate-600" />
                                    <span className="font-medium text-slate-900">Bridge/Tunnel</span>
                                </div>
                                <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded mb-1">
                                    All modes
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Complete infrastructure closure affecting all traffic
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decision Matrix */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Closure Impact Decision Matrix</h2>
                    <p className="text-gray-600 mb-4">
                        This table shows which closure types affect which transportation modes in the routing system:
                    </p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 pr-6 font-medium text-gray-900">Closure Type</th>
                                    <th className="text-center py-3 px-4 font-medium text-blue-600">
                                        <Car className="w-5 h-5 mx-auto mb-1" />
                                        Cars
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-green-600">
                                        <Bike className="w-5 h-5 mx-auto mb-1" />
                                        Bicycles
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-purple-600">
                                        <User className="w-5 h-5 mx-auto mb-1" />
                                        Pedestrians
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { type: 'Construction', car: true, bike: true, pedestrian: false },
                                    { type: 'Accident', car: true, bike: true, pedestrian: false },
                                    { type: 'Event', car: true, bike: false, pedestrian: false },
                                    { type: 'Maintenance', car: true, bike: true, pedestrian: false },
                                    { type: 'Weather', car: true, bike: true, pedestrian: true },
                                    { type: 'Emergency', car: true, bike: true, pedestrian: true },
                                    { type: 'Other', car: true, bike: true, pedestrian: true },
                                    { type: 'Sidewalk Repair', car: false, bike: false, pedestrian: true },
                                    { type: 'Bike Lane Closure', car: false, bike: true, pedestrian: false },
                                    { type: 'Bridge Closure', car: true, bike: true, pedestrian: true },
                                    { type: 'Tunnel Closure', car: true, bike: true, pedestrian: false },
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-3 pr-6 font-medium text-gray-900">{row.type}</td>
                                        <td className="text-center py-3 px-4">
                                            {row.car ? (
                                                <span className="text-red-600 font-bold">✗</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">✓</span>
                                            )}
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            {row.bike ? (
                                                <span className="text-red-600 font-bold">✗</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">✓</span>
                                            )}
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            {row.pedestrian ? (
                                                <span className="text-red-600 font-bold">✗</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">✓</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span className="text-gray-600">Closure affects this mode (route will avoid)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span className="text-gray-600">Closure doesn't affect this mode (route may pass through)</span>
                        </div>
                    </div>
                </div>

                <InfoBox type="info" title="Adaptive Logic">
                    <p className="mb-3">
                        <strong>The system is designed to be flexible and can be easily updated as new closure types
                            are identified or as the impact rules change.</strong>
                    </p>
                    <p>
                        This intelligent filtering ensures that each user gets the most relevant routing advice for their
                        specific situation, avoiding unnecessary detours while ensuring they don't encounter actual
                        obstacles.
                    </p>
                </InfoBox>
            </div>
        </div>
    );
};

export default TransportationModesAndClosures;