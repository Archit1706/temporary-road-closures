"use client"
import React from 'react';
import Link from 'next/link';
import {
    Construction,
    Menu,
    X,
    MapPin,
    ExternalLink,
} from 'lucide-react';

// Header Component
const DocsHeader = ({ onToggleSidebar, isSidebarOpen }: { onToggleSidebar: () => void, isSidebarOpen: boolean }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onToggleSidebar}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                                <Construction className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">OSM Road Closures</h1>
                                <p className="text-sm text-gray-500 -mt-1">API Documentation</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/closures"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>Live Demo</span>
                        </Link>
                        <a
                            href="https://github.com/Archit1706/temporary-road-closures"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-500"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DocsHeader;