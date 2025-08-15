"use client"
import React, { useState } from 'react';
import DocsHeader from '@/components/Docs/Header';
import DocsSidebar from '@/components/Docs/Sidebar';
import DocsContent from '@/components/Docs/Content';

// Main Documentation Page
const DocsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('introduction');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DocsHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div className="flex">
                <DocsSidebar
                    isOpen={isSidebarOpen}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />

                <DocsContent activeSection={activeSection} />
            </div>
        </div>
    );
};

export default DocsPage;