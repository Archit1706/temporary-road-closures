import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, TriangleAlert, X, Info, Zap, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { CreateClosureData, authApi } from '@/services/api';
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
    const [isMinimized, setIsMinimized] = useState(false);
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
            geometry_type: 'LineString',
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
            setIsMinimized(false);
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
        // Check authentication before processing
        if (!authApi.isTokenValid()) {
            alert('Your session has expired. Please log in again to create closures.');
            return;
        }

        if (!selectedPoints || selectedPoints.length === 0) {
            alert('Please select at least one point on the map');
            return;
        }

        if (data.geometry_type === 'LineString' && selectedPoints.length < 2) {
            alert('LineString requires at least 2 points. Please select more points on the map.');
            return;
        }

        const coordinates = selectedPoints.map(point => [point.lng, point.lat]);

        // Convert datetime-local values to UTC ISO strings with timezone
        const startTime = new Date(data.start_time).toISOString();
        const endTime = new Date(data.end_time).toISOString();

        const closureData: CreateClosureData = {
            description: data.description,
            closure_type: data.closure_type,
            source: data.source,
            start_time: startTime,
            end_time: endTime,
            confidence_level: data.confidence_level,
            geometry: {
                type: data.geometry_type,
                coordinates: data.geometry_type === 'Point'
                    ? [coordinates[0]]
                    : coordinates as number[][],
            },
        };

        try {
            console.log('🚀 Submitting closure with auth token:', !!authApi.getToken());
            await createClosure(closureData);
            reset();
            setCurrentStep(1);
            onClose();
        } catch (error) {
            console.error('Error creating closure:', error);
            console.error('Closure data sent:', JSON.stringify(closureData, null, 2));
            // The error will be handled by the context and shown to the user via toast
        }
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 max-h-full overflow-y-auto">
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
                                placeholder="Describe the road closure..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
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
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
                                            {...register('closure_type', { required: 'Please select a closure type' })}
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

                        {/* Confidence Level */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Zap className="w-4 h-4" />
                                <span>Confidence Level *</span>
                            </label>
                            <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
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
                            {errors.confidence_level && (
                                <p className="text-sm text-red-600">{errors.confidence_level.message}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 max-h-full overflow-y-auto scrollbar-thin">
                        {/* Location Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <MapPin className="w-4 h-4" />
                                <span>Road Segment Points *</span>
                            </label>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium mb-1">How to select points:</p>
                                        <ol className="list-decimal list-inside text-xs space-y-0.5">
                                            <li>Click "Start Selecting" below</li>
                                            <li>Click on the map to add points</li>
                                            <li>Need at least 2 points for LineString</li>
                                            <li>Click "Done" when finished</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onPointsSelect}
                                className={`
                                    w-full p-3 border rounded-lg text-left transition-colors text-sm
                                    ${isSelectingPoints
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : selectedPoints.length > 0
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }
                                `}
                            >
                                {isSelectingPoints ? (
                                    'Selecting points... click on the map'
                                ) : selectedPoints.length > 0 ? (
                                    `✓ Selected ${selectedPoints.length} points`
                                ) : (
                                    'Start Selecting Points'
                                )}
                            </button>

                            {selectedPoints.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                                    <h4 className="text-xs font-medium text-gray-700 mb-1">Selected Points:</h4>
                                    <div className="space-y-0.5 max-h-20 overflow-y-auto scrollbar-thin">
                                        {selectedPoints.slice(0, 3).map((point, index) => (
                                            <div key={index} className="text-xs text-gray-600 font-mono">
                                                {index + 1}: [{point.lng.toFixed(4)}, {point.lat.toFixed(4)}]
                                            </div>
                                        ))}
                                        {selectedPoints.length > 3 && (
                                            <div className="text-xs text-gray-500">
                                                ... and {selectedPoints.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                    {selectedPoints.length < 2 && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Need at least 2 points for LineString
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>Start Time *</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('start_time', { required: 'Start time is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                placeholder="e.g., City of Chicago, CPD District 1"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            {errors.source && (
                                <p className="text-sm text-red-600">{errors.source.message}</p>
                            )}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 max-h-full overflow-y-auto scrollbar-thin">
                        {/* Summary */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3 text-sm">Closure Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type: </span>
                                    <span className="text-gray-900">
                                        {watchedClosureType && CLOSURE_TYPES.find(t => t.value === watchedClosureType)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Confidence: </span>
                                    <span className="text-gray-900">
                                        {CONFIDENCE_LEVELS.find(l => l.value === watchedConfidenceLevel)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Points: </span>
                                    <span className="text-gray-900">
                                        {selectedPoints.length} selected
                                    </span>
                                </div>
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

                        {/* Backend Integration Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-blue-700">
                                    <p className="font-medium mb-1">Backend API Integration</p>
                                    <p>This closure will be submitted with OpenLR encoding and timezone-aware timestamps.</p>
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

                        {/* Authentication Warning */}
                        {!state.isAuthenticated && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Info className="w-4 h-4 text-yellow-600" />
                                    <div className="text-sm text-yellow-700">
                                        <p className="font-medium mb-1">Demo Mode Active</p>
                                        <p>You're not logged in. This closure will be saved temporarily for demo purposes only. Log in to save permanently to the backend.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Debug Info for Development */}
                        {selectedPoints.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Debug Info (Development)</h5>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <div>Coordinates: {selectedPoints.length} points</div>
                                    <div>Geometry Type: LineString</div>
                                    <div className="max-h-20 overflow-y-auto scrollbar-thin">
                                        <pre className="text-xs font-mono">
                                            {JSON.stringify(selectedPoints.map(p => [p.lng, p.lat]), null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

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
                        onClick={() => setIsMinimized(!isMinimized)}
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
                    <div className="p-4 border-b border-gray-200 bg-blue-600 text-white flex flex-col items-center space-y-2">
                        <TriangleAlert className="w-5 h-5" />
                        <div className="text-xs text-center font-medium transform -rotate-90 whitespace-nowrap">
                            Report Closure
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-blue-700 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <TriangleAlert className="w-5 h-5" />
                                <div>
                                    <h2 className="text-lg font-semibold">Report Closure</h2>
                                    <div className="flex items-center space-x-2 text-xs text-blue-100">
                                        {state.isAuthenticated ? (
                                            <>
                                                <Shield className="w-3 h-3" />
                                                <span>Authenticated - Saving to backend</span>
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

                        {/* Form Content */}
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                            <div className="flex-1 p-4 overflow-y-auto form-section-scroll">
                                {renderStepContent()}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex space-x-2">
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
                                            >
                                                Previous
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        {currentStep < totalSteps ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={loading || selectedPoints.length < 2}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2 text-sm"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Submitting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TriangleAlert className="w-4 h-4" />
                                                        <span>{state.isAuthenticated ? 'Submit to Backend' : 'Submit to Demo'}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default ClosureForm;