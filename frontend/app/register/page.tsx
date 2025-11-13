"use client"
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { UserPlus, Construction, ArrowLeft, Eye, EyeOff, User, Mail, Lock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
import toast from 'react-hot-toast';

interface RegisterFormData {
    username: string;
    email: string;
    full_name: string;
    password: string;
    confirmPassword: string;
}

interface PasswordRequirement {
    label: string;
    validator: (password: string) => boolean;
    met: boolean;
}

function RegisterContent() {
    const { register: registerUser, login, state } = useClosures();
    const { loading, isAuthenticated } = state;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        clearErrors,
    } = useForm<RegisterFormData>();

    const password = watch('password');
    const username = watch('username');
    const email = watch('email');

    // Password requirements
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
        { label: 'At least 8 characters', validator: (p) => p.length >= 8, met: false },
        { label: 'At least one uppercase letter (A-Z)', validator: (p) => /[A-Z]/.test(p), met: false },
        { label: 'At least one lowercase letter (a-z)', validator: (p) => /[a-z]/.test(p), met: false },
        { label: 'At least one number (0-9)', validator: (p) => /\d/.test(p), met: false },
        { label: 'At least one special character (!@#$%^&*)', validator: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), met: false },
    ]);

    // Update password requirements dynamically
    useEffect(() => {
        if (password) {
            setPasswordRequirements(prev =>
                prev.map(req => ({
                    ...req,
                    met: req.validator(password)
                }))
            );
        } else {
            setPasswordRequirements(prev =>
                prev.map(req => ({ ...req, met: false }))
            );
        }
    }, [password]);

    // Check if all requirements are met
    const allRequirementsMet = passwordRequirements.every(req => req.met);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Already logged in! Redirecting...');
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // Clear previous errors
            clearErrors();

            // Validate all password requirements
            if (!allRequirementsMet) {
                setError('password', {
                    type: 'manual',
                    message: 'Password does not meet all requirements'
                });
                toast.error('Please ensure your password meets all requirements', {
                    icon: '🔒',
                    duration: 4000
                });
                return;
            }

            // Show loading toast
            const loadingToast = toast.loading('Creating your account...');

            // Register the user
            await registerUser({
                username: data.username,
                email: data.email,
                full_name: data.full_name,
                password: data.password,
            });

            toast.dismiss(loadingToast);
            toast.success('🎉 Account created successfully!', { duration: 3000 });

            // Show auto-login toast
            const loginToast = toast.loading('Logging you in automatically...');

            // Automatically log in the user after successful registration
            await login(data.username, data.password);

            toast.dismiss(loginToast);
            // Success toast is handled in login function

        } catch (error: any) {
            console.error('Registration error:', error);

            // Handle specific error types
            const errorMessage = error?.message || 'Registration failed';
            const statusCode = error?.response?.status || error?.status || 0;

            if (statusCode === 409 || errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
                // Username or email already exists
                const lowerMessage = errorMessage.toLowerCase();

                if (lowerMessage.includes('username')) {
                    setError('username', {
                        type: 'manual',
                        message: 'This username is already taken'
                    });
                    toast.error('This username is already taken. Please choose a different one.', {
                        icon: '👤',
                        duration: 5000
                    });
                } else if (lowerMessage.includes('email')) {
                    setError('email', {
                        type: 'manual',
                        message: 'This email is already registered'
                    });
                    toast.error('This email is already registered. Please use a different email or try logging in.', {
                        icon: '📧',
                        duration: 5000
                    });
                } else {
                    // Generic conflict error
                    toast.error(errorMessage || 'Username or email already exists. Please try different credentials.', {
                        icon: '⚠️',
                        duration: 5000
                    });
                }
            } else if (statusCode === 422 || errorMessage.includes('validation')) {
                toast.error('Please check your input data and try again.', {
                    icon: '❌',
                    duration: 4000
                });
            } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
                toast.error('Network error. Please check your connection and try again.', {
                    icon: '🌐',
                    duration: 4000
                });
            } else {
                toast.error(errorMessage || 'Registration failed. Please try again.', {
                    icon: '❌',
                    duration: 4000
                });
            }
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex items-center justify-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                        <Construction className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">OSM Road Closures</h1>
                    </div>
                </Link>

                <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
                    Create your account
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>

            {/* Form */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="full_name"
                                    type="text"
                                    autoComplete="name"
                                    {...register('full_name', {
                                        required: 'Full name is required',
                                        minLength: { value: 2, message: 'Full name must be at least 2 characters' },
                                        maxLength: { value: 100, message: 'Full name must be less than 100 characters' },
                                        onChange: () => clearErrors('full_name')
                                    })}
                                    className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${errors.full_name ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Enter your full name"
                                />
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.full_name && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.full_name.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="username"
                                    type="text"
                                    autoComplete="username"
                                    {...register('username', {
                                        required: 'Username is required',
                                        minLength: { value: 3, message: 'Username must be at least 3 characters' },
                                        maxLength: { value: 30, message: 'Username must be less than 30 characters' },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: 'Username can only contain letters, numbers, and underscores'
                                        },
                                        onChange: () => clearErrors('username')
                                    })}
                                    className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${errors.username ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Choose a unique username"
                                />
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.username && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.username.message}</span>
                                </div>
                            )}
                            {username && !errors.username && username.length >= 3 && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Username format is valid</span>
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        },
                                        onChange: () => clearErrors('email')
                                    })}
                                    className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Enter your email address"
                                />
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.email && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.email.message}</span>
                                </div>
                            )}
                            {email && !errors.email && email.includes('@') && email.includes('.') && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Email format is valid</span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                        validate: {
                                            hasUpperCase: (value) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                            hasLowerCase: (value) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                            hasNumber: (value) => /\d/.test(value) || 'Password must contain at least one number',
                                            hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
                                        },
                                        onChange: () => clearErrors('password')
                                    })}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Create a strong password"
                                />
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            {(passwordFocused || password) && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                    <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                        <Info className="w-3 h-3 mr-1" />
                                        Password Requirements:
                                    </p>
                                    <ul className="space-y-1">
                                        {passwordRequirements.map((req, index) => (
                                            <li
                                                key={index}
                                                className={`flex items-center space-x-2 text-xs ${req.met ? 'text-green-600' : 'text-gray-500'
                                                    }`}
                                            >
                                                {req.met ? (
                                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 flex-shrink-0 opacity-50" />
                                                )}
                                                <span>{req.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {errors.password && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.password.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match',
                                        onChange: () => clearErrors('confirmPassword')
                                    })}
                                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Confirm your password"
                                />
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.confirmPassword.message}</span>
                                </div>
                            )}
                            {watch('confirmPassword') && watch('confirmPassword') === password && !errors.confirmPassword && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Passwords match</span>
                                </div>
                            )}
                        </div>

                        {/* Important Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-blue-700">
                                    <p className="font-medium mb-1">Important:</p>
                                    <ul className="space-y-0.5 list-disc list-inside">
                                        <li>Choose a unique username (cannot be changed later)</li>
                                        <li>Use a valid email for account recovery</li>
                                        <li>Keep your password secure and don't share it</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !allRequirementsMet}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Create account
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Terms */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>
                        By creating an account, you agree to contribute to the OpenStreetMap community
                        and follow the project guidelines.
                    </p>
                    <p className="mt-2">🔒 Your data is securely encrypted and protected</p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <ClosuresProvider>
            <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            }>
                <RegisterContent />
            </Suspense>
        </ClosuresProvider>
    );
}