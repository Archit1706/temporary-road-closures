import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn, X, User, Lock, AlertCircle } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LoginFormData {
    username: string;
    password: string;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const { login, state } = useClosures();
    const { loading } = state;
    const [showDemoCredentials, setShowDemoCredentials] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.username, data.password);
            reset();
            onClose();
        } catch (error) {
            // Error handling is done in the context
        }
    };

    const handleDemoLogin = () => {
        setValue('username', 'chicago_mapper');
        setValue('password', 'SecurePass123');
        setShowDemoCredentials(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Login Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <LogIn className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-semibold">Login</h2>
                                <p className="text-blue-100 text-sm">Access the backend API</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4" />
                                <span>Username</span>
                            </label>
                            <input
                                type="text"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                                })}
                                placeholder="Enter your username"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Lock className="w-4 h-4" />
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                placeholder="Enter your password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Demo Credentials */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Demo Account Available</p>
                                    <p className="mb-2">Use the demo credentials to test the backend integration.</p>
                                    {showDemoCredentials && (
                                        <div className="bg-blue-100 rounded p-2 font-mono text-xs">
                                            <div>Username: chicago_mapper</div>
                                            <div>Password: SecurePass123</div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleDemoLogin}
                                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                    >
                                        Fill Demo Credentials
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                            <p>This connects to your local FastAPI backend</p>
                            <p className="text-xs mt-1">Default: http://localhost:8000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;