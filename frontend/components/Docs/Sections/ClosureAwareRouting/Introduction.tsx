import React from 'react';
import { Navigation, Route, MapPin as MapIcon, Car, Bike, User, AlertTriangle, Clock, Zap } from 'lucide-react';
import { SectionHeader, FeatureCard, InfoBox } from '../../Common';

const ClosureRoutingIntroduction: React.FC = () => {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Closure-Aware Routing"
                description="Intelligent route planning that automatically avoids temporary road closures. Get from point A to point B while avoiding construction, accidents, and other road disruptions."
            >
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Navigation}
                        title="Smart Routing"
                        description="Automatically calculates the best route while avoiding active closures"
                        iconColor="text-blue-600"
                    />
                    <FeatureCard
                        icon={AlertTriangle}
                        title="Real-time Awareness"
                        description="Uses live closure data to provide up-to-date routing decisions"
                        iconColor="text-orange-600"
                    />
                    <FeatureCard
                        icon={Route}
                        title="Multi-modal Support"
                        description="Different routing logic for cars, bicycles, and pedestrians"
                        iconColor="text-green-600"
                    />
                </div>
            </SectionHeader>

            <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Closure-Aware Routing?</h2>
                <p className="text-gray-600 mb-4">
                    Closure-aware routing is a navigation feature that considers temporary road closures when
                    calculating the best path between two locations. Instead of routing you through a construction
                    zone or blocked street, the system automatically finds alternative routes that keep you moving.
                </p>

                <p className="text-gray-600 mb-6">
                    Think of it as having a local navigator who knows about all the current road work, accidents,
                    and events in your area. When you ask for directions, they don't just give you the fastest
                    route on paper – they give you the fastest route that's actually open and passable.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why is This Important?</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-900 mb-2">🚧 Common Problems Without It</h4>
                        <ul className="space-y-1 text-red-700 text-sm">
                            <li>• Getting stuck in construction zones</li>
                            <li>• Wasting time on detours you discover too late</li>
                            <li>• Missing appointments due to unexpected closures</li>
                            <li>• Frustrated drivers causing traffic congestion</li>
                            <li>• Safety risks from sudden road blocks</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">✅ Benefits With Closure-Aware Routing</h4>
                        <ul className="space-y-1 text-green-700 text-sm">
                            <li>• Smooth, uninterrupted journeys</li>
                            <li>• Predictable arrival times</li>
                            <li>• Reduced fuel consumption and emissions</li>
                            <li>• Less stress and frustration</li>
                            <li>• Better traffic flow across the city</li>
                        </ul>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">How Does It Work?</h3>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <div className="flex items-start space-x-4">
                        <div className="bg-blue-600 rounded-full p-2">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">The Process in Simple Terms</h4>
                            <ol className="space-y-2 text-blue-800">
                                <li>1. <strong>You enter your destination:</strong> Just like any navigation app</li>
                                <li>2. <strong>System checks for closures:</strong> Looks up current road closures in your area</li>
                                <li>3. <strong>Smart filtering:</strong> Determines which closures affect your mode of travel</li>
                                <li>4. <strong>Route calculation:</strong> Finds the best path avoiding blocked roads</li>
                                <li>5. <strong>You get directions:</strong> Clear route that actually works in real conditions</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transportation Modes</h3>
                <p className="text-gray-600 mb-4">
                    Different types of travelers are affected differently by road closures. The system understands
                    this and adjusts routing accordingly:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Car className="w-6 h-6 text-blue-600" />
                            <h4 className="font-semibold text-blue-900">Cars & Vehicles</h4>
                        </div>
                        <p className="text-blue-700 text-sm mb-2">Most affected by closures:</p>
                        <ul className="space-y-1 text-blue-600 text-xs">
                            <li>• Construction zones</li>
                            <li>• Traffic accidents</li>
                            <li>• Bridge/tunnel closures</li>
                            <li>• Emergency situations</li>
                            <li>• Road maintenance</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Bike className="w-6 h-6 text-green-600" />
                            <h4 className="font-semibold text-green-900">Bicycles</h4>
                        </div>
                        <p className="text-green-700 text-sm mb-2">Affected by some closures:</p>
                        <ul className="space-y-1 text-green-600 text-xs">
                            <li>• Bike lane closures</li>
                            <li>• Construction work</li>
                            <li>• Bridge closures</li>
                            <li>• Weather-related blocks</li>
                            <li>• May bypass some car restrictions</li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <User className="w-6 h-6 text-purple-600" />
                            <h4 className="font-semibold text-purple-900">Pedestrians</h4>
                        </div>
                        <p className="text-purple-700 text-sm mb-2">Least affected, but some limits:</p>
                        <ul className="space-y-1 text-purple-600 text-xs">
                            <li>• Sidewalk repairs</li>
                            <li>• Bridge/tunnel closures</li>
                            <li>• Emergency cordons</li>
                            <li>• Weather hazards</li>
                            <li>• Can often find alternatives</li>
                        </ul>
                    </div>
                </div>

                <InfoBox type="info" title="Community-Powered Data">
                    <p>
                        The closure information comes from community reports, city departments, and other trusted sources.
                        The more people contribute closure information, the more accurate and helpful the routing becomes
                        for everyone.
                    </p>
                </InfoBox>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Who Can Benefit?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">🚗 Daily Commuters</h4>
                        <p className="text-gray-600 text-sm mb-3">
                            Avoid construction delays on your regular route to work or school.
                        </p>

                        <h4 className="font-medium text-gray-900 mb-2">📦 Delivery Drivers</h4>
                        <p className="text-gray-600 text-sm mb-3">
                            Make deliveries more efficiently by avoiding blocked roads.
                        </p>

                        <h4 className="font-medium text-gray-900 mb-2">🚴‍♀️ Cyclists</h4>
                        <p className="text-gray-600 text-sm">
                            Find safe bike routes that avoid construction and bike lane closures.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">🏃‍♂️ Pedestrians</h4>
                        <p className="text-gray-600 text-sm mb-3">
                            Walk safely around sidewalk work and blocked pathways.
                        </p>

                        <h4 className="font-medium text-gray-900 mb-2">🚨 Emergency Services</h4>
                        <p className="text-gray-600 text-sm mb-3">
                            Critical for first responders needing clear paths.
                        </p>

                        <h4 className="font-medium text-gray-900 mb-2">👥 Everyone Else</h4>
                        <p className="text-gray-600 text-sm">
                            Anyone traveling in areas with frequent construction or events.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mt-8">
                    <div className="text-center">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Try It Now</h3>
                        <p className="text-gray-600 mb-4">
                            The closure-aware routing feature is available as an interactive demo.
                            Test it with sample data or connect to the live API for real-time routing.
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="/closure-aware-routing"
                                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors"
                            >
                                <Navigation className="w-5 h-5" />
                                <span>Try Closure-Aware Routing</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClosureRoutingIntroduction;