import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { closuresApi, ClosureStats } from '@/services/api';

interface StatsDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ isOpen, onClose }) => {
    const { state } = useClosures();
    const { closures } = state;
    const [stats, setStats] = useState<ClosureStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStats();
        }
    }, [isOpen]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const statsData = await closuresApi.getClosureStats();
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate local stats from current closures
    const localStats = React.useMemo(() => {
        const now = new Date();
        const active = closures.filter(c => {
            const start = new Date(c.start_time);
            const end = new Date(c.end_time);
            return now >= start && now <= end;
        }).length;

        const upcoming = closures.filter(c => {
            const start = new Date(c.start_time);
            return now < start;
        }).length;

        const expired = closures.filter(c => {
            const end = new Date(c.end_time);
            return now > end;
        }).length;

        const byReason = closures.reduce((acc, closure) => {
            acc[closure.reason] = (acc[closure.reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const bySeverity = closures.reduce((acc, closure) => {
            const severity = closure.severity || 'medium';
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: closures.length,
            active,
            upcoming,
            expired,
            byReason,
            bySeverity,
        };
    }, [closures]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Dashboard Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <BarChart3 className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-semibold">Road Closures Dashboard</h2>
                                <p className="text-blue-100 text-sm">Real-time statistics and insights</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-6rem)]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-600 text-sm font-medium">Total Closures</p>
                                            <p className="text-2xl font-bold text-blue-900">{localStats.total}</p>
                                        </div>
                                        <Activity className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-600 text-sm font-medium">Active Now</p>
                                            <p className="text-2xl font-bold text-red-900">{localStats.active}</p>
                                        </div>
                                        <AlertCircle className="w-8 h-8 text-red-600" />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-yellow-600 text-sm font-medium">Upcoming</p>
                                            <p className="text-2xl font-bold text-yellow-900">{localStats.upcoming}</p>
                                        </div>
                                        <Clock className="w-8 h-8 text-yellow-600" />
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-600 text-sm font-medium">Completed</p>
                                            <p className="text-2xl font-bold text-green-900">{localStats.expired}</p>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* By Reason */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Closures by Reason</h3>
                                    <div className="space-y-3">
                                        {Object.entries(localStats.byReason).map(([reason, count]) => {
                                            const percentage = (count / localStats.total) * 100;
                                            return (
                                                <div key={reason} className="flex items-center space-x-3">
                                                    <div className="w-24 text-sm text-gray-600 capitalize">
                                                        {reason.replace('_', ' ')}
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full" 
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="w-12 text-sm text-gray-900 font-medium">
                                                        {count}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* By Severity */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Closures by Severity</h3>
                                    <div className="space-y-3">
                                        {Object.entries(localStats.bySeverity).map(([severity, count]) => {
                                            const percentage = (count / localStats.total) * 100;
                                            const colors = {
                                                low: 'bg-green-500',
                                                medium: 'bg-yellow-500',
                                                high: 'bg-orange-500',
                                                critical: 'bg-red-500',
                                            };
                                            
                                            return (
                                                <div key={severity} className="flex items-center space-x-3">
                                                    <div className="w-16 text-sm text-gray-600 capitalize">
                                                        {severity}
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`${colors[severity as keyof typeof colors]} h-2 rounded-full`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="w-12 text-sm text-gray-900 font-medium">
                                                        {count}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {closures
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .slice(0, 5)
                                        .map((closure) => {
                                            const isActive = new Date() >= new Date(closure.start_time) && new Date() <= new Date(closure.end_time);
                                            return (
                                                <div key={closure.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-400'}`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{closure.description}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {closure.reason.replace('_', ' ')} • by {closure.submitter} • {new Date(closure.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* OpenLR Statistics (for GSoC project) */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">OpenLR Integration Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {closures.filter(c => c.openlr).length}
                                        </div>
                                        <div className="text-sm text-gray-600">With OpenLR Data</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.round((closures.filter(c => c.openlr).length / Math.max(closures.length, 1)) * 100)}%
                                        </div>
                                        <div className="text-sm text-gray-600">Coverage Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {closures.filter(c => c.geometry.type === 'LineString').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Road Segments</div>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                                    <p className="text-sm text-gray-600">
                                        <strong>OpenLR Integration:</strong> This system uses OpenLR (Open Location Referencing) 
                                        to encode road locations in a map-agnostic format, enabling interoperability with various 
                                        navigation systems and OSM applications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;