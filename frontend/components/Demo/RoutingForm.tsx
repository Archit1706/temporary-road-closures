import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Navigation, Route, Zap, AlertTriangle, RotateCcw, ArrowRight, Clock, TrendingUp, Car, Bike, User } from 'lucide-react';

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

interface RoutingFormProps {
    sourcePoint: RoutePoint | null;
    destinationPoint: RoutePoint | null;
    transportationMode: TransportationMode;
    onSourceChange: (point: RoutePoint | null) => void;
    onDestinationChange: (point: RoutePoint | null) => void;
    onTransportationModeChange: (mode: TransportationMode) => void;
    onCalculateRoute: () => void;
    onClearRoute: () => void;
    isCalculating: boolean;
    route: CalculatedRoute | null;
    directRoute: CalculatedRoute | null;
    error: string | null;
}

interface FormData {
    source: string;
    destination: string;
}

const transportationModes = [
    {
        key: 'auto' as TransportationMode,
        label: 'Car',
        icon: Car,
        color: 'blue' as const,
        description: 'Driving routes using roads and highways'
    },
    {
        key: 'bicycle' as TransportationMode,
        label: 'Bicycle',
        icon: Bike,
        color: 'green' as const,
        description: 'Cycling routes using bike lanes and roads'
    },
    {
        key: 'pedestrian' as TransportationMode,
        label: 'Walking',
        icon: User,
        color: 'orange' as const,
        description: 'Walking routes using sidewalks and paths'
    }
];

const RoutingForm: React.FC<RoutingFormProps> = ({
    sourcePoint,
    destinationPoint,
    transportationMode,
    onSourceChange,
    onDestinationChange,
    onTransportationModeChange,
    onCalculateRoute,
    onClearRoute,
    isCalculating,
    route,
    directRoute,
    error
}) => {
    const [isSelectingSource, setIsSelectingSource] = useState(false);
    const [isSelectingDestination, setIsSelectingDestination] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>();

    // Geocoding function
    const geocodeAddress = async (address: string): Promise<RoutePoint | null> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=us`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    address: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    const handleFormSubmit = async (data: FormData) => {
        if (data.source && !sourcePoint) {
            const sourceResult = await geocodeAddress(data.source);
            if (sourceResult) {
                onSourceChange(sourceResult);
            }
        }

        if (data.destination && !destinationPoint) {
            const destResult = await geocodeAddress(data.destination);
            if (destResult) {
                onDestinationChange(destResult);
            }
        }

        // If both points are set, calculate route
        if ((sourcePoint || data.source) && (destinationPoint || data.destination)) {
            onCalculateRoute();
        }
    };

    const handleMapSelection = (type: 'source' | 'destination') => {
        if (type === 'source') {
            setIsSelectingSource(true);
            setIsSelectingDestination(false);
        } else {
            setIsSelectingDestination(true);
            setIsSelectingSource(false);
        }
    };

    const handleClear = () => {
        onClearRoute();
        onSourceChange(null);
        onDestinationChange(null);
        setValue('source', '');
        setValue('destination', '');
        setIsSelectingSource(false);
        setIsSelectingDestination(false);
    };

    const formatCoordinate = (lat: number, lng: number) => {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const routeComparison = route && directRoute ? {
        distanceIncrease: ((route.distance - directRoute.distance) / directRoute.distance) * 100,
        timeIncrease: ((route.duration - directRoute.duration) / directRoute.duration) * 100,
        distanceDiff: route.distance - directRoute.distance,
        timeDiff: route.duration - directRoute.duration
    } : null;

    const selectedMode = transportationModes.find(mode => mode.key === transportationMode);

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <Navigation className="w-6 h-6 text-blue-600" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Route Planning</h2>
                    <p className="text-sm text-gray-500">Plan routes that avoid relevant road closures</p>
                </div>
            </div>

            {/* Transportation Mode Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Transportation Mode</label>
                <div className="grid grid-cols-3 gap-2">
                    {transportationModes.map((mode) => {
                        const Icon = mode.icon;
                        const isSelected = transportationMode === mode.key;
                        const colorClasses = {
                            blue: {
                                selected: 'bg-blue-600 text-white border-blue-600',
                                unselected: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                            },
                            green: {
                                selected: 'bg-green-600 text-white border-green-600',
                                unselected: 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                            },
                            orange: {
                                selected: 'bg-orange-600 text-white border-orange-600',
                                unselected: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'
                            }
                        };

                        return (
                            <button
                                key={mode.key}
                                type="button"
                                onClick={() => onTransportationModeChange(mode.key)}
                                className={`
                                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                                    ${isSelected
                                        ? colorClasses[mode.color as keyof typeof colorClasses].selected
                                        : colorClasses[mode.color as keyof typeof colorClasses].unselected
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium">{mode.label}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-gray-500">
                    {selectedMode?.description}
                </p>
            </div>

            {/* Route Input Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Source */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Start Location</span>
                    </label>

                    {sourcePoint ? (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-green-900">
                                        {sourcePoint.address || 'Selected Point'}
                                    </div>
                                    <div className="text-xs text-green-700 font-mono">
                                        {formatCoordinate(sourcePoint.lat, sourcePoint.lng)}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onSourceChange(null)}
                                    className="text-green-600 hover:text-green-800 text-sm underline"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                {...register('source', { required: 'Start location is required' })}
                                type="text"
                                placeholder="Enter address or coordinates"
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSelectingSource ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                    }`}
                            />
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => handleMapSelection('source')}
                                    className={`text-sm px-3 py-1 rounded ${isSelectingSource
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {isSelectingSource ? 'Click on map' : 'Select on map'}
                                </button>
                                {errors.source && (
                                    <span className="text-sm text-red-600">{errors.source.message}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Destination */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span>Destination</span>
                    </label>

                    {destinationPoint ? (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-red-900">
                                        {destinationPoint.address || 'Selected Point'}
                                    </div>
                                    <div className="text-xs text-red-700 font-mono">
                                        {formatCoordinate(destinationPoint.lat, destinationPoint.lng)}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDestinationChange(null)}
                                    className="text-red-600 hover:text-red-800 text-sm underline"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                {...register('destination', { required: 'Destination is required' })}
                                type="text"
                                placeholder="Enter address or coordinates"
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSelectingDestination ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => handleMapSelection('destination')}
                                    className={`text-sm px-3 py-1 rounded ${isSelectingDestination
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {isSelectingDestination ? 'Click on map' : 'Select on map'}
                                </button>
                                {errors.destination && (
                                    <span className="text-sm text-red-600">{errors.destination.message}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={isCalculating || (!sourcePoint && !watch('source')) || (!destinationPoint && !watch('destination'))}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                    >
                        {isCalculating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Calculating...</span>
                            </>
                        ) : (
                            <>
                                <Route className="w-4 h-4" />
                                <span>Calculate Route</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Selection Instructions */}
            {(isSelectingSource || isSelectingDestination) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">
                                {isSelectingSource ? 'Select Start Location' : 'Select Destination'}
                            </p>
                            <p>Click anywhere on the map to set your {isSelectingSource ? 'start location' : 'destination'}.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Transportation Mode Info */}
            {route && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        {selectedMode && <selectedMode.icon className="w-4 h-4 text-gray-600" />}
                        <span className="text-sm font-medium text-gray-900">
                            Route optimized for {selectedMode?.label.toLowerCase()}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600">
                        Only closures affecting {selectedMode?.label.toLowerCase()} traffic are considered for route avoidance.
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-700">
                            <p className="font-medium mb-1">Routing Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Route Results */}
            {route && (
                <div className="space-y-4">
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Route Information</h3>

                        {/* Closure-Aware Route */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                                <Route className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900">
                                    Closure-Aware Route ({selectedMode?.label})
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Zap className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700">
                                        {route.distance.toFixed(2)} km
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700">
                                        {Math.round(route.duration)} min
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 col-span-2">
                                    <AlertTriangle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700">
                                        {route.avoidedClosures} relevant closure points avoided
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Direct Route Comparison */}
                        {directRoute && routeComparison && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <ArrowRight className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Direct Route (for comparison)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-700">
                                            {directRoute.distance.toFixed(2)} km
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-700">
                                            {Math.round(directRoute.duration)} min
                                        </span>
                                    </div>
                                </div>

                                {/* Comparison Stats */}
                                {(Math.abs(routeComparison.distanceIncrease) > 0.1 || Math.abs(routeComparison.timeIncrease) > 0.1) && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-900">Impact of Avoiding Closures</span>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Additional distance:</span>
                                                <span className={`font-medium ${routeComparison.distanceDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {routeComparison.distanceDiff > 0 ? '+' : ''}{routeComparison.distanceDiff.toFixed(2)} km
                                                    ({routeComparison.distanceIncrease > 0 ? '+' : ''}{routeComparison.distanceIncrease.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Additional time:</span>
                                                <span className={`font-medium ${routeComparison.timeDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {routeComparison.timeDiff > 0 ? '+' : ''}{Math.round(routeComparison.timeDiff)} min
                                                    ({routeComparison.timeIncrease > 0 ? '+' : ''}{routeComparison.timeIncrease.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!route && !isCalculating && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">How it works</h3>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Select your preferred mode of transportation</li>
                        <li>Enter or select your start and destination points</li>
                        <li>We'll find closures relevant to your chosen transportation mode</li>
                        <li>Valhalla routing engine calculates the best path avoiding relevant closures</li>
                        <li>Compare the closure-aware route with the direct route</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default RoutingForm;