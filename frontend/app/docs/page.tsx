"use client"
import React, { useState } from 'react';
import DocsHeader from '@/components/Docs/Header';
import DocsSidebar from '@/components/Docs/Sidebar';
import DocsContent from '@/components/Docs/Content';

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Top bar — same as before */}
            <DocsHeader
                onToggleSidebar={() => {}}
                isSidebarOpen={false}
            />

            {/* Body: docs sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                <DocsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <DocsContent activeSection={activeSection} />
            </div>
        </div>
    );
};

export default DocsPage;