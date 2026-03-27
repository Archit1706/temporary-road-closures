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
    isEditFormOpen?: boolean;
    isFormMinimized?: boolean;
    onEditClosure?: (closureId: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    onToggleForm,
    isFormOpen,
    isEditFormOpen = false,
    isFormMinimized = false,
    onEditClosure
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isMobile = useIsMobile();

    // Automatically reopen sidebar when form is closed
    const anyFormOpen = isFormOpen || isEditFormOpen;
    
    React.useEffect(() => {
        if (!anyFormOpen && !isSidebarOpen) {
            setIsSidebarOpen(true);
        }
    }, [anyFormOpen, isSidebarOpen]);

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
            {/* Header - Hidden on mobile, using MobileNav instead */}
            <div className="hidden md:block">
                <Header
                    onToggleForm={onToggleForm}
                    isFormOpen={isFormOpen}
                />
            </div>

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

                 </main>
             </div>
         </div>
    );
};

export default Layout;