"use client"
import React from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Zap, Building2, Navigation, Edit3, Trash2 } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { useClosures } from '@/context/ClosuresContext';
import { Closure } from '@/services/api';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onEditClosure?: (closureId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onEditClosure }) => {
    const { state, selectClosure, startEditingClosure, canEditClosure, deleteClosure } = useClosures();
    const { closures, selectedClosure, loading, isAuthenticated } = state;

    const getClosureStatus = (closure: Closure): 'active' | 'upcoming' | 'expired' => {
        const now = new Date();
        const startTime = new Date(closure.start_time);
        const endTime = new Date(closure.end_time);

        if (isBefore(now, startTime)) return 'upcoming';
        if (isAfter(now, endTime)) return 'expired';
        return 'active';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'expired':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getConfidenceColor = (level: number) => {
        if (level >= 8) return 'text-green-600';
        if (level >= 6) return 'text-blue-600';
        if (level >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDuration = (hours: number) => {
        if (hours < 1) return `${Math.round(hours * 60)}m`;
        if (hours < 24) return `${Math.round(hours)}h`;
        return `${Math.round(hours / 24)}d`;
    };

    const getDirectionIcon = (closure: Closure) => {
        if (closure.geometry.type === 'Point') return null;
        if (closure.is_bidirectional) return '↔️';
        return '→';
    };

    const getDirectionLabel = (closure: Closure) => {
        if (closure.geometry.type === 'Point') return 'Point closure';
        if (closure.is_bidirectional) return 'Bidirectional';
        return 'Unidirectional';
    };

    const handleClosureClick = (closure: Closure) => {
        selectClosure(closure);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    const handleEditClick = async (e: React.MouseEvent, closureId: number) => {
        e.stopPropagation(); // Prevent closure selection

        try {
            await startEditingClosure(closureId);
            if (onEditClosure) {
                onEditClosure(closureId);
            }
        } catch (error) {
            console.error('Failed to start editing closure:', error);
        }
    };

    const handleDeleteClick = async (e: React.MouseEvent, closureId: number, description: string) => {
        e.stopPropagation(); // Prevent closure selection

        const confirmed = window.confirm(
            `Are you sure you want to delete this closure?\n\n"${description}"\n\nThis action cannot be undone.`
        );

        if (confirmed) {
            try {
                await deleteClosure(closureId);
            } catch (error) {
                console.error('Failed to delete closure:', error);
            }
        }
    };

    const activeClosures = closures.filter(c => getClosureStatus(c) === 'active').length;
    const upcomingClosures = closures.filter(c => getClosureStatus(c) === 'upcoming').length;
    const expiredClosures = closures.filter(c => getClosureStatus(c) === 'expired').length;

    // Calculate direction statistics
    const lineStringClosures = closures.filter(c => c.geometry.type === 'LineString');
    const bidirectionalClosures = lineStringClosures.filter(c => c.is_bidirectional === true).length;
    const unidirectionalClosures = lineStringClosures.filter(c => c.is_bidirectional === false).length;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:top-0 md:h-full md:translate-x-0 md:shadow-none md:border-r md:border-gray-200
            `}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Road Closures ({closures.length})
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Click on a closure to view on map
                    </p>

                    {/* Status Summary */}
                    <div className="flex space-x-2 mt-3">
                        <div className="flex-1 text-center p-2 bg-red-50 rounded-lg">
                            <div className="text-sm font-semibold text-red-800">{activeClosures}</div>
                            <div className="text-xs text-red-600">Active</div>
                        </div>
                        <div className="flex-1 text-center p-2 bg-yellow-50 rounded-lg">
                            <div className="text-sm font-semibold text-yellow-800">{upcomingClosures}</div>
                            <div className="text-xs text-yellow-600">Upcoming</div>
                        </div>
                        <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-semibold text-gray-800">{expiredClosures}</div>
                            <div className="text-xs text-gray-600">Expired</div>
                        </div>
                    </div>

                    {/* Direction Statistics */}
                    {lineStringClosures.length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-1">
                                    <Navigation className="w-3 h-3 text-blue-600" />
                                    <span className="text-blue-800 font-medium">Direction Info</span>
                                </div>
                                <div className="flex space-x-2 text-blue-700">
                                    <span>↔ {bidirectionalClosures}</span>
                                    <span>→ {unidirectionalClosures}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Authentication Status */}
                    {!isAuthenticated && (
                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-orange-700">Demo Mode - Limited Features</span>
                            </div>
                        </div>
                    )}

                    {/* Edit Instructions */}
                    {isAuthenticated && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Edit3 className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-700">
                                    Edit buttons available for your closures
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Closures List */}
                <div className="flex-1 overflow-y-auto hide-scrollbar max-h-[calc(100vh-12rem)]">
                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading closures...</p>
                        </div>
                    ) : closures.length === 0 ? (
                        <div className="p-4 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No road closures reported</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Be the first to report a closure!
                            </p>
                        </div>
                    ) : (
                        <div className="p-2 overflow-y-auto hide-scrollbar">
                            {closures.map((closure) => {
                                const status = getClosureStatus(closure);
                                const isSelected = selectedClosure?.id === closure.id;
                                const directionIcon = getDirectionIcon(closure);
                                const directionLabel = getDirectionLabel(closure);
                                const canEdit = canEditClosure(closure);

                                return (
                                    <div
                                        key={closure.id}
                                        className={`
                                            p-3 mb-2 rounded-lg border cursor-pointer transition-colors relative group
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {/* Action Buttons - Visible on hover for authenticated users */}
                                        {isAuthenticated && canEdit && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={(e) => handleEditClick(e, closure.id)}
                                                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"
                                                        title="Edit closure"
                                                    >
                                                        <Edit3 className="w-3 h-3 text-gray-600 hover:text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, closure.id, closure.description)}
                                                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"
                                                        title="Delete closure"
                                                    >
                                                        <Trash2 className="w-3 h-3 text-gray-600 hover:text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Main Content - Click handler for selection */}
                                        <div onClick={() => handleClosureClick(closure)}>
                                            {/* Header with Status and Confidence */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`
                                                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                                    ${getStatusColor(status)}
                                                `}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <Zap className="w-3 h-3 text-gray-400" />
                                                        <span className={`text-xs font-medium ${getConfidenceColor(closure.confidence_level)}`}>
                                                            {closure.confidence_level}/10
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDuration(closure.duration_hours)}
                                                    </span>
                                                    {/* Edit indicator for owned closures */}
                                                    {canEdit && (
                                                        <div title="You can edit this closure">
                                                            <Edit3 className="w-3 h-3 text-green-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 pr-8">
                                                {closure.description}
                                            </h3>

                                            {/* Closure Type and Direction */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="text-sm text-gray-600 capitalize">
                                                        {closure.closure_type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                {directionIcon && (
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-sm" title={directionLabel}>
                                                            {directionIcon}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {closure.is_bidirectional ? 'Both ways' : 'One way'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timing */}
                                            <div className="space-y-1 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {format(new Date(closure.start_time), 'MMM dd, HH:mm')} -
                                                        {format(new Date(closure.end_time), 'MMM dd, HH:mm')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <Building2 className="w-3 h-3" />
                                                    <span>Source: {closure.source}</span>
                                                </div>

                                                {closure.openlr_code && (
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="font-mono text-xs">
                                                            OpenLR: {closure.openlr_code.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Direction information for LineString closures */}
                                                {closure.geometry.type === 'LineString' && (
                                                    <div className="flex items-center space-x-1">
                                                        <Navigation className="w-3 h-3" />
                                                        <span className="text-xs">
                                                            {closure.is_bidirectional
                                                                ? 'Bidirectional closure'
                                                                : 'Unidirectional closure'}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Submitter info */}
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-3 h-3" />
                                                    <span className="text-xs">ID: {closure.submitter_id}</span>
                                                    {canEdit && (
                                                        <span className="text-green-600 font-medium">(Your closure)</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Validation Status */}
                                            {!closure.is_valid && (
                                                <div className="mt-2 flex items-center space-x-1">
                                                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                                                    <span className="text-xs text-yellow-600">Needs validation</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500 text-center">
                        {isAuthenticated ? (
                            <span>✓ Connected to backend API</span>
                        ) : (
                            <span>⚠ Using demo data</span>
                        )}
                    </div>
                    {lineStringClosures.length > 0 && (
                        <div className="text-xs text-gray-400 text-center mt-1">
                            ↔ {bidirectionalClosures} bidirectional • → {unidirectionalClosures} unidirectional
                        </div>
                    )}
                    {isAuthenticated && (
                        <div className="text-xs text-green-600 text-center mt-1">
                            Hover over your closures to edit or delete
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;