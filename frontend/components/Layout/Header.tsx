import React from 'react';
import Link from 'next/link';
import { useClosures } from '@/context/ClosuresContext';
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
                            <div className="h-4 w-px bg-border"></div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50 transition-all hover:bg-muted">
                                <div className={`w-1.5 h-1.5 rounded-full ${getLocationDotColor()}`}></div>
                                <span className="text-[11px] font-black uppercase tracking-tight text-muted-foreground">
                                    {getLocationLabel()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;