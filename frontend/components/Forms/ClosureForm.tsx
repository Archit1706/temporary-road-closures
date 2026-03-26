// components/Forms/ClosureForm.tsx - Updated with Point/LineString selection
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, TriangleAlert, X, Info, Zap, ChevronLeft, ChevronRight, Shield, Navigation, Route, Edit, Target } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { CreateClosureData, authApi, UpdateClosureData, Closure } from '@/services/api';
import L from 'leaflet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
interface ClosureFormProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPoints?: L.LatLng[];
    onPointsSelect: () => void;
    isSelectingPoints: boolean;
    isMinimized?: boolean;
    onToggleMinimize?: () => void;
    editingClosure?: Closure | null;
    mode?: 'create' | 'edit';
}

interface FormData {
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other' | 'sidewalk_repair' | 'bike_lane_closure' | 'bridge_closure' | 'tunnel_closure';
    source: string;
    start_time: string;
    end_time: string;
    geometry_type: 'Point' | 'LineString';
    confidence_level: number;
    is_bidirectional: boolean;
    transport_mode: 'all' | 'car' | 'hgv' | 'bicycle' | 'foot' | 'motorcycle' | 'bus' | 'emergency';
    attribution?: string;
    data_license?: string;
    status?: 'active' | 'inactive' | 'expired';
}

interface RouteInfo {
    coordinates: [number, number][];
    distance_km: number;
    points_count: number;
    direct_distance: number;
    route_efficiency: number;
}

const CLOSURE_TYPES = [
    { value: 'construction', label: 'Construction Work', icon: '🚧' },
    { value: 'accident', label: 'Traffic Accident', icon: '💥' },
    { value: 'event', label: 'Public Event', icon: '🎉' },
    { value: 'maintenance', label: 'Road Maintenance', icon: '🔧' },
    { value: 'weather', label: 'Weather Conditions', icon: '🌧️' },
    { value: 'emergency', label: 'Emergency Services', icon: '🚨' },
    { value: 'other', label: 'Other', icon: '❓' },
    { value: 'sidewalk_repair', label: 'Sidewalk Repair', icon: '🚶‍♂️' },
    { value: 'bike_lane_closure', label: 'Bike Lane Closure', icon: '🚴‍♂️' },
    { value: 'bridge_closure', label: 'Bridge Closure', icon: '🌉' },
    { value: 'tunnel_closure', label: 'Tunnel Closure', icon: '🌳' },
];

const GEOMETRY_TYPES = [
    {
        value: 'Point',
        label: 'Point Closure',
        icon: Target,
        description: 'Single location closure (intersection, specific address)',
        examples: 'Intersection blocked, building entrance closed, specific accident location',
        color: 'border-orange-500 bg-orange-50'
    },
    {
        value: 'LineString',
        label: 'Road Segment',
        icon: Route,
        description: 'Multiple points creating a road segment closure',
        examples: 'Construction along a street, parade route, multiple-block closure',
        color: 'border-blue-500 bg-blue-50'
    }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'text-red-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-blue-600' },
    { value: 'expired', label: 'Expired', color: 'text-gray-600' },
];

const CONFIDENCE_LEVELS = [
    { value: 1, label: 'Very Low (1)', description: 'Unverified report' },
    { value: 3, label: 'Low (3)', description: 'Single source, unconfirmed' },
    { value: 5, label: 'Medium (5)', description: 'Multiple sources or partial verification' },
    { value: 7, label: 'High (7)', description: 'Verified by official source' },
    { value: 9, label: 'Very High (9)', description: 'Official confirmation with details' },
    { value: 10, label: 'Certain (10)', description: 'Direct observation or official announcement' },
];

const TRANSPORT_MODES = [
    { value: 'all', label: 'All Vehicles', icon: '🚗', description: 'Affects all modes of transport' },
    { value: 'car', label: 'Cars Only', icon: '🚙', description: 'Motor vehicles only' },
    { value: 'hgv', label: 'Heavy Vehicles', icon: '🚛', description: 'Trucks and HGVs' },
    { value: 'bicycle', label: 'Bicycles', icon: '🚴', description: 'Bicycle lanes/paths' },
    { value: 'foot', label: 'Pedestrians', icon: '🚶', description: 'Sidewalks/walkways' },
    { value: 'motorcycle', label: 'Motorcycles', icon: '🏍️', description: 'Motorcycles only' },
    { value: 'bus', label: 'Buses', icon: '🚌', description: 'Public bus routes' },
    { value: 'emergency', label: 'Emergency Vehicles', icon: '🚑', description: 'Emergency access only' },
];

const ClosureForm: React.FC<ClosureFormProps> = ({
    isOpen,
    onClose,
    selectedPoints = [],
    onPointsSelect,
    isSelectingPoints,
    isMinimized = false,
    onToggleMinimize,
    editingClosure = null,
    mode = 'create'
}) => {
    const { createClosure, updateClosure, state } = useClosures();
    const { loading } = state;
    const isMobile = useIsMobile();
    const [currentStep, setCurrentStep] = useState(1);
    const [editPoints, setEditPoints] = useState<L.LatLng[]>([]);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const totalSteps = 3;

    const isEditMode = mode === 'edit' && editingClosure;

    // Convert closure coordinates to LatLng points for editing
    const convertClosureToPoints = (closure: Closure): L.LatLng[] => {
        if (!closure.geometry || !closure.geometry.coordinates) return [];

        if (closure.geometry.type === 'Point') {
            const coords = closure.geometry.coordinates[0] || closure.geometry.coordinates;
            if (Array.isArray(coords) && coords.length >= 2) {
                return [L.latLng(coords[1], coords[0])];
            }
        } else if (closure.geometry.type === 'LineString') {
            return closure.geometry.coordinates.map(coord =>
                L.latLng(coord[1], coord[0])
            );
        }
        return [];
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        trigger,
    } = useForm<FormData>({
        defaultValues: {
            geometry_type: 'LineString',
            start_time: new Date().toISOString().slice(0, 16),
            end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
            confidence_level: 7,
            is_bidirectional: false,
            transport_mode: 'all',
            status: 'active'
        },
    });

    const watchedClosureType = watch('closure_type');
    const watchedGeometryType = watch('geometry_type');
    const watchedConfidenceLevel = watch('confidence_level');
    const watchedIsBidirectional = watch('is_bidirectional');
    const watchedStatus = watch('status');
    const watchedTransportMode = watch('transport_mode');

    // Initialize form with editing data
    useEffect(() => {
        if (isEditMode && editingClosure) {
            console.log('🔄 Initializing form for editing:', editingClosure);

            const points = convertClosureToPoints(editingClosure);
            setEditPoints(points);

            setValue('description', editingClosure.description);
            setValue('closure_type', editingClosure.closure_type);
            setValue('source', editingClosure.source || '');
            setValue('start_time', new Date(editingClosure.start_time).toISOString().slice(0, 16));
            setValue('end_time', new Date(editingClosure.end_time).toISOString().slice(0, 16));
            setValue('confidence_level', editingClosure.confidence_level || 7);
            setValue('is_bidirectional', editingClosure.is_bidirectional || false);
            setValue('transport_mode', editingClosure.transport_mode || 'all');
            setValue('attribution', editingClosure.attribution || '');
            setValue('data_license', editingClosure.data_license || '');
            setValue('status', editingClosure.status);
            setValue('geometry_type', editingClosure.geometry.type);
        }
    }, [isEditMode, editingClosure, setValue]);

    // Reset form when closing
    useEffect(() => {
        if (!isOpen) {
            reset();
            setCurrentStep(1);
            setEditPoints([]);
            setRouteInfo(null);
        }
    }, [isOpen, reset]);

    // Handle route calculation callback from MapComponent
    const handleRouteCalculated = (coordinates: [number, number][], stats: any) => {
        console.log('📍 Route calculated in form:', {
            pointsCount: coordinates.length,
            distance: stats.distance_km,
            directDistance: stats.direct_distance
        });

        const routeEfficiency = stats.direct_distance > 0 ? stats.direct_distance / stats.distance_km : 1;

        setRouteInfo({
            coordinates,
            distance_km: stats.distance_km,
            points_count: coordinates.length,
            direct_distance: stats.direct_distance,
            route_efficiency: routeEfficiency
        });
    };

    // Add event listener for route calculation
    useEffect(() => {
        const handleGlobalRouteCalculated = (event: CustomEvent) => {
            if (isOpen && !isEditMode && watchedGeometryType === 'LineString') {
                handleRouteCalculated(event.detail.coordinates, event.detail.stats);
            }
        };

        window.addEventListener('routeCalculated', handleGlobalRouteCalculated as EventListener);

        return () => {
            window.removeEventListener('routeCalculated', handleGlobalRouteCalculated as EventListener);
        };
    }, [isOpen, isEditMode, watchedGeometryType]);

    // Clear route info when geometry type or selected points change
    useEffect(() => {
        if (watchedGeometryType === 'Point' || selectedPoints.length < 2) {
            setRouteInfo(null);
        }
    }, [selectedPoints, watchedGeometryType]);

    // Watch for geometry type changes and notify parent
    useEffect(() => {
        if (!isEditMode) {
            // Dispatch geometry type change event for the map component
            const event = new CustomEvent('geometryTypeChanged', {
                detail: { geometryType: watchedGeometryType }
            });
            window.dispatchEvent(event);
        }
    }, [watchedGeometryType, isEditMode]);

    const nextStep = async () => {
        const fieldsToValidate = currentStep === 1
            ? ['description', 'closure_type', 'confidence_level', 'geometry_type']
            : currentStep === 2
                ? ['start_time', 'end_time', 'source']
                : [];

        const isValid = await trigger(fieldsToValidate as any);
        if (isValid && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getCurrentPoints = (): L.LatLng[] => {
        return isEditMode ? editPoints : selectedPoints;
    };

    const getRequiredPointsCount = (): number => {
        return watchedGeometryType === 'Point' ? 1 : 2;
    };

    const getPointsSelectionText = (): string => {
        if (watchedGeometryType === 'Point') {
            return 'Click on the map to select a single point';
        }
        return 'Click on the map to select multiple points (minimum 2)';
    };

    const onSubmit = async (data: FormData) => {
        if (!authApi.isTokenValid()) {
            alert('Your session has expired. Please log in again to ' + (isEditMode ? 'update' : 'create') + ' closures.');
            return;
        }

        let finalCoordinates: number[][] | number[] | undefined;

        // Handle Point geometry
        if (data.geometry_type === 'Point') {
            const currentPoints = getCurrentPoints();
            if (!isEditMode && currentPoints.length !== 1) {
                alert('Point closure requires exactly one point. Please select a single point on the map.');
                return;
            }
            if (currentPoints.length > 0) {
                finalCoordinates = [currentPoints[0].lng, currentPoints[0].lat];
            }
        }
        // Handle LineString geometry
        else {
            if (routeInfo && routeInfo.coordinates.length >= 2 && !isEditMode) {
                finalCoordinates = routeInfo.coordinates.map(([lat, lng]) => [lng, lat]);
                console.log('✅ Using Valhalla routed coordinates:', finalCoordinates.length, 'points');
            } else {
                const currentPoints = getCurrentPoints();
                if (!isEditMode && currentPoints.length < 2) {
                    alert('LineString requires at least 2 points. Please select more points on the map.');
                    return;
                }
                if (currentPoints.length > 0) {
                    finalCoordinates = currentPoints.map(point => [point.lng, point.lat]);
                    console.log('⚠️ Using direct coordinates (no route):', finalCoordinates.length, 'points');
                }
            }
        }

        const startTime = new Date(data.start_time).toISOString();
        const endTime = new Date(data.end_time).toISOString();

        try {
            if (isEditMode && editingClosure) {
                const updateData: UpdateClosureData = {
                    description: data.description,
                    closure_type: data.closure_type,
                    source: data.source,
                    start_time: startTime,
                    end_time: endTime,
                    confidence_level: data.confidence_level,
                    status: data.status,
                    transport_mode: data.transport_mode,
                    attribution: data.attribution,
                    data_license: data.data_license,
                };

                if (finalCoordinates && finalCoordinates.length > 0) {
                    updateData.geometry = {
                        type: data.geometry_type,
                        coordinates: data.geometry_type === 'Point'
                            ? [finalCoordinates as number[]]
                            : finalCoordinates as number[][],
                    };
                }

                if (data.geometry_type === 'LineString' || editingClosure.geometry.type === 'LineString') {
                    updateData.is_bidirectional = data.is_bidirectional;
                }

                await updateClosure(editingClosure.id, updateData);
            } else {
                if (!finalCoordinates || finalCoordinates.length === 0) {
                    alert(`Please select ${watchedGeometryType === 'Point' ? 'a point' : 'at least 2 points'} on the map`);
                    return;
                }

                const closureData: CreateClosureData = {
                    description: data.description,
                    closure_type: data.closure_type,
                    source: data.source,
                    start_time: startTime,
                    end_time: endTime,
                    confidence_level: data.confidence_level,
                    is_bidirectional: data.geometry_type === 'LineString' ? data.is_bidirectional : undefined,
                    transport_mode: data.transport_mode,
                    attribution: data.attribution,
                    data_license: data.data_license,
                    geometry: {
                        type: data.geometry_type,
                        coordinates: data.geometry_type === 'Point'
                            ? finalCoordinates as number[]
                            : finalCoordinates as number[][],
                    },
                };

                await createClosure(closureData);
            }

            reset();
            setCurrentStep(1);
            setEditPoints([]);
            setRouteInfo(null);
            onClose();
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} closure:`, error);
        }
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <Textarea
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                                })}
                                placeholder="Describe the road closure..."
                                className="resize-none"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Geometry Type Selection */}
                        {!isEditMode && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Closure Type * <Info className="w-4 h-4 inline ml-1 text-blue-500" />
                                </label>
                                <div className="space-y-3">
                                    {GEOMETRY_TYPES.map(type => {
                                        const Icon = type.icon;
                                        return (
                                            <label
                                                key={type.value}
                                                className={`
                                                    flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                                                    ${watchedGeometryType === type.value
                                                        ? `${type.color} shadow-md`
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    value={type.value}
                                                    className="mt-1 text-blue-600"
                                                    {...register('geometry_type', { required: 'Please select a closure type' })}
                                                />
                                                <Icon className="w-5 h-5 mt-0.5 text-gray-600" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {type.label}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        {type.description}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 italic">
                                                        Examples: {type.examples}
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.geometry_type && (
                                    <p className="text-sm text-red-600">{errors.geometry_type.message}</p>
                                )}
                            </div>
                        )}

                        {/* Closure Reason */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Reason for Closure *
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto scrollbar-thin border border-gray-200 rounded-lg p-2">
                                {CLOSURE_TYPES.map(type => (
                                    <label
                                        key={type.value}
                                        className={`
                                            flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-colors text-sm
                                            ${watchedClosureType === type.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            value={type.value}
                                            className="text-blue-600"
                                            {...register('closure_type', { required: 'Please select a closure reason' })}
                                        />
                                        <span className="text-sm">{type.icon}</span>
                                        <span className="text-xs font-medium">{type.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.closure_type && (
                                <p className="text-sm text-red-600">{errors.closure_type.message}</p>
                            )}
                        </div>

                        {/* Status - Only show in edit mode */}
                        {isEditMode && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Status *
                                </label>
                                <div className="flex space-x-2">
                                    {STATUS_OPTIONS.map(status => (
                                        <label
                                            key={status.value}
                                            className={`
                                                flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-colors text-sm flex-1
                                                ${watchedStatus === status.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                value={status.value}
                                                className="text-blue-600"
                                                {...register('status', { required: 'Please select a status' })}
                                            />
                                            <span className={`text-xs font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confidence Level */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Zap className="w-4 h-4" />
                                <span>Confidence Level *</span>
                            </label>
                            <div className="max-h-48 overflow-y-auto scrollbar-thin border border-gray-200 rounded-lg p-2">
                                <div className="space-y-1">
                                    {CONFIDENCE_LEVELS.map(level => (
                                        <label
                                            key={level.value}
                                            className={`
                                                flex items-start space-x-2 p-2 border rounded-lg cursor-pointer transition-colors
                                                ${watchedConfidenceLevel === level.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                value={level.value}
                                                className="mt-0.5 text-blue-600"
                                                {...register('confidence_level', {
                                                    required: 'Please select a confidence level',
                                                    valueAsNumber: true
                                                })}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {level.label}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {level.description}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {errors.confidence_level && (
                                <p className="text-sm text-red-600">{errors.confidence_level.message}</p>
                            )}
                        </div>

                        {/* Transport Mode */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transport Mode Affected *
                            </label>
                            <div className="space-y-2">
                                {TRANSPORT_MODES.map((mode) => (
                                    <label
                                        key={mode.value}
                                        className={`
                                            flex items-start space-x-2 p-2 border rounded-lg cursor-pointer transition-colors
                                            ${watchedTransportMode === mode.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            value={mode.value}
                                            className="mt-0.5 text-blue-600"
                                            {...register('transport_mode', {
                                                required: 'Please select a transport mode'
                                            })}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-base">{mode.icon}</span>
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {mode.label}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600 mt-0.5">
                                                {mode.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.transport_mode && (
                                <p className="text-sm text-red-600">{errors.transport_mode.message}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                const currentPoints = getCurrentPoints();
                const requiredPoints = getRequiredPointsCount();
                return (
                    <div className="space-y-4">
                        {/* Location Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    Location {watchedGeometryType === 'Point' ? 'Point' : 'Points'}
                                    {isEditMode ? ' (Optional - keep existing if not changed)' : ' *'}
                                </span>
                            </label>

                            {/* Geometry Type Info */}
                            <div className={`
                                p-3 rounded-lg border-2
                                ${watchedGeometryType === 'Point'
                                    ? 'bg-orange-50 border-orange-200'
                                    : 'bg-blue-50 border-blue-200'
                                }
                            `}>
                                <div className="flex items-start space-x-2">
                                    {watchedGeometryType === 'Point' ? (
                                        <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <Route className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className={`text-sm ${watchedGeometryType === 'Point' ? 'text-orange-700' : 'text-blue-700'}`}>
                                        <p className="font-medium mb-1">
                                            {watchedGeometryType === 'Point' ? 'Point Closure Selected' : 'Road Segment Closure Selected'}
                                        </p>
                                        <p className="text-xs">
                                            {getPointsSelectionText()}
                                            {watchedGeometryType === 'LineString' && ' for automatic route calculation.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isEditMode && currentPoints.length > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-green-700">
                                            <p className="font-medium mb-1">Current Location:</p>
                                            <p className="text-xs">
                                                {currentPoints.length} point{currentPoints.length !== 1 ? 's' : ''} from existing closure.
                                                You can modify the location by selecting new points below.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPointsSelect}
                                className={`w-full justify-start text-left font-normal h-auto py-3 ${
                                    isSelectingPoints
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : currentPoints.length >= requiredPoints || (isEditMode && editingClosure)
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300'
                                }`}
                            >
                                {isSelectingPoints ? (
                                    `Selecting ${watchedGeometryType === 'Point' ? 'point' : 'points'}... click on the map`
                                ) : currentPoints.length >= requiredPoints ? (
                                    `✓ ${currentPoints.length} point${currentPoints.length !== 1 ? 's' : ''} selected${isEditMode ? ' (will replace existing)' : ''}`
                                ) : isEditMode && editingClosure ? (
                                    `✓ Using existing location (${editingClosure.geometry.type})`
                                ) : (
                                    `Select ${watchedGeometryType === 'Point' ? 'Point' : 'Points'}`
                                )}
                            </Button>

                            {/* Route Information - Only for LineString */}
                            {watchedGeometryType === 'LineString' && routeInfo && !isEditMode && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                                        <Route className="w-4 h-4 mr-1" />
                                        Valhalla Route Calculated
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                                        <div>Distance: {routeInfo.distance_km.toFixed(2)} km</div>
                                        <div>Points: {routeInfo.points_count}</div>
                                        <div>Direct: {routeInfo.direct_distance.toFixed(2)} km</div>
                                        <div>Efficiency: {(routeInfo.route_efficiency * 100).toFixed(0)}%</div>
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">
                                        ✅ Using Valhalla-calculated road path
                                    </div>
                                </div>
                            )}

                            {currentPoints.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                                    <h4 className="text-xs font-medium text-gray-700 mb-1">
                                        {isEditMode ? 'New ' : ''}Selected Points:
                                    </h4>
                                    <div className="space-y-0.5 max-h-16 overflow-y-auto scrollbar-thin">
                                        {currentPoints.slice(0, watchedGeometryType === 'Point' ? 1 : 3).map((point, index) => (
                                            <div key={index} className="text-xs text-gray-600 font-mono">
                                                {watchedGeometryType === 'Point' ? 'Point' : index + 1}: [{point.lng.toFixed(4)}, {point.lat.toFixed(4)}]
                                            </div>
                                        ))}
                                        {watchedGeometryType === 'LineString' && currentPoints.length > 3 && (
                                            <div className="text-xs text-gray-500">
                                                ... and {currentPoints.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                    {watchedGeometryType === 'LineString' && currentPoints.length < 2 && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Need at least 2 points for road segment
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bidirectional Option - Only for LineString */}
                        {watchedGeometryType === 'LineString' && ((currentPoints.length >= 2) || (isEditMode && editingClosure?.geometry.type === 'LineString')) && (
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Navigation className="w-4 h-4" />
                                    <span>Traffic Direction</span>
                                </label>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('is_bidirectional')}
                                            className="mt-1 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                Bidirectional Closure
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                {watchedIsBidirectional
                                                    ? '↔ Affects traffic in both directions'
                                                    : '→ Affects traffic in one direction only (based on point order)'
                                                }
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Time Range */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>Start Time *</span>
                                </label>
                                <Input
                                    type="datetime-local"
                                    {...register('start_time', { required: 'Start time is required' })}
                                />
                                {errors.start_time && (
                                    <p className="text-sm text-red-600">{errors.start_time.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Clock className="w-4 h-4" />
                                    <span>End Time *</span>
                                </label>
                                <Input
                                    type="datetime-local"
                                    {...register('end_time', {
                                        required: 'End time is required',
                                        validate: (value, formValues) => {
                                            return new Date(value) > new Date(formValues.start_time) || 'End time must be after start time';
                                        }
                                    })}
                                />
                                {errors.end_time && (
                                    <p className="text-sm text-red-600">{errors.end_time.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Source */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4" />
                                <span>Source *</span>
                            </label>
                            <Input
                                type="text"
                                {...register('source', {
                                    required: 'Source is required',
                                    minLength: { value: 2, message: 'Source must be at least 2 characters' }
                                })}
                                placeholder="e.g., City of Chicago, CPD District 1"
                            />
                            {errors.source && (
                                <p className="text-sm text-red-600">{errors.source.message}</p>
                            )}
                        </div>

                        {/* Attribution (Optional) */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Info className="w-4 h-4" />
                                <span>Attribution <span className="text-gray-500 font-normal">(Optional)</span></span>
                            </label>
                            <Input
                                type="text"
                                {...register('attribution')}
                                placeholder="e.g., © City Transportation Department"
                            />
                            <p className="text-xs text-gray-500">
                                Credit for third-party data sources. This will be displayed with the closure information.
                            </p>
                        </div>

                        {/* Data License (Optional) */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Shield className="w-4 h-4" />
                                <span>Data License <span className="text-gray-500 font-normal">(Optional)</span></span>
                            </label>
                            <Input
                                type="text"
                                {...register('data_license')}
                                placeholder="e.g., CC BY 4.0, ODbL"
                            />
                            <p className="text-xs text-gray-500">
                                License under which this data is provided (e.g., Creative Commons, Open Database License).
                            </p>
                        </div>
                    </div>
                );

            case 3:
                const currentPointsStep3 = getCurrentPoints();
                return (
                    <div className="space-y-4">
                        {/* Summary */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3 text-sm">
                                {isEditMode ? 'Updated ' : ''}Closure Summary
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type: </span>
                                    <span className="text-gray-900">
                                        {watchedGeometryType === 'Point' ? 'Point Closure' : 'Road Segment'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Reason: </span>
                                    <span className="text-gray-900">
                                        {watchedClosureType && CLOSURE_TYPES.find(t => t.value === watchedClosureType)?.label}
                                    </span>
                                </div>
                                {isEditMode && (
                                    <div>
                                        <span className="font-medium text-gray-700">Status: </span>
                                        <span className={`${STATUS_OPTIONS.find(s => s.value === watchedStatus)?.color || 'text-gray-900'}`}>
                                            {STATUS_OPTIONS.find(s => s.value === watchedStatus)?.label}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-gray-700">Confidence: </span>
                                    <span className="text-gray-900">
                                        {CONFIDENCE_LEVELS.find(l => l.value === watchedConfidenceLevel)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Location: </span>
                                    <span className="text-gray-900">
                                        {currentPointsStep3.length > 0
                                            ? `${currentPointsStep3.length} ${isEditMode ? 'new ' : ''}point${currentPointsStep3.length !== 1 ? 's' : ''} (${watchedGeometryType})`
                                            : isEditMode && editingClosure
                                                ? `Keeping existing (${editingClosure.geometry.type})`
                                                : 'None selected'
                                        }
                                    </span>
                                </div>

                                {/* Route Information in Summary - Only for LineString */}
                                {watchedGeometryType === 'LineString' && routeInfo && !isEditMode && (
                                    <div>
                                        <span className="font-medium text-gray-700">Route: </span>
                                        <span className="text-green-600">
                                            {routeInfo.distance_km.toFixed(2)}km Valhalla path ({routeInfo.points_count} points)
                                        </span>
                                    </div>
                                )}

                                {/* Direction info - Only for LineString */}
                                {watchedGeometryType === 'LineString' && ((currentPointsStep3.length >= 2) || (isEditMode && editingClosure?.geometry.type === 'LineString')) && (
                                    <div>
                                        <span className="font-medium text-gray-700">Direction: </span>
                                        <span className="text-gray-900">
                                            {watchedIsBidirectional ? 'Bidirectional ↔' : 'Unidirectional →'}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <span className="font-medium text-gray-700">Duration: </span>
                                    <span className="text-gray-900">
                                        {watch('start_time') && watch('end_time') && (
                                            `${Math.round((new Date(watch('end_time')).getTime() - new Date(watch('start_time')).getTime()) / (1000 * 60 * 60))} hours`
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Route Integration Notice - Only for LineString */}
                        {watchedGeometryType === 'LineString' && routeInfo && !isEditMode && (
                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                <Route className="w-4 h-4 !text-green-600" />
                                <AlertTitle>Valhalla Route Integration</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    This closure will use the automatically calculated road path from Valhalla ({routeInfo.points_count} coordinate points) instead of direct point-to-point lines.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Point Closure Notice */}
                        {watchedGeometryType === 'Point' && !isEditMode && (
                            <Alert className="bg-orange-50 text-orange-800 border-orange-200 mt-4">
                                <Target className="w-4 h-4 !text-orange-600" />
                                <AlertTitle>Point Closure</AlertTitle>
                                <AlertDescription className="text-orange-700">
                                    This closure will affect a specific location or intersection. No route calculation needed.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Edit Mode Notice */}
                        {isEditMode && (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
                                <Edit className="w-4 h-4 !text-blue-600" />
                                <AlertTitle>Editing Existing Closure</AlertTitle>
                                <AlertDescription className="text-blue-700">
                                    You are updating closure #{editingClosure?.id}. Only modified fields will be updated.
                                    {currentPointsStep3.length === 0 && ' The location will remain unchanged.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Backend Integration Notice */}
                        <Alert className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
                            <Info className="w-4 h-4 !text-blue-600" />
                            <AlertTitle>Backend API Integration</AlertTitle>
                            <AlertDescription className="text-blue-700">
                                This closure will be {isEditMode ? 'updated' : 'submitted'} with OpenLR encoding,
                                {watchedGeometryType === 'LineString' && ' directional information,'}
                                and timezone-aware timestamps.
                            </AlertDescription>
                        </Alert>

                        {/* Validation Warnings */}
                        {!isEditMode && (
                            <>
                                {watchedGeometryType === 'Point' && currentPointsStep3.length !== 1 && (
                                    <Alert variant="destructive" className="mt-4">
                                        <TriangleAlert className="w-4 h-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            Point closure requires exactly 1 point selected
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {watchedGeometryType === 'LineString' && !routeInfo && currentPointsStep3.length < 2 && (
                                    <Alert variant="destructive" className="mt-4">
                                        <TriangleAlert className="w-4 h-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            Road segment requires at least 2 points for route calculation
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        )}

                        {/* Authentication Warning */}
                        {!state.isAuthenticated && (
                            <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200 mt-4">
                                <Info className="w-4 h-4 !text-yellow-600" />
                                <AlertTitle>Demo Mode Active</AlertTitle>
                                <AlertDescription className="text-yellow-700">
                                    You're not logged in. This closure will be saved temporarily for demo purposes only. Log in to save permanently to the backend.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Shared form header
    const renderFormHeader = () => (
        <div className="bg-blue-600 text-white p-4 flex items-start justify-between shrink-0">
            <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                    {isEditMode ? <Edit className="w-5 h-5" /> : <TriangleAlert className="w-5 h-5" />}
                </div>
                <div>
                    <h2 className="text-lg font-semibold leading-tight">
                        {isEditMode ? 'Edit Closure' : 'Report Closure'}
                    </h2>
                    <div className="flex items-center space-x-2 text-xs text-blue-100 mt-1">
                        {state.isAuthenticated ? (
                            <>
                                <Shield className="w-3 h-3" />
                                <span>
                                    Authenticated - {isEditMode ? 'Updating' : 'Saving'} to backend
                                </span>
                            </>
                        ) : (
                            <>
                                <Info className="w-3 h-3" />
                                <span>Demo mode - Changes temporary</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!isMobile && (
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-blue-700 rounded mt-0.5 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );

    // Shared progress steps
    const renderProgressSteps = () => (
        <div className="px-4 py-3 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${step <= currentStep
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }
                        `}>
                            {step}
                        </div>
                        {step < 3 && (
                            <div className={`
                                w-12 h-1 mx-1
                                ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                            `} />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-2 text-xs text-gray-600">
                Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Closure Details' :
                        currentStep === 2 ? 'Location & Timing' :
                            'Review & Submit'
                }
            </div>
        </div>
    );

    // Shared form footer
    const renderFormFooter = () => (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50 shadow-lg">
            <div className="flex items-center justify-between space-x-2">
                <div className="flex space-x-2">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="rounded-full px-6"
                        >
                            Previous
                        </Button>
                    )}
                </div>

                <div className="flex space-x-2">
                    {currentStep < totalSteps ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={loading || (
                                !isEditMode && (
                                    (watchedGeometryType === 'Point' && getCurrentPoints().length !== 1) ||
                                    (watchedGeometryType === 'LineString' && !routeInfo && getCurrentPoints().length < 2)
                                )
                            )}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 rounded-full px-8"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                                </>
                            ) : (
                                <>
                                    {isEditMode ? <Edit className="w-4 h-4" /> : <TriangleAlert className="w-4 h-4" />}
                                    <span>
                                        {isEditMode
                                            ? (state.isAuthenticated ? 'Update Closure' : 'Update in Demo')
                                            : (state.isAuthenticated ? 'Submit to Backend' : 'Submit to Demo')
                                        }
                                    </span>
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    // --- MOBILE: Bottom Sheet ---
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <SheetContent side="bottom" className="max-h-[85vh] flex flex-col p-0 rounded-t-2xl" showCloseButton={true}>
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                    <SheetTitle className="sr-only">{isEditMode ? 'Edit Closure' : 'Report Closure'}</SheetTitle>
                    <SheetDescription className="sr-only">Closure form</SheetDescription>
                    {renderFormHeader()}
                    {renderProgressSteps()}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="p-4 pb-6">
                                {renderStepContent()}
                            </div>
                        </div>
                        {renderFormFooter()}
                    </form>
                </SheetContent>
            </Sheet>
        );
    }

    // --- DESKTOP: Sidebar ---
    return (
        <>
            {/* Form Sidebar */}
            <div className={`
                fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white shadow-xl transform transition-all duration-300 ease-in-out z-50 border-l border-gray-200
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${isMinimized ? 'w-12' : 'w-96'}
                flex flex-col
            `}>
                {/* Minimize/Expand Button */}
                <div className="absolute -left-8 top-4 z-10">
                    <button
                        onClick={onToggleMinimize}
                        className="bg-white border border-gray-200 rounded-l-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
                    >
                        {isMinimized ? (
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Minimized State */}
                {isMinimized ? (
                    <div className="p-4 border-b border-gray-200 bg-blue-600 text-white flex flex-col items-center gap-4">
                        {isEditMode ? <Edit className="w-5 h-5 flex-shrink-0" /> : <TriangleAlert className="w-5 h-5 flex-shrink-0" />}
                        <div 
                            className="text-xs text-center font-medium whitespace-nowrap tracking-wider py-2"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                            {isEditMode ? 'Edit Closure' : 'Report Closure'}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-blue-700 rounded flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        {renderFormHeader()}
                        {renderProgressSteps()}
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="p-4 pb-6">
                                    {renderStepContent()}
                                </div>
                            </div>
                            {renderFormFooter()}
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default ClosureForm;