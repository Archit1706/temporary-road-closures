"use client"
import React, { useState } from 'react';
import DocsHeader from '@/components/Docs/Header';
import DocsSidebar from '@/components/Docs/Sidebar';
import DocsContent from '@/components/Docs/Content';
import { MobileResponsiveStack } from '@/components/Layout/MobileResponsiveStack';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen } from 'lucide-react';

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isMobile = useIsMobile();

    const renderDocsHeader = () => (
        <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-gray-100 bg-white">
            <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">API Documentation</h2>
                <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-2">
                    Technical Reference Guide
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen overflow-hidden bg-white">
            {/* Top bar — hidden on mobile as we'll use stack header */}
            <div className="hidden md:block">
                <DocsHeader
                    onToggleSidebar={() => {}}
                    isSidebarOpen={false}
                />
            </div>

            {/* Body: docs sidebar + content */}
            <div className="flex flex-1 overflow-hidden relative">
                {!isMobile && (
                    <DocsSidebar
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                )}
                
                <main className="flex-1 flex flex-col overflow-hidden">
                    <DocsContent activeSection={activeSection} />
                </main>

                {isMobile && (
                    <MobileResponsiveStack
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        header={renderDocsHeader()}
                        peekHeight="h-[260px]"
                        midHeight="h-[50vh]"
                        fullHeight="h-[80vh]"
                    >
                        <DocsSidebar 
                            activeSection={activeSection} 
                            onSectionChange={(section) => {
                                setActiveSection(section);
                            }}
                            isMobile={true}
                        />
                    </MobileResponsiveStack>
                )}
            </div>
        </div>
    );
};

export default DocsPage;