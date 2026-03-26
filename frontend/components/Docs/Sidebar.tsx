"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Server,
    Users,
    MapPin,
    Zap,
    Home,
    Wrench,
    Heart,
    Globe,
    Monitor,
    BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DocsSidebar = ({ activeSection, onSectionChange }: {
    activeSection: string;
    onSectionChange: (section: string) => void;
}) => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        'backend-api': true,
        'frontend-guide': false,
        'closure-routing': false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const navRef = useRef<HTMLElement>(null);
    const [markerPos, setMarkerPos] = useState({ top: 0, height: 0, left: 0, width: 0 });

    useEffect(() => {
        // Delay calculation slightly to allow DOM to update after expansion
        const timer = setTimeout(() => {
            if (!navRef.current) return;
            const activeItem = navRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                const el = activeItem as HTMLElement;
                const navRect = navRef.current.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                
                setMarkerPos({
                    top: elRect.top - navRect.top + navRef.current.scrollTop,
                    height: elRect.height,
                    left: elRect.left - navRect.left,
                    width: elRect.width
                });
            } else {
                setMarkerPos({ top: 0, height: 0, left: 0, width: 0 });
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [activeSection, expandedSections]);

    const sidebarItems = [
        { id: 'introduction', label: 'Introduction', icon: Home },
        { id: 'getting-started', label: 'Getting Started', icon: Zap },
        {
            id: 'backend-api',
            label: 'Backend API',
            icon: Server,
            expandable: true,
            children: [
                { id: 'authentication', label: 'Authentication' },
                { id: 'closures', label: 'Closures' },
                { id: 'users', label: 'Users' },
                { id: 'openlr', label: 'OpenLR' },
                { id: 'health', label: 'Health Check' },
            ],
        },
        {
            id: 'frontend-guide',
            label: 'Frontend',
            icon: Monitor,
            expandable: true,
            children: [
                { id: 'frontend-intro', label: 'Introduction' },
                { id: 'frontend-usage', label: 'Usage Guide' },
                { id: 'frontend-setup', label: 'Local Setup' },
                { id: 'frontend-features', label: 'Features' },
                { id: 'frontend-architecture', label: 'Architecture' },
            ],
        },
        {
            id: 'closure-routing',
            label: 'Closure Routing',
            icon: Globe,
            expandable: true,
            children: [
                { id: 'closure-routing-intro', label: 'Introduction' },
                { id: 'closure-routing-usage', label: 'Usage Guide' },
                { id: 'closure-routing-modes', label: 'Transport Modes' },
                { id: 'closure-routing-technical', label: 'Architecture' },
            ],
        },
        { id: 'deployment', label: 'Deployment', icon: Wrench },
        { id: 'contribute', label: 'Contribute', icon: Users },
        { id: 'acknowledgements', label: 'Acknowledgements', icon: Heart },
    ];

    return (
        <aside className="w-56 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-gray-100 bg-white">
            <div className="px-5 pt-4 pb-2">
                <div className="flex items-center gap-2.5 px-0.5 mb-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-gray-900 tracking-tight">API Reference</span>
                        <span className="text-[10px] text-gray-500 font-medium tracking-tight">Technical Docs</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav ref={navRef} className="px-3 pb-6 space-y-0.5 relative">
                {/* Sliding Highlight */}
                {markerPos.height > 0 && (
                    <div 
                        className="absolute bg-gray-900 rounded-lg transition-all duration-300 ease-in-out z-0 pointer-events-none shadow-sm"
                        style={{
                            top: markerPos.top,
                            height: markerPos.height,
                            left: markerPos.left,
                            width: markerPos.width,
                        }}
                    />
                )}
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isExpanded = expandedSections[item.id];
                    const isActive = activeSection === item.id;

                    if (item.expandable && item.children) {
                        const isChildActive = item.children.some(c => c.id === activeSection);
                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => toggleSection(item.id)}
                                    data-active={isActive}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative z-10",
                                        isActive
                                            ? "!text-white !bg-transparent hover:!text-white"
                                            : isChildActive
                                                ? "text-gray-900 bg-gray-100/50 hover:bg-gray-100/50 font-bold"
                                                : "text-gray-600 hover:text-gray-600 hover:bg-transparent"
                                    )}
                                >
                                    <span className="text-[14px]">{item.label}</span>
                                    {isExpanded
                                        ? <ChevronDown className="w-3 h-3 opacity-50" />
                                        : <ChevronRight className="w-3 h-3 opacity-50" />
                                    }
                                </button>

                                {isExpanded && (
                                    <div className="ml-5 mt-0.5 mb-1 border-l border-gray-100 pl-3 space-y-0.5">
                                        {item.children.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => onSectionChange(child.id)}
                                                data-active={activeSection === child.id}
                                                className={cn(
                                                    "w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-all duration-150 relative z-10 font-medium",
                                                    activeSection === child.id
                                                        ? "!text-white !bg-transparent hover:!text-white shadow-none"
                                                        : "text-gray-500 hover:text-gray-500 hover:bg-transparent"
                                                )}
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            data-active={isActive}
                            className={cn(
                                "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative z-10",
                                isActive
                                    ? "!text-white !bg-transparent hover:!text-white shadow-none"
                                    : "text-gray-600 hover:text-gray-600 hover:bg-transparent"
                            )}
                        >
                            <span className="text-[14px]">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default DocsSidebar;