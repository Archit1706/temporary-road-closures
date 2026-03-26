import React from 'react';
import Link from 'next/link';
import { useClosures } from '@/context/ClosuresContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocationStatus } from '@/context/LocationContext';
import dynamic from 'next/dynamic';
import LocationIndicator from './LocationIndicator';

const DemoControlPanel = dynamic(() => import('@/components/Demo/DemoControlPanel'), { ssr: false });


interface HeaderProps {
    onToggleForm: () => void;
    isFormOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleForm, isFormOpen }) => {
    const { state, logout } = useClosures();
    const { isAuthenticated, user } = state;
    const { status: locationStatus } = useLocationStatus();

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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Branding & Mobile Trigger */}
                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        {/* Location & Status (Desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <DemoControlPanel />
                            <div className="h-4 w-px bg-border mx-1"></div>
                            <LocationIndicator />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;