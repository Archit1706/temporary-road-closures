"use client"
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { Navigation, Route, MapPin, Zap, AlertTriangle, Info, X, Car, Bike, User } from 'lucide-react';
import RoutingForm from '@/components/Demo/RoutingForm';
import ClosuresList from '@/components/Demo/ClosuresList';
import { Closure } from '@/services/api';

// Dynamically import map to avoid SSR issues
const RoutingMapComponent = dynamic(
    () => import('@/components/Demo/RoutingMapComponent'),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading routing map...</p>
                </div>
            </div>
        )
    }
);

interface RoutePoint {
    lat: number;
    lng: number;
    address?: string;
}

interface CalculatedRoute {
    coordinates: [number, number][];
    distance: number;
    duration: number;
    avoidedClosures: number;
    excludedPoints: [number, number][];
}

export type TransportationMode = 'auto' | 'bicycle' | 'pedestrian';

// Define which closure types affect which transportation modes
const closureTypeEffects: Record<string, TransportationMode[]> = {
    'construction': ['auto', 'bicycle'], // Road construction affects cars and bicycles but not pedestrians
    'accident': ['auto', 'bicycle'], // Traffic accidents typically affect vehicles
    'event': ['auto'], // Street events typically only restrict vehicle access
    'maintenance': ['auto', 'bicycle'], // Road maintenance affects vehicles
    'weather': ['auto', 'bicycle', 'pedestrian'], // Weather can affect all modes
    'emergency': ['auto', 'bicycle', 'pedestrian'], // Emergency closures affect all
    'other': ['auto', 'bicycle', 'pedestrian'], // Generic closures affect all
    'sidewalk_repair': ['pedestrian'], // Sidewalk repairs only affect pedestrians
    'bike_lane_closure': ['bicycle'], // Bike lane closures only affect cyclists
    'bridge_closure': ['auto', 'bicycle', 'pedestrian'], // Bridge closures affect all
    'tunnel_closure': ['auto', 'bicycle'], // Tunnel closures typically affect vehicles
};

// Check if a closure affects a specific transportation mode
const doesClosureAffectMode = (closure: Closure, mode: TransportationMode): boolean => {
    const affectedModes = closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian'];
    return affectedModes.includes(mode);
};

const ClosureAwareRoutingPage: React.FC = () => {
    const [sourcePoint, setSourcePoint] = useState<RoutePoint | null>(null);
    const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);
    const [transportationMode, setTransportationMode] = useState<TransportationMode>('auto');
    const [route, setRoute] = useState<CalculatedRoute | null>(null);
    const [directRoute, setDirectRoute] = useState<CalculatedRoute | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [closuresInPath, setClosuresInPath] = useState<any[]>([]);
    const [relevantClosures, setRelevantClosures] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Calculate bounding box with 1-mile buffer
    const calculateBoundingBox = useCallback((source: RoutePoint, destination: RoutePoint) => {
        const minLat = Math.min(source.lat, destination.lat);
        const maxLat = Math.max(source.lat, destination.lat);
        const minLng = Math.min(source.lng, destination.lng);
        const maxLng = Math.max(source.lng, destination.lng);

        // Add 1-mile buffer (approximately 0.0145 degrees)
        const buffer = 0.0145;

        return {
            north: maxLat + buffer,
            south: minLat - buffer,
            east: maxLng + buffer,
            west: minLng - buffer
        };
    }, []);

    // Fetch closures within bounding box
    const fetchClosuresInPath = useCallback(async (bbox: any) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/closures/?` +
                `bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.items || [];
            } else {
                console.warn('Failed to fetch closures, using empty array');
                return [];
            }
        } catch (error) {
            console.warn('Error fetching closures:', error);
            return [];
        }
    }, []);

    // Filter closures by transportation mode
    const filterClosuresByMode = useCallback((closures: Closure[], mode: TransportationMode) => {
        return closures.filter(closure => {
            // Only consider active closures
            if (closure.status !== 'active') return false;

            // Check if this closure affects the selected transportation mode
            return doesClosureAffectMode(closure, mode);
        });
    }, []);

    // Calculate route with Valhalla API
    const calculateRoute = useCallback(async (
        source: RoutePoint,
        destination: RoutePoint,
        mode: TransportationMode,
        excludeLocations: [number, number][] = []
    ) => {
        const valhallaRequest = {
            locations: [
                { lat: source.lat, lon: source.lng, type: 'break' as const },
                { lat: destination.lat, lon: destination.lng, type: 'break' as const }
            ],
            costing: mode,
            directions_options: {
                units: 'kilometers' as const,
                format: 'json' as const
            },
            ...(excludeLocations.length > 0 && {
                exclude_locations: excludeLocations.map(([lat, lng]) => ({ lat, lon: lng })).slice(0, 49)
            }),
        };

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_VALHALLA_URL || 'https://valhalla1.openstreetmap.de/route',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(valhallaRequest)
                }
            );

            if (!response.ok) {
                throw new Error(`Valhalla API error: ${response.status}`);
            }

            const data = await response.json();

            // Decode polyline to get coordinates
            const shape = data.trip.legs[0]?.shape;
            if (!shape) {
                throw new Error('No route shape returned');
            }

            const coordinates = decodePolyline(shape, 6);

            return {
                coordinates,
                distance: data.trip.summary.length,
                duration: data.trip.summary.time / 60, // Convert to minutes
                avoidedClosures: excludeLocations.length,
                excludedPoints: excludeLocations
            };
        } catch (error) {
            console.error('Valhalla routing error:', error);
            throw new Error('Failed to calculate route');
        }
    }, []);

    // Handle route calculation
    const handleCalculateRoute = useCallback(async () => {
        if (!sourcePoint || !destinationPoint) {
            setError('Please select both source and destination points');
            return;
        }

        setIsCalculating(true);
        setError(null);

        try {
            // 1. Calculate bounding box with buffer
            const bbox = calculateBoundingBox(sourcePoint, destinationPoint);
            console.log('🗺️ Calculated bounding box:', bbox);

            // 2. Fetch closures in the path
            const allClosures = await fetchClosuresInPath(bbox);
            console.log('🚧 Found total closures in path:', allClosures.length);
            setClosuresInPath(allClosures);

            // 3. Filter closures by transportation mode
            const relevantClosuresForMode = filterClosuresByMode(allClosures, transportationMode);
            console.log(`🚧 Found closures relevant to ${transportationMode}:`, relevantClosuresForMode.length);
            setRelevantClosures(relevantClosuresForMode);

            // 4. Extract exclude locations from relevant closures only
            const excludeLocations: [number, number][] = [];
            relevantClosuresForMode.forEach((closure: Closure) => {
                if (closure.status === 'active' && closure.geometry) {
                    if (closure.geometry.type === 'Point') {
                        const [lng, lat] = closure.geometry.coordinates[0];
                        excludeLocations.push([lat, lng]);
                    } else if (closure.geometry.type === 'LineString') {
                        closure.geometry.coordinates.forEach((coord: number[]) => {
                            const [lng, lat] = coord;
                            excludeLocations.push([lat, lng]);
                        });
                    }
                }
            });

            console.log(`🚫 Exclude locations for ${transportationMode}:`, excludeLocations.length);

            // 5. Calculate direct route (no exclusions)
            const directRouteResult = await calculateRoute(sourcePoint, destinationPoint, transportationMode, []);
            setDirectRoute(directRouteResult);

            // 6. Calculate closure-aware route
            const closureAwareRoute = await calculateRoute(sourcePoint, destinationPoint, transportationMode, excludeLocations);
            setRoute(closureAwareRoute);

            console.log(`✅ ${transportationMode} routes calculated successfully`);
        } catch (error) {
            console.error('❌ Route calculation failed:', error);
            setError(error instanceof Error ? error.message : 'Failed to calculate route');
        } finally {
            setIsCalculating(false);
        }
    }, [sourcePoint, destinationPoint, transportationMode, calculateBoundingBox, fetchClosuresInPath, filterClosuresByMode, calculateRoute]);

    // Clear route
    const handleClearRoute = useCallback(() => {
        setRoute(null);
        setDirectRoute(null);
        setClosuresInPath([]);
        setRelevantClosures([]);
        setError(null);
    }, []);

    // Handle transportation mode change
    const handleTransportationModeChange = useCallback((mode: TransportationMode) => {
        setTransportationMode(mode);
        // Clear existing routes when mode changes
        handleClearRoute();
    }, [handleClearRoute]);

    // Get the appropriate icon for the current transportation mode
    const getTransportationIcon = (mode: TransportationMode) => {
        switch (mode) {
            case 'auto':
                return Car;
            case 'bicycle':
                return Bike;
            case 'pedestrian':
                return User;
            default:
                return Navigation;
        }
    };

    const TransportationIcon = getTransportationIcon(transportationMode);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <TransportationIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Closure-Aware Routing
                            </h1>
                            <p className="text-sm text-gray-500">
                                {transportationMode === 'auto' && 'Car routing that avoids road closures'}
                                {transportationMode === 'bicycle' && 'Bicycle routing that avoids relevant closures'}
                                {transportationMode === 'pedestrian' && 'Walking routing that avoids pedestrian closures'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Route Statistics */}
                        {route && (
                            <div className="hidden md:flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1 text-green-600">
                                    <Route className="w-4 h-4" />
                                    <span>{route.distance.toFixed(2)} km</span>
                                </div>
                                <div className="flex items-center space-x-1 text-blue-600">
                                    <Zap className="w-4 h-4" />
                                    <span>{Math.round(route.duration)} min</span>
                                </div>
                                <div className="flex items-center space-x-1 text-orange-600">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{route.avoidedClosures} avoided</span>
                                </div>
                            </div>
                        )}

                        {/* Transportation Mode Indicator */}
                        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                            <TransportationIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700 capitalize">{transportationMode}</span>
                        </div>

                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        >
                            <MapPin className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className={`
          w-96 bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          ${!isSidebarOpen ? 'md:w-0 md:border-r-0' : ''}
        `}>
                    {isSidebarOpen && (
                        <>
                            {/* Routing Form */}
                            <div className="flex-1 overflow-y-auto">
                                <RoutingForm
                                    sourcePoint={sourcePoint}
                                    destinationPoint={destinationPoint}
                                    transportationMode={transportationMode}
                                    onSourceChange={setSourcePoint}
                                    onDestinationChange={setDestinationPoint}
                                    onTransportationModeChange={handleTransportationModeChange}
                                    onCalculateRoute={handleCalculateRoute}
                                    onClearRoute={handleClearRoute}
                                    isCalculating={isCalculating}
                                    route={route}
                                    directRoute={directRoute}
                                    error={error}
                                />

                                {/* Closures List */}
                                {closuresInPath.length > 0 && (
                                    <ClosuresList
                                        closures={closuresInPath}
                                        transportationMode={transportationMode}
                                        relevantClosures={relevantClosures}
                                    />
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <Info className="w-3 h-3" />
                                        <span>Powered by Valhalla routing engine</span>
                                    </div>
                                    <div>Uses OpenStreetMap data and transportation-aware closure filtering</div>
                                    <div className="font-medium text-gray-600">
                                        {relevantClosures.length} of {closuresInPath.length} closures affect {transportationMode}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <RoutingMapComponent
                        sourcePoint={sourcePoint}
                        destinationPoint={destinationPoint}
                        transportationMode={transportationMode}
                        route={route}
                        directRoute={directRoute}
                        closures={closuresInPath}
                        relevantClosures={relevantClosures}
                        onSourceSelect={setSourcePoint}
                        onDestinationSelect={setDestinationPoint}
                    />

                    {/* Sidebar toggle for mobile */}
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-lg p-3 border border-gray-200 md:hidden"
                        >
                            <MapPin className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* Close sidebar button */}
                    {isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-lg p-2 border border-gray-200 md:hidden"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    )}

                    {/* Routing Status */}
                    {isCalculating && (
                        <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span className="text-sm font-medium">Calculating {transportationMode} route...</span>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-md">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
};

// Polyline decoder (precision 6 for Valhalla)
function decodePolyline(str: string, precision: number = 6): [number, number][] {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: [number, number][] = [];
    const factor = Math.pow(10, precision || 5);

    while (index < str.length) {
        let b, shift = 0, result = 0;
        do {
            b = str.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const deltaLat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            b = str.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const deltaLng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
}

export default function ClosureAwareRoutingPageWrapper() {
    return (
        <ClosuresProvider>
            <ClosureAwareRoutingPage />
        </ClosuresProvider>
    );
}