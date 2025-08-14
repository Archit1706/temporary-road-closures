import React from 'react';
import { AlertTriangle, Clock, MapPin, Navigation, Building2, Zap, Car, Bike, User, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Closure {
    id: number;
    description: string;
    closure_type: string;
    status: 'active' | 'cancelled' | 'expired' | 'planned';
    start_time: string;
    end_time: string;
    source: string;
    confidence_level: number;
    geometry: {
        type: 'Point' | 'LineString';
        coordinates: number[][];
    };
    is_bidirectional?: boolean;
}

export type TransportationMode = 'auto' | 'bicycle' | 'pedestrian';

interface ClosuresListProps {
    closures: Closure[];
    transportationMode: TransportationMode;
    relevantClosures: Closure[];
}

// Define which closure types affect which transportation modes
const closureTypeEffects: Record<string, TransportationMode[]> = {
    'construction': ['auto', 'bicycle'],
    'accident': ['auto', 'bicycle'],
    'event': ['auto'],
    'maintenance': ['auto', 'bicycle'],
    'weather': ['auto', 'bicycle', 'pedestrian'],
    'emergency': ['auto', 'bicycle', 'pedestrian'],
    'other': ['auto', 'bicycle', 'pedestrian'],
    'sidewalk_repair': ['pedestrian'],
    'bike_lane_closure': ['bicycle'],
    'bridge_closure': ['auto', 'bicycle', 'pedestrian'],
    'tunnel_closure': ['auto', 'bicycle'],
};

const ClosuresList: React.FC<ClosuresListProps> = ({ closures, transportationMode, relevantClosures }) => {
    const getClosureTypeIcon = (type: string) => {
        switch (type) {
            case 'construction':
                return '🚧';
            case 'accident':
                return '💥';
            case 'event':
                return '🎉';
            case 'maintenance':
                return '🔧';
            case 'weather':
                return '🌧️';
            case 'emergency':
                return '🚨';
            case 'sidewalk_repair':
                return '🚶';
            case 'bike_lane_closure':
                return '🚲';
            case 'bridge_closure':
                return '🌉';
            case 'tunnel_closure':
                return '🚇';
            default:
                return '⚠️';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-red-600 bg-red-100 border-red-200';
            case 'cancelled':
                return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'expired':
                return 'text-gray-600 bg-gray-100 border-gray-200';
            case 'planned':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    const getConfidenceColor = (level: number) => {
        if (level >= 8) return 'text-green-600';
        if (level >= 6) return 'text-blue-600';
        if (level >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getDirectionInfo = (closure: Closure) => {
        if (closure.geometry.type === 'Point') {
            return { icon: '📍', label: 'Point closure' };
        }

        if (closure.is_bidirectional) {
            return { icon: '↔️', label: 'Both directions' };
        }

        return { icon: '→', label: 'One direction' };
    };

    const formatDuration = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        if (duration < 1) return `${Math.round(duration * 60)}m`;
        if (duration < 24) return `${Math.round(duration)}h`;
        return `${Math.round(duration / 24)}d`;
    };

    const isClosureActive = (closure: Closure) => {
        const now = new Date();
        const start = new Date(closure.start_time);
        const end = new Date(closure.end_time);
        return now >= start && now <= end;
    };

    // Check if closure affects the selected transportation mode
    const doesClosureAffectMode = (closure: Closure, mode: TransportationMode): boolean => {
        const affectedModes = closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian'];
        return affectedModes.includes(mode);
    };

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

    const activeClosures = closures.filter(isClosureActive);
    const upcomingClosures = closures.filter(c => new Date(c.start_time) > new Date());
    const expiredClosures = closures.filter(c => new Date(c.end_time) < new Date());

    // Count relevant vs irrelevant closures
    const relevantActiveClosures = activeClosures.filter(c => doesClosureAffectMode(c, transportationMode));
    const irrelevantActiveClosures = activeClosures.filter(c => !doesClosureAffectMode(c, transportationMode));

    if (closures.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-200 bg-white">
            <div className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Closures in Route Area
                    </h3>
                    <span className="text-sm text-gray-500">({closures.length})</span>
                </div>

                {/* Transportation Mode Header */}
                <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <TransportationIcon className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900 capitalize">
                            {transportationMode} Mode Analysis
                        </div>
                        <div className="text-xs text-blue-700">
                            Showing which closures affect your selected transportation mode
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-800">
                            {relevantActiveClosures.length}
                        </div>
                        <div className="text-xs text-red-600">Affecting Route</div>
                        <div className="text-xs text-red-500 mt-1">
                            {relevantActiveClosures.length > 0 ? '🚫 Avoided in routing' : '✅ No restrictions'}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-800">
                            {irrelevantActiveClosures.length}
                        </div>
                        <div className="text-xs text-green-600">Not Affecting</div>
                        <div className="text-xs text-green-500 mt-1">
                            ✅ Safe to ignore
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-semibold text-gray-800">{activeClosures.length}</div>
                        <div className="text-xs text-gray-600">Active Now</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="text-sm font-semibold text-yellow-800">{upcomingClosures.length}</div>
                        <div className="text-xs text-yellow-600">Upcoming</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-semibold text-gray-800">{expiredClosures.length}</div>
                        <div className="text-xs text-gray-600">Expired</div>
                    </div>
                </div>

                {/* Closures List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {closures
                        .sort((a, b) => {
                            // Sort by relevance first, then by status, then by start time
                            const aRelevant = doesClosureAffectMode(a, transportationMode);
                            const bRelevant = doesClosureAffectMode(b, transportationMode);

                            if (aRelevant && !bRelevant) return -1;
                            if (!aRelevant && bRelevant) return 1;

                            if (isClosureActive(a) && !isClosureActive(b)) return -1;
                            if (!isClosureActive(a) && isClosureActive(b)) return 1;

                            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                        })
                        .map((closure) => {
                            const active = isClosureActive(closure);
                            const direction = getDirectionInfo(closure);
                            const affectsMode = doesClosureAffectMode(closure, transportationMode);
                            const affectedModes = closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian'];

                            return (
                                <div
                                    key={closure.id}
                                    className={`border rounded-lg p-3 transition-colors ${active && affectsMode
                                        ? 'border-red-200 bg-red-50'
                                        : active && !affectsMode
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{getClosureTypeIcon(closure.closure_type)}</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(closure.status)}`}>
                                                {closure.status}
                                            </span>
                                            {active && (
                                                affectsMode ? (
                                                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                                        <XCircle className="w-3 h-3" />
                                                        <span>Blocks Route</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span>Doesn't Affect</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Zap className="w-3 h-3 text-gray-400" />
                                            <span className={`text-xs font-medium ${getConfidenceColor(closure.confidence_level)}`}>
                                                {closure.confidence_level}/10
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
                                        {closure.description}
                                    </h4>

                                    {/* Transportation Mode Effects */}
                                    <div className="flex items-center space-x-3 mb-2 text-xs">
                                        <span className="text-gray-600">Affects:</span>
                                        <div className="flex items-center space-x-2">
                                            {['auto', 'bicycle', 'pedestrian'].map((mode) => {
                                                const Icon = getTransportationIcon(mode as TransportationMode);
                                                const isAffected = affectedModes.includes(mode as TransportationMode);
                                                const isCurrentMode = mode === transportationMode;

                                                return (
                                                    <div
                                                        key={mode}
                                                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${isAffected
                                                            ? isCurrentMode
                                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                                : 'bg-orange-100 text-orange-600'
                                                            : isCurrentMode
                                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                                : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                        title={`${isAffected ? 'Affects' : 'Does not affect'} ${mode}`}
                                                    >
                                                        <Icon className="w-3 h-3" />
                                                        {isCurrentMode && (
                                                            <span className="text-xs">
                                                                {isAffected ? '✗' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1 text-xs text-gray-600">
                                        {/* Type and Direction */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <span className="capitalize">{closure.closure_type.replace('_', ' ')}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>{direction.icon}</span>
                                                <span>{direction.label}</span>
                                            </div>
                                        </div>

                                        {/* Timing */}
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {format(new Date(closure.start_time), 'MMM dd, HH:mm')} -
                                                {format(new Date(closure.end_time), 'MMM dd, HH:mm')}
                                            </span>
                                            <span className="text-gray-500">
                                                ({formatDuration(closure.start_time, closure.end_time)})
                                            </span>
                                        </div>

                                        {/* Source */}
                                        <div className="flex items-center space-x-1">
                                            <Building2 className="w-3 h-3" />
                                            <span>{closure.source}</span>
                                        </div>

                                        {/* Geometry info */}
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>
                                                {closure.geometry.type === 'Point'
                                                    ? 'Point location'
                                                    : `${closure.geometry.coordinates.length} coordinate points`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Active indicator for relevant closures */}
                                    {active && affectsMode && (
                                        <div className="mt-2 pt-2 border-t border-red-200">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-medium text-red-700">
                                                    Currently blocking {transportationMode} traffic - avoided in route
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active indicator for irrelevant closures */}
                                    {active && !affectsMode && (
                                        <div className="mt-2 pt-2 border-t border-green-200">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-medium text-green-700">
                                                    Active but doesn't affect {transportationMode} traffic
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* Information Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <Navigation className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Smart Transportation Mode Filtering</p>
                            <p>
                                Only closures that affect <span className="font-medium capitalize">{transportationMode}</span> traffic
                                are excluded from route calculation using Valhalla's routing engine.
                            </p>
                            <div className="mt-2 text-xs">
                                <p><strong>Example:</strong> Construction work typically affects cars and bicycles but not pedestrians.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClosuresList;