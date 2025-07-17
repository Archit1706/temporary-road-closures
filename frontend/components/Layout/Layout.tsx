"use client"
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    onToggleForm: () => void;
    isFormOpen: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onToggleForm, isFormOpen }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                {/* Left Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content - Adjust right margin when form is open */}
                <main className={`
                    flex-1 relative transition-all duration-300 ease-in-out
                    ${isFormOpen ? 'mr-96' : 'mr-0'}
                `}>
                    {children}

                    {/* Sidebar Toggle Button for Mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden fixed top-20 left-4 z-30 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Form Toggle Hint - Show when form is closed and user is authenticated */}
                    {!isFormOpen && (
                        <div className="hidden md:block absolute top-4 right-4 z-20">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg max-w-xs">
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">💡 Tip</p>
                                    <p>Use the "Report Closure" button in the header to add new road closures.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Layout;