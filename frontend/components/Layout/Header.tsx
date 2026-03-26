import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocationStatus } from '@/context/LocationContext';
import dynamic from 'next/dynamic';

const DemoControlPanel = dynamic(() => import('@/components/Demo/DemoControlPanel'), { ssr: false });


interface HeaderProps {
    onToggleForm: () => void;
    isFormOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleForm, isFormOpen }) => {
    const { state, logout } = useClosures();
    const { isAuthenticated, user } = state;
    const { status: locationStatus } = useLocationStatus();

    const getLocationLabel = () => {
        if (locationStatus.loading) return 'Locating...';
        if (locationStatus.usingGeolocation) return 'Your Location';
        if (locationStatus.error) return 'Default Location';
        return 'Map Centered';
    };

    const getLocationDotColor = () => {
        if (locationStatus.loading) return 'bg-blue-400 animate-pulse';
        if (locationStatus.usingGeolocation) return 'bg-green-500';
        if (locationStatus.error) return 'bg-orange-500';
        return 'bg-blue-500';
    };

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
                        {/* Server Status & Location */}
                        <div className="hidden md:flex items-center space-x-3">
                            <DemoControlPanel />
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-1.5 text-sm">
                                <div className={`w-2 h-2 rounded-full ${getLocationDotColor()}`}></div>
                                <span className="text-gray-600 font-medium">{getLocationLabel()}</span>
                            </div>
                        </div>




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