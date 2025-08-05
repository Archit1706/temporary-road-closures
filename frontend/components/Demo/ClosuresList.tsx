import React from 'react';
import { AlertTriangle, Clock, MapPin, Navigation, Building2, Zap } from 'lucide-react';
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

interface ClosuresListProps {
    closures: Closure[];
}

const ClosuresList: React.FC<ClosuresListProps> = ({ closures }) => {
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

    const activeClosures = closures.filter(isClosureActive);
    const upcomingClosures = closures.filter(c => new Date(c.start_time) > new Date());
    const expiredClosures = closures.filter(c => new Date(c.end_time) < new Date());

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

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="text-sm font-semibold text-red-800">{activeClosures.length}</div>
                        <div className="text-xs text-red-600">Active</div>
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
                            // Sort by status (active first), then by start time
                            if (isClosureActive(a) && !isClosureActive(b)) return -1;
                            if (!isClosureActive(a) && isClosureActive(b)) return 1;
                            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                        })
                        .map((closure) => {
                            const active = isClosureActive(closure);
                            const direction = getDirectionInfo(closure);

                            return (
                                <div
                                    key={closure.id}
                                    className={`border rounded-lg p-3 transition-colors ${active ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{getClosureTypeIcon(closure.closure_type)}</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(closure.status)}`}>
                                                {closure.status}
                                            </span>
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

                                    {/* Active indicator */}
                                    {active && (
                                        <div className="mt-2 pt-2 border-t border-red-200">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-medium text-red-700">
                                                    Currently active - will be avoided in route
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
                            <p className="font-medium mb-1">Route Optimization</p>
                            <p>
                                Active closures are automatically excluded from route calculation using
                                Valhalla's <code className="bg-blue-100 px-1 rounded">exclude_locations</code> parameter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClosuresList;