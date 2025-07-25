import React from 'react';
import Link from 'next/link';
import { Construction, TriangleAlert, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';

interface HeaderProps {
    onToggleForm: () => void;
    isFormOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleForm, isFormOpen }) => {
    const { state, logout } = useClosures();
    const { isAuthenticated, user } = state;

    // Get current path for redirect
    const getCurrentPath = () => {
        if (typeof window !== 'undefined') {
            return window.location.pathname;
        }
        return '/closures';
    };

    const currentPath = getCurrentPath();
    const redirectParam = currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '';

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <Construction className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                OSM Road Closures
                            </h1>
                            <p className="text-sm text-gray-500">
                                Community-driven road closure reporting
                            </p>
                        </div>
                    </Link>

                    {/* Navigation and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Authentication Status */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 text-sm text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Backend Connected</span>
                                    </div>
                                    {user && (
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">{user.full_name}</span>
                                            {user.is_moderator && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                    Moderator
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 text-sm text-orange-600">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span>Demo Mode</span>
                                </div>
                            )}
                        </div>

                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        ) : (
                            <Link
                                href={`/login${redirectParam}`}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm bg-green-100 text-green-700 hover:bg-green-200"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}

                        {/* Report Closure Button - Only show when authenticated */}
                        {isAuthenticated && (
                            <button
                                onClick={onToggleForm}
                                className={`
                                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                                    ${isFormOpen
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }
                                `}
                            >
                                {isFormOpen ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </>
                                ) : (
                                    <>
                                        <TriangleAlert className="w-4 h-4" />
                                        <span>Report Closure</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;