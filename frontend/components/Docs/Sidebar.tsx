"use client"
import React, { useState } from 'react';
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
    Monitor
} from 'lucide-react';

// Sidebar Component
const DocsSidebar = ({ isOpen, activeSection, onSectionChange }: {
    isOpen: boolean,
    activeSection: string,
    onSectionChange: (section: string) => void
}) => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        'backend-api': true,
        'frontend-guide': true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const sidebarItems = [
        { id: 'introduction', label: 'Introduction', icon: Home, disabled: false },
        { id: 'getting-started', label: 'Getting Started', icon: Zap, disabled: false },
        {
            id: 'backend-api',
            label: 'Backend API',
            icon: Server,
            expandable: true,
            disabled: false,
            children: [
                { id: 'authentication', label: 'Authentication' },
                { id: 'closures', label: 'Closures' },
                { id: 'users', label: 'Users' },
                { id: 'openlr', label: 'OpenLR' },
                { id: 'health', label: 'Health Check' }
            ]
        },
        {
            id: 'frontend-guide',
            label: 'Frontend Application',
            icon: Monitor,
            expandable: true,
            disabled: false,
            children: [
                { id: 'frontend-intro', label: 'Introduction' },
                { id: 'frontend-usage', label: 'Usage Guide' },
                { id: 'frontend-setup', label: 'Local Setup' },
                { id: 'frontend-features', label: 'Features' },
                { id: 'frontend-architecture', label: 'Architecture' }
            ]
        },
        {
            id: 'closure-routing',
            label: 'Closure Aware Routing',
            icon: Globe,
            expandable: true,
            disabled: true,
            children: [
                { id: 'closure-routing-intro', label: 'Introduction' },
                { id: 'closure-routing-usage', label: 'Usage Guide' },
                { id: 'closure-routing-modes', label: 'Transportation Modes' },
                { id: 'closure-routing-technical', label: 'Technical Architecture' }
            ]
        },
        { id: 'deployment', label: 'Deployment', icon: Wrench, disabled: false },
        { id: 'contribute', label: 'Contribute', icon: Users, disabled: false },
        { id: 'acknowledgements', label: 'Acknowledgements', icon: Heart, disabled: false }
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => { }}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="p-6">
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isExpanded = expandedSections[item.id];
                            const isActive = activeSection === item.id;

                            if (item.expandable) {
                                return (
                                    <div key={item.id}>
                                        <button
                                            onClick={() => toggleSection(item.id)}
                                            className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                                            disabled={item.disabled}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                                {item.disabled && (
                                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                        Soon
                                                    </span>
                                                )}
                                            </div>
                                            {!item.disabled && (
                                                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                            )}
                                        </button>

                                        {isExpanded && item.children && !item.disabled && (
                                            <div className="ml-6 mt-2 space-y-1">
                                                {item.children.map((child) => (
                                                    <button
                                                        key={child.id}
                                                        onClick={() => onSectionChange(child.id)}
                                                        className={`
                              w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                              ${activeSection === child.id
                                                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }
                            `}
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
                                    className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                    disabled={item.disabled}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                    {item.disabled && (
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-auto">
                                            Soon
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}

export default DocsSidebar;