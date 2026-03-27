"use client"

import React, { useMemo } from 'react';
import { Activity, AlertCircle, BarChart3, CheckCircle, Clock } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useClosures } from '@/context/ClosuresContext';
import DemoControlPanel from '@/components/Demo/DemoControlPanel';

export default function DashboardPage() {
  const { state } = useClosures();
  const { closures } = state;

  const localStats = useMemo(() => {
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

    const byReasonMap = closures.reduce((acc, closure) => {
      const reason = closure.closure_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byReasonColors = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#0891b2"];
    const reasonData = Object.entries(byReasonMap)
      .map(([name, value], i) => ({ name, value, fill: byReasonColors[i % byReasonColors.length] }))
      .sort((a, b) => b.value - a.value);

    const severityMap = closures.reduce((acc, closure) => {
      const sev = closure.status || 'inactive';
      acc[sev] = (acc[sev] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityData = Object.entries(severityMap).map(([name, value]) => ({ name, value }));

    return {
      total: closures.length,
      active,
      upcoming,
      expired,
      reasonData,
      severityData
    };
  }, [closures]);

  const recentClosures = useMemo(() => {
    return [...closures]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 7);
  }, [closures]);

  return (
    <div className="flex flex-col min-h-full bg-gray-50/50 pb-20 md:pb-0">
      {/* Header */}
      <header className="hidden md:flex h-16 items-center gap-4 border-b bg-white px-6 w-full shrink-0">
        <div className="md:hidden">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <DemoControlPanel />
          </div>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          </div>

          {/* KPI Cards row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Closures</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{localStats.total}</div>
                <p className="text-xs text-muted-foreground">All closures recorded</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{localStats.active}</div>
                <p className="text-xs text-muted-foreground">Affecting current navigation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{localStats.upcoming}</div>
                <p className="text-xs text-muted-foreground">Planned future closures</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{localStats.expired}</div>
                <p className="text-xs text-muted-foreground">Historical records</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Recent Activity Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Chart: Closures by Reason */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Closures by Reason</CardTitle>
                <CardDescription>Top reasons for road closures</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer 
                  className="h-[350px] w-full outline-none focus:outline-none focus-visible:outline-none [&_*:focus]:outline-none [&_*:focus-visible]:!outline-none [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none"
                  config={{ 
                    value: { label: "Count", color: "#2563eb" } 
                  }}
                >
                  <BarChart data={localStats.reasonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} className="focus:outline-none">
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} activeBar={false} style={{ outline: 'none' }} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Closures list mimicking 'Recent Sales' */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  The latest {recentClosures.length} road closures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentClosures.map((closure) => {
                    const isActive = new Date() >= new Date(closure.start_time) && new Date() <= new Date(closure.end_time);
                    return (
                      <div key={closure.id} className="flex items-center">
                        <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <AlertCircle className={`h-5 w-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-semibold leading-none line-clamp-1">{closure.description || 'No description'}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {closure.closure_type.replace('_', ' ')} • {new Date(closure.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isActive ? 'border-transparent bg-red-500 text-white shadow hover:bg-red-500/80' : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* OpenLR Statistics Card */}
            <Card className="lg:col-span-7 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle>OpenLR Integration</CardTitle>
                <CardDescription>Format used for map-agnostic location referencing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-around items-center p-4">
                  <div className="text-center mb-4 md:mb-0">
                    <div className="text-4xl font-bold text-purple-600">
                      {closures.filter(c => c.openlr_code).length}
                    </div>
                    <div className="text-sm font-medium text-purple-900 mt-1">Segments encoded with OpenLR</div>
                  </div>
                  <div className="hidden md:block h-16 w-px bg-purple-200"></div>
                  <div className="text-center mb-4 md:mb-0">
                    <div className="text-4xl font-bold text-blue-600">
                      {Math.round((closures.filter(c => c.openlr_code).length / Math.max(closures.length, 1)) * 100)}%
                    </div>
                    <div className="text-sm font-medium text-blue-900 mt-1">Total Coverage Rate</div>
                  </div>
                  <div className="hidden md:block h-16 w-px bg-purple-200"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {closures.filter(c => c.geometry.type === 'LineString').length}
                    </div>
                    <div className="text-sm font-medium text-green-900 mt-1">Road Alignments Mapped</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
