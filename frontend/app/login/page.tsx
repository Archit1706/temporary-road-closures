"use client"
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LogIn, Construction, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
    const [showDemoCredentials, setShowDemoCredentials] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<LoginFormData>();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.username, data.password);
            toast.success('Login successful! Redirecting...');
            // The useEffect above will handle the redirect
        } catch (error) {
            // Error handling is done in the context
        }
    };

    const handleDemoLogin = () => {
        setValue('username', 'chicago_mapper');
        setValue('password', 'SecurePass123');
        setShowDemoCredentials(true);
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
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                                })}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
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
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Demo Credentials */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Demo Account Available</p>
                                    <p className="mb-2">Use the demo credentials to test the backend integration.</p>
                                    {showDemoCredentials && (
                                        <div className="bg-blue-100 rounded p-2 font-mono text-xs mb-2">
                                            <div>Username: chicago_mapper</div>
                                            <div>Password: SecurePass123</div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleDemoLogin}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                    >
                                        Fill Demo Credentials
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
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

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>This connects to your local FastAPI backend</p>
                <p className="mt-1">Default: http://localhost:8000</p>
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