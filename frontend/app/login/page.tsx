"use client"
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LogIn, Construction, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginFormData {
    username: string;
    password: string;
}

function LoginContent() {
    const { login, state } = useClosures();
    const { loading, isAuthenticated } = state;
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
    } = useForm<LoginFormData>();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Already logged in! Redirecting...');
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    // Show warning after multiple failed attempts
    useEffect(() => {
        if (loginAttempts >= 3) {
            toast.error(
                'Multiple login failures. Please check your credentials or reset your password.',
                { duration: 5000, icon: '⚠️' }
            );
        }
    }, [loginAttempts]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Clear any previous errors
            clearErrors();

            // Show loading toast
            const loadingToast = toast.loading('Signing you in...');

            await login(data.username, data.password);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Success is handled in the context, redirect happens via useEffect
            setLoginAttempts(0); // Reset attempts on success

        } catch (error: any) {
            setLoginAttempts(prev => prev + 1);

            // Get error message
            const errorMessage = error?.message || 'Login failed';
            const statusCode = error?.response?.status || error?.status || 0;

            // Handle specific error types
            if (statusCode === 401 || errorMessage.toLowerCase().includes('incorrect') || errorMessage.toLowerCase().includes('invalid')) {
                setError('username', {
                    type: 'manual',
                    message: 'Invalid username or password'
                });
                setError('password', {
                    type: 'manual',
                    message: 'Invalid username or password'
                });
                toast.error('Invalid username or password. Please try again.', {
                    icon: '🔒',
                    duration: 4000
                });
            } else if (statusCode === 404 || errorMessage.toLowerCase().includes('not found')) {
                setError('username', {
                    type: 'manual',
                    message: 'User not found'
                });
                toast.error('User not found. Please check your username or create an account.', {
                    icon: '👤',
                    duration: 4000
                });
            } else if (errorMessage.toLowerCase().includes('inactive') || errorMessage.toLowerCase().includes('disabled')) {
                toast.error('This account has been disabled. Please contact support.', {
                    icon: '⛔',
                    duration: 5000
                });
            } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
                toast.error('Network error. Please check your connection and try again.', {
                    icon: '🌐',
                    duration: 4000
                });
            } else {
                toast.error(errorMessage || 'Login failed. Please try again.', {
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
                    Sign in to your account
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href={`/register${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>

            {/* Form */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Login attempts warning */}
                    {loginAttempts > 0 && loginAttempts < 3 && (
                        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-yellow-700">
                                    <p className="font-medium">Login attempt {loginAttempts} of 3</p>
                                    <p className="text-xs mt-1">Please ensure you're using the correct credentials.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters'
                                    },
                                    onChange: () => {
                                        // Clear errors when user starts typing
                                        clearErrors('username');
                                        clearErrors('password');
                                    }
                                })}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.username.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        },
                                        onChange: () => {
                                            // Clear errors when user starts typing
                                            clearErrors('password');
                                            clearErrors('username');
                                        }
                                    })}
                                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Enter your password"
                                />
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
                            {errors.password && (
                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.password.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Help Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Need Help?</p>
                                    <ul className="text-xs space-y-1 list-disc list-inside">
                                        <li>Make sure your username is correct (case-sensitive)</li>
                                        <li>Check that Caps Lock is not enabled</li>
                                        <li>Passwords must be at least 6 characters</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5 mr-2" />
                                        Sign in
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                            <a
                                href={`${API_BASE_URL}/api/v1/auth/oauth/osm${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>
                                Continue with OpenStreetMap
                            </a>

                            <a
                                href={`${API_BASE_URL}/api/v1/auth/oauth/github${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                Continue with GitHub
                            </a>

                            <a
                                href={`${API_BASE_URL}/api/v1/auth/oauth/google${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </a>
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
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-xs text-gray-500">
                <p>🔒 Your credentials are securely transmitted and stored</p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <ClosuresProvider>
            <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            }>
                <LoginContent />
            </Suspense>
        </ClosuresProvider>
    );
}