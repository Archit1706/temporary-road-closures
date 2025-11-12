"use client"
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LogIn, Construction, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
import toast from 'react-hot-toast';

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
            
            // Handle specific error types
            if (error?.message?.includes('401') || error?.message?.includes('Incorrect')) {
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
            } else if (error?.message?.includes('404')) {
                setError('username', { 
                    type: 'manual', 
                    message: 'User not found' 
                });
                toast.error('User not found. Please check your username or create an account.', {
                    icon: '👤',
                    duration: 4000
                });
            } else if (error?.message?.includes('inactive') || error?.message?.includes('disabled')) {
                toast.error('This account has been disabled. Please contact support.', {
                    icon: '⛔',
                    duration: 5000
                });
            } else if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
                toast.error('Network error. Please check your connection and try again.', {
                    icon: '🌐',
                    duration: 4000
                });
            } else {
                toast.error(error?.message || 'Login failed. Please try again.', {
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
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.username ? 'border-red-300' : 'border-gray-300'
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
                                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
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