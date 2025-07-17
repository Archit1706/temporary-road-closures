import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, RotateCcw, Info, LogIn, Shield, AlertTriangle } from 'lucide-react';
import { closuresApi, authApi } from '@/services/api';
import { useClosures } from '@/context/ClosuresContext';
import toast from 'react-hot-toast';

interface DemoControlPanelProps {
    className?: string;
}

const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ className = '' }) => {
    const { state } = useClosures();
    const { isAuthenticated } = state;
    const [apiStatus, setApiStatus] = useState(closuresApi.getApiStatus());
    const [isResetting, setIsResetting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component only shows client-side data
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        // Update status periodically
        const interval = setInterval(() => {
            setApiStatus(closuresApi.getApiStatus());
        }, 5000);

        return () => clearInterval(interval);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted) return;

        // Update status when authentication changes
        setApiStatus(closuresApi.getApiStatus());
    }, [isAuthenticated, isMounted]);

    // Don't render until mounted to avoid hydration mismatch
    if (!isMounted) {
        return null;
    }

    const handleResetData = async () => {
        if (!apiStatus.usingMock) {
            toast.error('Reset is only available in demo mode');
            return;
        }

        setIsResetting(true);
        try {
            await closuresApi.resetMockData();
            toast.success('Demo data has been reset to initial state');
            // Trigger a refresh of the closures
            window.location.reload();
        } catch (error) {
            toast.error('Failed to reset demo data');
        } finally {
            setIsResetting(false);
        }
    };

    const getConnectionStatus = () => {
        if (isAuthenticated && !apiStatus.usingMock) {
            return {
                icon: Shield,
                text: 'Backend API',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-200'
            };
        } else if (apiStatus.backendAvailable && !isAuthenticated) {
            return {
                icon: LogIn,
                text: 'Login Required',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
                borderColor: 'border-blue-200'
            };
        } else if (apiStatus.usingMock) {
            return {
                icon: Database,
                text: 'Demo Mode',
                color: 'text-orange-600',
                bgColor: 'bg-orange-100',
                borderColor: 'border-orange-200'
            };
        } else {
            return {
                icon: AlertTriangle,
                text: 'Offline',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-200'
            };
        }
    };

    const connectionStatus = getConnectionStatus();

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            {/* Collapsed state - just the indicator */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`
                        flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm
                        ${connectionStatus.bgColor} ${connectionStatus.color} border ${connectionStatus.borderColor}
                        hover:shadow-xl transition-all duration-200
                    `}
                >
                    <connectionStatus.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {connectionStatus.text}
                    </span>
                </button>
            )}

            {/* Expanded state - full panel */}
            {isExpanded && (
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[320px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            <h3 className="text-sm font-semibold text-gray-900">System Status</h3>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            ×
                        </button>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-3">
                        {/* Authentication Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Authentication:</span>
                            <div className="flex items-center space-x-1">
                                {isAuthenticated ? (
                                    <>
                                        <Shield className="w-3 h-3 text-green-500" />
                                        <span className="text-sm text-green-600">Authenticated</span>
                                    </>
                                ) : authApi.getToken() ? (
                                    <>
                                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                                        <span className="text-sm text-orange-600">Token Expired</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-3 h-3 text-gray-500" />
                                        <span className="text-sm text-gray-600">Not Logged In</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Connection:</span>
                            <div className="flex items-center space-x-1">
                                {apiStatus.backendAvailable === null ? (
                                    <>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-yellow-600">Checking...</span>
                                    </>
                                ) : apiStatus.backendAvailable ? (
                                    <>
                                        <Wifi className="w-3 h-3 text-green-500" />
                                        <span className="text-sm text-green-600">Backend Available</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-3 h-3 text-red-500" />
                                        <span className="text-sm text-red-600">Backend Offline</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Data Source */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Data Source:</span>
                            <div className="flex items-center space-x-1">
                                {apiStatus.usingMock ? (
                                    <>
                                        <Database className="w-3 h-3 text-orange-500" />
                                        <span className="text-sm text-orange-600">Mock Data</span>
                                    </>
                                ) : (
                                    <>
                                        <Wifi className="w-3 h-3 text-blue-500" />
                                        <span className="text-sm text-blue-600">Live API</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Backend URL */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Backend:</span>
                            <span className="text-xs text-gray-500 font-mono max-w-[140px] truncate">
                                {apiStatus.backendUrl}
                            </span>
                        </div>

                        {/* Backend Integration Notice */}
                        {isAuthenticated && !apiStatus.usingMock && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-3">
                                <div className="flex items-start space-x-2">
                                    <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-green-700">
                                        <p className="font-medium mb-1">Backend Connected</p>
                                        <p>Using live FastAPI backend with PostgreSQL/PostGIS database. All closures are saved persistently with OpenLR encoding.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Demo Mode Notice */}
                        {apiStatus.usingMock && (
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-3">
                                <div className="flex items-start space-x-2">
                                    <Database className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-orange-700">
                                        <p className="font-medium mb-1">Demo Mode Active</p>
                                        <p>Using sample data with 25+ closures in Chicago area. {isAuthenticated ? 'Login to backend for live data.' : 'All changes are temporary and reset on page refresh.'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Required Notice */}
                        {apiStatus.backendAvailable && !isAuthenticated && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                                <div className="flex items-start space-x-2">
                                    <LogIn className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-blue-700">
                                        <p className="font-medium mb-1">Backend Available</p>
                                        <p>Backend API is running but authentication is required. Click Login in the header to connect.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {apiStatus.usingMock && (
                            <div className="pt-3 border-t border-gray-200">
                                <button
                                    onClick={handleResetData}
                                    disabled={isResetting}
                                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
                                    <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
                                </button>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>• Create new closures using the form</p>
                                <p>• Click closures on map for details</p>
                                <p>• Select multiple points for LineString</p>
                                {!isAuthenticated && <p>• Login for persistent storage</p>}
                                {apiStatus.usingMock && (
                                    <p className="text-orange-600">• Demo changes reset on refresh</p>
                                )}
                            </div>
                        </div>

                        {/* API Endpoints Info */}
                        {isAuthenticated && (
                            <div className="pt-3 border-t border-gray-200">
                                <div className="text-xs text-gray-500">
                                    <p className="font-medium mb-1">API Endpoints:</p>
                                    <div className="space-y-1 font-mono">
                                        <p>GET /api/v1/closures/</p>
                                        <p>POST /api/v1/closures/</p>
                                        <p>PUT /api/v1/closures/:id</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoControlPanel;