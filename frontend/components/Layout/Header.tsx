import React from 'react';
import Link from 'next/link';
import { Construction, TriangleAlert, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';

const DemoControlPanel = dynamic(() => import('@/components/Demo/DemoControlPanel'), { ssr: false });


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
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Sidebar Trigger (replaces redundant logo) */}
                    <div className="flex items-center">
                        <SidebarTrigger className="-ml-1" />
                    </div>

                    {/* Navigation and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Authentication Status */}
                        <div className="hidden md:flex items-center space-x-4">
                            <DemoControlPanel />
                        </div>

                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <Button
                                variant="secondary"
                                onClick={handleLogout}
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        ) : (
                            <Link href={`/login${redirectParam}`}>
                                <Button variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center space-x-2">
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Login</span>
                                </Button>
                            </Link>
                        )}

                        {/* Report Closure Button - Only show when authenticated */}
                        {isAuthenticated && (
                            <Button
                                variant={isFormOpen ? "destructive" : "default"}
                                onClick={onToggleForm}
                                className={`flex items-center space-x-2 ${isFormOpen ? "bg-red-100 text-red-700 hover:bg-red-200" : ""}`}
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
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-gray-500">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;