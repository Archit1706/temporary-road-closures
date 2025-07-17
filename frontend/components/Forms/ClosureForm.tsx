import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, TriangleAlert, X, Info, Phone, Route, Zap } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { CreateClosureData } from '@/services/api';
import L from 'leaflet';

interface ClosureFormProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPoints?: L.LatLng[];
    onPointsSelect: () => void;
    isSelectingPoints: boolean;
}

interface FormData {
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    source: string;
    start_time: string;
    end_time: string;
    geometry_type: 'Point' | 'LineString';
    confidence_level: number;
}

const CLOSURE_TYPES = [
    { value: 'construction', label: 'Construction Work', icon: '🚧' },
    { value: 'accident', label: 'Traffic Accident', icon: '💥' },
    { value: 'event', label: 'Public Event', icon: '🎉' },
    { value: 'maintenance', label: 'Road Maintenance', icon: '🔧' },
    { value: 'weather', label: 'Weather Conditions', icon: '🌧️' },
    { value: 'emergency', label: 'Emergency Services', icon: '🚨' },
    { value: 'other', label: 'Other', icon: '❓' },
];

const CONFIDENCE_LEVELS = [
    { value: 1, label: 'Very Low (1)', description: 'Unverified report' },
    { value: 3, label: 'Low (3)', description: 'Single source, unconfirmed' },
    { value: 5, label: 'Medium (5)', description: 'Multiple sources or partial verification' },
    { value: 7, label: 'High (7)', description: 'Verified by official source' },
    { value: 9, label: 'Very High (9)', description: 'Official confirmation with details' },
    { value: 10, label: 'Certain (10)', description: 'Direct observation or official announcement' },
];

const ClosureForm: React.FC<ClosureFormProps> = ({
    isOpen,
    onClose,
    selectedPoints = [],
    onPointsSelect,
    isSelectingPoints,
}) => {
    const { createClosure, state } = useClosures();
    const { loading } = state;
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

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
            geometry_type: 'LineString', // Default to LineString since Point is disabled
            start_time: new Date().toISOString().slice(0, 16),
            end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
            confidence_level: 7,
        },
    });

    const watchedClosureType = watch('closure_type');
    const watchedGeometryType = watch('geometry_type');
    const watchedConfidenceLevel = watch('confidence_level');

    // Reset form when closing
    useEffect(() => {
        if (!isOpen) {
            reset();
            setCurrentStep(1);
        }
    }, [isOpen, reset]);

    const nextStep = async () => {
        const fieldsToValidate = currentStep === 1
            ? ['description', 'closure_type', 'confidence_level']
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

    const onSubmit = async (data: FormData) => {
        if (!selectedPoints || selectedPoints.length === 0) {
            alert('Please select at least one point on the map');
            return;
        }

        if (data.geometry_type === 'LineString' && selectedPoints.length < 2) {
            alert('LineString requires at least 2 points. Please select more points on the map.');
            return;
        }

        // Convert LatLng points to coordinates array
        const coordinates = selectedPoints.map(point => [point.lng, point.lat]);

        const closureData: CreateClosureData = {
            description: data.description,
            closure_type: data.closure_type,
            source: data.source,
            start_time: data.start_time,
            end_time: data.end_time,
            confidence_level: data.confidence_level,
            geometry: {
                type: data.geometry_type,
                coordinates: data.geometry_type === 'Point'
                    ? [coordinates[0]] // Point uses single coordinate pair
                    : coordinates as number[][], // LineString uses array of coordinate pairs
            },
        };

        try {
            await createClosure(closureData);
            reset();
            setCurrentStep(1);
            onClose();
        } catch (error) {
            console.error('Error creating closure:', error);
        }
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                                })}
                                placeholder="Describe the road closure (e.g., Water main repair blocking eastbound traffic on Madison Street)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Closure Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Closure Type *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {CLOSURE_TYPES.map(type => (
                                    <label
                                        key={type.value}
                                        className={`
                                            flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
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
                                            {...register('closure_type', { required: 'Please select a closure type' })}
                                        />
                                        <span className="text-lg">{type.icon}</span>
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.closure_type && (
                                <p className="text-sm text-red-600">{errors.closure_type.message}</p>
                            )}
                        </div>

                        {/* Confidence Level */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Zap className="w-4 h-4" />
                                <span>Confidence Level *</span>
                            </label>
                            <div className="space-y-2">
                                {CONFIDENCE_LEVELS.map(level => (
                                    <label
                                        key={level.value}
                                        className={`
                                            flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
                                            ${watchedConfidenceLevel === level.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            value={level.value}
                                            className="mt-1 text-blue-600"
                                            {...register('confidence_level', {
                                                required: 'Please select a confidence level',
                                                valueAsNumber: true
                                            })}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {level.label}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {level.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.confidence_level && (
                                <p className="text-sm text-red-600">{errors.confidence_level.message}</p>
                            )}
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        {/* Geometry Type Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Closure Type
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <input
                                        type="radio"
                                        value="Point"
                                        className="text-blue-600"
                                        disabled
                                        {...register('geometry_type')}
                                    />
                                    <span className="text-sm text-gray-500">Point (intersection/specific location) - Currently Disabled</span>
                                </label>
                                <label className="flex items-center space-x-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                                    <input
                                        type="radio"
                                        value="LineString"
                                        className="text-blue-600"
                                        defaultChecked
                                        {...register('geometry_type')}
                                    />
                                    <span className="text-sm font-medium">Road segment (LineString) - Supported</span>
                                </label>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                    <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-yellow-700">
                                        <p className="font-medium">Backend currently supports LineString only</p>
                                        <p>Point geometry support will be added in future updates.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <MapPin className="w-4 h-4" />
                                <span>Road Segment Points *</span>
                            </label>

                            <button
                                type="button"
                                onClick={onPointsSelect}
                                className={`
                                    w-full p-3 border rounded-lg text-left transition-colors
                                    ${isSelectingPoints
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : selectedPoints.length > 0
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }
                                `}
                            >
                                {isSelectingPoints ? (
                                    'Click on the map to add points to the line segment...'
                                ) : selectedPoints.length > 0 ? (
                                    `Selected ${selectedPoints.length} points for LineString`
                                ) : (
                                    'Click to start selecting points on map'
                                )}
                            </button>

                            {selectedPoints.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Points:</h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {selectedPoints.map((point, index) => (
                                            <div key={index} className="text-xs text-gray-600 font-mono">
                                                Point {index + 1}: [{point.lng.toFixed(6)}, {point.lat.toFixed(6)}]
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {selectedPoints.length < 2 && 'Need at least 2 points for LineString'}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium">How to select road segment:</p>
                                        <ol className="list-decimal list-inside mt-1 space-y-1">
                                            <li>Click "Click to start selecting points"</li>
                                            <li>Click on the map to add points along the road</li>
                                            <li>Add at least 2 points to create a line segment</li>
                                            <li>Points will be connected in order of selection</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>Start Time *</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('start_time', { required: 'Start time is required' })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <input
                                    type="datetime-local"
                                    {...register('end_time', {
                                        required: 'End time is required',
                                        validate: (value, formValues) => {
                                            return new Date(value) > new Date(formValues.start_time) || 'End time must be after start time';
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <input
                                type="text"
                                {...register('source', {
                                    required: 'Source is required',
                                    minLength: { value: 2, message: 'Source must be at least 2 characters' }
                                })}
                                placeholder="Enter source (e.g., City of Chicago, CPD District 1, etc.)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.source && (
                                <p className="text-sm text-red-600">{errors.source.message}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                The organization or person reporting this closure
                            </p>
                        </div>
                    </>
                );

            case 3:
                return (
                    <>
                        {/* Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-4">Closure Summary</h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Type: </span>
                                    <span className="text-sm text-gray-900">
                                        {watchedClosureType && CLOSURE_TYPES.find(t => t.value === watchedClosureType)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Confidence: </span>
                                    <span className="text-sm text-gray-900">
                                        {CONFIDENCE_LEVELS.find(l => l.value === watchedConfidenceLevel)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Geometry: </span>
                                    <span className="text-sm text-gray-900">
                                        {watchedGeometryType} ({selectedPoints.length} points)
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Duration: </span>
                                    <span className="text-sm text-gray-900">
                                        {watch('start_time') && watch('end_time') && (
                                            `${Math.round((new Date(watch('end_time')).getTime() - new Date(watch('start_time')).getTime()) / (1000 * 60 * 60))} hours`
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Backend Integration Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Backend API Integration</p>
                                    <p>This closure will be submitted to the backend API at <code className="bg-blue-100 px-1 rounded">/api/v1/closures/</code> with OpenLR encoding and validation.</p>
                                </div>
                            </div>
                        </div>

                        {/* Validation Warnings */}
                        {selectedPoints.length < 2 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <TriangleAlert className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-700 font-medium">
                                        LineString requires at least 2 points
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                );

            default:
                return null;
        }
    };
    const isSelectingMode = isSelectingPoints && currentStep === 2;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Form Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <TriangleAlert className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Report Road Closure</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-blue-700 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                    ${step <= currentStep
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }
                                `}>
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div className={`
                                        w-16 h-1 mx-2
                                        ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                                    `} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        Step {currentStep} of {totalSteps}: {
                            currentStep === 1 ? 'Closure Details' :
                                currentStep === 2 ? 'Location & Timing' :
                                    'Review & Submit'
                        }
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`
                        p-4 overflow-y-auto space-y-4
                        ${isSelectingMode
                            ? 'max-h-[calc(100vh-8rem)]'
                            : 'max-h-[calc(90vh-12rem)]'
                        }
                    `}>
                        {renderStepContent()}

                        {/* Selection Instructions for selecting mode */}
                        {isSelectingMode && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium mb-2">Select Points on Map</p>
                                        <ul className="space-y-1 text-xs">
                                            <li>• Click points on the map to create the road segment</li>
                                            <li>• Need at least 2 points for LineString</li>
                                            <li>• Points will be connected in order</li>
                                            <li>• Current points: {selectedPoints.length}</li>
                                        </ul>

                                        {selectedPoints.length >= 2 && (
                                            <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-green-700 font-medium text-xs">
                                                        Ready! You can continue to next step.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Navigation */}
                    <div className={`
                        flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50
                        ${isSelectingMode ? 'flex-col space-y-3' : ''}
                    `}>
                        {isSelectingMode ? (
                            /* Selection Mode Footer */
                            <>
                                <div className="w-full text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Click on the map to add points ({selectedPoints.length} selected)
                                    </p>
                                    {selectedPoints.length < 2 && (
                                        <p className="text-xs text-red-600">
                                            Need at least 2 points for LineString
                                        </p>
                                    )}
                                </div>

                                <div className="w-full flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Cancel
                                    </button>

                                    {selectedPoints.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Clear points logic should be handled by parent
                                                window.dispatchEvent(new CustomEvent('clearPoints'));
                                            }}
                                            className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                                        >
                                            Clear Points
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Finish selection
                                            window.dispatchEvent(new CustomEvent('finishSelection'));
                                        }}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        Done Selecting
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Normal Mode Footer */
                            <>
                                <div className="flex space-x-2">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                        >
                                            Previous
                                        </button>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </button>

                                    {currentStep < totalSteps ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading || selectedPoints.length < 2}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Submitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <TriangleAlert className="w-4 h-4" />
                                                    <span>Submit Closure</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClosureForm;