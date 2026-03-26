"use client"
import React, { useState } from 'react';
import Header from './Header';
import ClosuresListPanel from '../Map/ClosuresListPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    onToggleForm: () => void;
    isFormOpen: boolean;
    isFormMinimized?: boolean;
    onEditClosure?: (closureId: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    onToggleForm,
    isFormOpen,
    isFormMinimized = false,
    onEditClosure
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Determine the right margin for the main content (desktop only)
    const getRightMargin = () => {
        if (isMobile) return 'mr-0';
        if (!isFormOpen) return 'mr-0';
        return isFormMinimized ? 'mr-12' : 'mr-96';
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header
                onToggleForm={onToggleForm}
                isFormOpen={isFormOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar / Bottom Sheet (handled internally by ClosuresListPanel) */}
                <ClosuresListPanel
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onEditClosure={onEditClosure}
                />

                {/* Main Content - Adjust right margin when form is open (desktop only) */}
                <main className={`
                    flex-1 relative transition-all duration-300 ease-in-out
                    ${getRightMargin()}
                `}>
                    {children}

                    {/* Mobile: Floating button to open closures list bottom sheet */}
                    {isMobile && !isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="fixed bottom-6 left-4 z-30 bg-background shadow-lg rounded-full p-3 border border-border hover:bg-accent transition-colors"
                            aria-label="Open closures list"
                        >
                            <MapPin className="w-5 h-5 text-foreground" />
                        </button>
                    )}

                    {/* Desktop: Sidebar Toggle Button for Mobile (legacy, hidden on actual mobile now) */}
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden fixed top-20 left-4 z-30 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Layout;