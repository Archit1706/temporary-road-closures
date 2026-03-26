import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Clock, Activity, Map as MapIcon, Link as LinkIcon } from 'lucide-react';
import { useClosures } from '@/context/ClosuresContext';
import { closuresApi, ClosureStats } from '@/services/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

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
            acc[closure.closure_type] = (acc[closure.closure_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const bySeverity = closures.reduce((acc, closure) => {
            const severity = closure.status || 'inactive';
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

    // Format chart data
    const reasonData = Object.entries(localStats.byReason)
        .sort((a, b) => b[1] - a[1]) // Sort descending
        .map(([reason, count]) => ({
            reason: reason.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            count,
        }));

    const reasonChartConfig: ChartConfig = {
        count: {
            label: "Closures",
            color: "hsl(var(--chart-1))",
        },
    };

    const severityColors: Record<string, string> = {
        low: "hsl(var(--chart-2))",
        medium: "hsl(var(--chart-4))",
        high: "hsl(var(--chart-3))",
        critical: "hsl(var(--chart-5))",
        active: "hsl(var(--chart-1))",
        inactive: "hsl(var(--muted))"
    };

    const severityData = Object.entries(localStats.bySeverity).map(([severity, count]) => ({
        severity: severity.charAt(0).toUpperCase() + severity.slice(1),
        count,
        fill: severityColors[severity.toLowerCase()] || severityColors.inactive,
    }));

    const severityChartConfig: ChartConfig = {
        count: {
            label: "Count",
        },
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl shrink-0 border-b-0 m-0">
                    <div className="flex items-center space-x-3">
                        <BarChart3 className="w-6 h-6 text-white" />
                        <div>
                            <DialogTitle className="text-xl font-semibold text-white">Road Closures Dashboard</DialogTitle>
                            <DialogDescription className="text-blue-100 text-sm m-0">
                                Real-time statistics and insights
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 overflow-y-auto w-full max-h-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 w-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
                                        <CardTitle className="text-sm font-medium">Total Closures</CardTitle>
                                        <Activity className="w-4 h-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{localStats.total}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
                                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{localStats.active}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
                                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                                        <Clock className="w-4 h-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{localStats.upcoming}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
                                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{localStats.expired}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* By Reason Chart */}
                                <Card>
                                    <CardHeader className="border-b-0">
                                        <CardTitle className="text-lg">Closures by Reason</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ChartContainer config={reasonChartConfig} className="w-full h-full outline-none focus:outline-none focus-visible:outline-none [&_*:focus]:outline-none [&_*:focus-visible]:!outline-none [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
                                            <BarChart data={reasonData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, className: 'fill-muted-foreground' }} width={110} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} activeBar={false} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>

                                {/* By Severity Chart */}
                                <Card>
                                    <CardHeader className="border-b-0">
                                        <CardTitle className="text-lg">Closures by Severity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-center h-[300px]">
                                        {severityData.length > 0 ? (
                                            <ChartContainer config={severityChartConfig} className="w-full h-full pb-0 flex items-center justify-center [&_.recharts-pie-label-text]:fill-foreground outline-none focus:outline-none focus-visible:outline-none [&_*:focus]:outline-none [&_*:focus-visible]:!outline-none [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
                                                <PieChart>
                                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                                    <Pie
                                                        data={severityData}
                                                        dataKey="count"
                                                        nameKey="severity"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        innerRadius={60}
                                                        paddingAngle={2}
                                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                        labelLine={false}
                                                    >
                                                        {severityData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ChartContainer>
                                        ) : (
                                            <div className="text-muted-foreground">No severity data available</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Two-Column Bottom Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <Card>
                                    <CardHeader className="border-b-0">
                                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {closures
                                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                                .slice(0, 5)
                                                .map((closure) => {
                                                    const isActive = new Date() >= new Date(closure.start_time) && new Date() <= new Date(closure.end_time);
                                                    return (
                                                        <div key={closure.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl">
                                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-red-500' : 'bg-muted-foreground'}`} />
                                                            <div className="flex-1 truncate">
                                                                <p className="text-sm font-medium truncate">{closure.description}</p>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {closure.closure_type.replace('_', ' ')} &bull; {new Date(closure.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${isActive ? 'bg-red-500/10 text-red-600' : 'bg-muted text-muted-foreground'
                                                                }`}>
                                                                {isActive ? 'Active' : 'Inactive'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System Statistics */}
                                <Card className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-100 dark:border-indigo-900/50">
                                    <CardHeader className="border-b-0 pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5 text-indigo-600" />
                                            System Coverage
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center">
                                                <div className="text-3xl font-bold text-indigo-600">
                                                    {closures.filter(c => c.openlr_code).length}
                                                </div>
                                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">OpenLR Refs</div>
                                            </div>
                                            <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {closures.filter(c => c.geometry.type === 'LineString').length}
                                                </div>
                                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Line Geometries</div>
                                            </div>
                                        </div>
                                        <div className="bg-white/80 dark:bg-black/40 p-4 rounded-xl text-sm text-muted-foreground border border-indigo-50 dark:border-indigo-900/20 leading-relaxed">
                                            Integrated with OpenLR spatial encoding for seamless interoperability across diverse navigation networks and TomTom digital maps.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StatsDashboard;