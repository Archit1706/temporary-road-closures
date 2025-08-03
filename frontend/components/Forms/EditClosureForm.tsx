// components/Forms/EditClosureForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, TriangleAlert, X, Info, Zap, ChevronLeft, ChevronRight, Shield, Navigation, Route, Edit3 } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { UpdateClosureData, authApi, Closure } from '@/services/api';

interface EditClosureFormProps {
    isOpen: boolean;
    onClose: () => void;
    closure: Closure;
}

interface FormData {
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    source: string;
    start_time: string;
    end_time: string;
    confidence_level: number;
    status: 'active' | 'inactive' | 'expired';
    is_bidirectional: boolean;
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

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', description: 'Currently in effect' },
    { value: 'cancelled', label: 'Cancelled', description: 'Not currently active' },
    { value: 'expired', label: 'Expired', description: 'No longer valid' },
];

const EditClosureForm: React.FC<EditClosureFormProps> = ({
    isOpen,
    onClose,
    closure
}) => {
    const { updateClosure, state } = useClosures();
    const { editLoading } = state;
    const [currentStep, setCurrentStep] = useState(1);
    const [isMinimized, setIsMinimized] = useState(false);
    const totalSteps = 3;

    // Convert timestamps to datetime-local format
    const formatDateTimeLocal = (isoString: string): string => {
        return new Date(isoString).toISOString().slice(0, 16);
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
            description: closure.description,
            closure_type: closure.closure_type,
            source: closure.source || '',
            start_time: formatDateTimeLocal(closure.start_time),
            end_time: formatDateTimeLocal(closure.end_time),
            confidence_level: closure.confidence_level || 7,
            status: closure.status,
            is_bidirectional: closure.is_bidirectional || false,
        },
    });

    const watchedClosureType = watch('closure_type');
    const watchedConfidenceLevel = watch('confidence_level');
    const watchedStatus = watch('status');
    const watchedIsBidirectional = watch('is_bidirectional');

    // Reset form when closure changes or closing
    useEffect(() => {
        if (closure) {
            reset({
                description: closure.description,
                closure_type: closure.closure_type,
                source: closure.source || '',
                start_time: formatDateTimeLocal(closure.start_time),
                end_time: formatDateTimeLocal(closure.end_time),
                confidence_level: closure.confidence_level || 7,
                status: closure.status,
                is_bidirectional: closure.is_bidirectional || false,
            });
        }

        if (!isOpen) {
            setCurrentStep(1);
            setIsMinimized(false);
        }
    }, [closure, isOpen, reset]);

    const nextStep = async () => {
        const fieldsToValidate = currentStep === 1
            ? ['description', 'closure_type', 'confidence_level', 'status']
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
            alert('Your session has expired. Please log in again to update closures.');
            return;
        }

        // Convert datetime-local values to UTC ISO strings
        const startTime = new Date(data.start_time).toISOString();
        const endTime = new Date(data.end_time).toISOString();

        // Prepare update data (only include fields that can be updated)
        const updateData: UpdateClosureData = {
            description: data.description,
            closure_type: data.closure_type,
            source: data.source,
            start_time: startTime,
            end_time: endTime,
            confidence_level: data.confidence_level,
            status: data.status,
        };

        // Only include is_bidirectional for LineString geometries
        if (closure.geometry.type === 'LineString') {
            updateData.is_bidirectional = data.is_bidirectional;
        }

        try {
            console.log('🚀 Updating closure with auth token:', !!authApi.getToken());
            await updateClosure(closure.id, updateData);
            reset();
            setCurrentStep(1);
            onClose();
        } catch (error) {
            console.error('Error updating closure:', error);
            console.error('Update data sent:', JSON.stringify(updateData, null, 2));
            // The error will be handled by the context and shown to the user via toast
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

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Status *
                            </label>
                            <div className="space-y-2">
                                {STATUS_OPTIONS.map(status => (
                                    <label
                                        key={status.value}
                                        className={`
                                            flex items-start space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
                                            ${watchedStatus === status.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            value={status.value}
                                            className="mt-0.5 text-blue-600"
                                            {...register('status', { required: 'Please select a status' })}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm">
                                                {status.label}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {status.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.status && (
                                <p className="text-sm text-red-600">{errors.status.message}</p>
                            )}
                        </div>

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
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        {/* Geometry Information (Read-Only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Geometry Information
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-sm text-gray-700">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Route className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">
                                            {closure.geometry.type === 'Point' ? 'Point Closure' : 'Road Segment'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {closure.geometry.type === 'Point'
                                            ? 'Single point location'
                                            : `${closure.geometry.coordinates.length} coordinate points`
                                        }
                                    </div>
                                    {closure.openlr_code && (
                                        <div className="text-xs text-blue-600 mt-1 font-mono">
                                            OpenLR: {closure.openlr_code}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                💡 Geometry cannot be modified during editing. Create a new closure to change location.
                            </div>
                        </div>

                        {/* Bidirectional Option - Only show for LineString */}
                        {closure.geometry.type === 'LineString' && (
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
                                                    : '→ Affects traffic in one direction only'
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
                    <div className="space-y-4">
                        {/* Summary */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3 text-sm">Updated Closure Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type: </span>
                                    <span className="text-gray-900">
                                        {watchedClosureType && CLOSURE_TYPES.find(t => t.value === watchedClosureType)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status: </span>
                                    <span className={`font-medium ${watchedStatus === 'active' ? 'text-green-600' :
                                        watchedStatus === 'expired' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {STATUS_OPTIONS.find(s => s.value === watchedStatus)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Confidence: </span>
                                    <span className="text-gray-900">
                                        {CONFIDENCE_LEVELS.find(l => l.value === watchedConfidenceLevel)?.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Geometry: </span>
                                    <span className="text-gray-900">
                                        {closure.geometry.type === 'Point' ? 'Point' : 'Road Segment'}
                                        {closure.geometry.type === 'LineString' && (
                                            <span className="ml-2">
                                                {watchedIsBidirectional ? '(Bidirectional ↔)' : '(Unidirectional →)'}
                                            </span>
                                        )}
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

                        {/* Original vs Updated */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Changes Summary</h4>
                            <div className="text-xs text-blue-700 space-y-1">
                                <div>Original ID: {closure.id}</div>
                                <div>Created: {new Date(closure.created_at).toLocaleDateString()}</div>
                                <div>Last Updated: {new Date(closure.updated_at).toLocaleDateString()}</div>
                                {closure.openlr_code && (
                                    <div>OpenLR: {closure.openlr_code}</div>
                                )}
                            </div>
                        </div>

                        {/* Backend Integration Notice */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-green-700">
                                    <p className="font-medium mb-1">Backend API Update</p>
                                    <p>This update will be saved to the backend database with proper validation and OpenLR encoding maintained.</p>
                                </div>
                            </div>
                        </div>

                        {/* Authentication Warning */}
                        {!state.isAuthenticated && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Info className="w-4 h-4 text-yellow-600" />
                                    <div className="text-sm text-yellow-700">
                                        <p className="font-medium mb-1">Authentication Required</p>
                                        <p>You must be logged in to save changes to the backend.</p>
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
                    <div className="p-4 border-b border-gray-200 bg-orange-600 text-white flex flex-col items-center space-y-2">
                        <Edit3 className="w-5 h-5" />
                        <div className="text-xs text-center font-medium transform -rotate-90 whitespace-nowrap">
                            Edit Closure
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-orange-700 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Edit3 className="w-5 h-5" />
                                <div>
                                    <h2 className="text-lg font-semibold">Edit Closure</h2>
                                    <div className="flex items-center space-x-2 text-xs text-orange-100">
                                        <Shield className="w-3 h-3" />
                                        <span>ID: {closure.id} - Updating backend</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-orange-700 rounded"
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
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            }
                                        `}>
                                            {step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`
                                                w-12 h-1 mx-1
                                                ${step < currentStep ? 'bg-orange-600' : 'bg-gray-200'}
                                            `} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                                Step {currentStep} of {totalSteps}: {
                                    currentStep === 1 ? 'Basic Information' :
                                        currentStep === 2 ? 'Location & Timing' :
                                            'Review & Update'
                                }
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="p-4 pb-6">
                                    {renderStepContent()}
                                </div>
                            </div>

                            {/* Fixed Footer - Always Visible */}
                            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50 shadow-lg">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex space-x-2">
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
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
                                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm transition-colors"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={editLoading}
                                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2 text-sm transition-colors"
                                            >
                                                {editLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Updating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit3 className="w-4 h-4" />
                                                        <span>Update Closure</span>
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

export default EditClosureForm;