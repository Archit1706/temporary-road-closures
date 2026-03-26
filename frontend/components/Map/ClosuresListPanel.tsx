"use client"
import React from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Zap, Building2, Navigation, Edit3, Trash2, Target, Route as RouteIcon, TriangleAlert } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { useClosures } from '@/context/ClosuresContext';
import { Closure } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClosuresListPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onEditClosure?: (closureId: number) => void;
}

const ClosuresListPanel: React.FC<ClosuresListPanelProps> = ({ isOpen, onClose, onEditClosure }) => {
    const { state, selectClosure, startEditingClosure, canEditClosure, deleteClosure } = useClosures();
    const { closures, selectedClosure, loading, isAuthenticated, user } = state;
    const isMobile = useIsMobile();

    const getClosureStatus = (closure: Closure): 'active' | 'upcoming' | 'expired' => {
        const now = new Date();
        const startTime = new Date(closure.start_time);
        const endTime = new Date(closure.end_time);

        if (isBefore(now, startTime)) return 'upcoming';
        if (isAfter(now, endTime)) return 'expired';
        return 'active';
    };

    const getConfidenceColor = (level: number) => {
        if (level >= 8) return 'text-green-600';
        if (level >= 6) return 'text-blue-600';
        if (level >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDuration = (hours: number) => {
        if (hours < 1) return `${Math.round(hours * 60)}m`;
        if (hours < 24) return `${Math.round(hours)}h`;
        return `${Math.round(hours / 24)}d`;
    };

    const getGeometryIcon = (closure: Closure) => {
        if (closure.geometry.type === 'Point') {
            return Target;
        }
        return RouteIcon;
    };

    const getGeometryLabel = (closure: Closure) => {
        if (closure.geometry.type === 'Point') {
            return 'Point closure';
        }
        if (closure.is_bidirectional) return 'Bidirectional';
        return 'Unidirectional';
    };

    const getDirectionIcon = (closure: Closure) => {
        if (closure.geometry.type === 'Point') return '📍';
        if (closure.is_bidirectional) return '↔️';
        return '→';
    };

    const handleClosureClick = (closure: Closure) => {
        selectClosure(closure);
        if (isMobile) {
            onClose();
        }
    };

    const handleEditClick = async (e: React.MouseEvent, closureId: number) => {
        e.stopPropagation();

        try {
            await startEditingClosure(closureId);
            if (onEditClosure) {
                onEditClosure(closureId);
            }
        } catch (error) {
            console.error('Failed to start editing closure:', error);
        }
    };

    const handleDeleteClick = async (e: React.MouseEvent, closureId: number, description: string) => {
        e.stopPropagation();

        const confirmed = window.confirm(
            `Are you sure you want to delete this closure?\n\n"${description}"\n\nThis action cannot be undone.`
        );

        if (confirmed) {
            try {
                await deleteClosure(closureId);
            } catch (error) {
                console.error('Failed to delete closure:', error);
            }
        }
    };

    const activeClosures = closures.filter(c => getClosureStatus(c) === 'active').length;
    const upcomingClosures = closures.filter(c => getClosureStatus(c) === 'upcoming').length;
    const expiredClosures = closures.filter(c => getClosureStatus(c) === 'expired').length;

    // Calculate geometry statistics
    const pointClosures = closures.filter(c => c.geometry.type === 'Point').length;
    const lineStringClosures = closures.filter(c => c.geometry.type === 'LineString');
    const bidirectionalClosures = lineStringClosures.filter(c => c.is_bidirectional === true).length;
    const unidirectionalClosures = lineStringClosures.filter(c => c.is_bidirectional === false).length;

    // Shared header content
    const renderHeader = () => (
        <div className="p-4 space-y-4 shrink-0">
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Road Closures
                </h2>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] py-0 rounded-full px-2">
                        {closures.length} TOTAL
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                        Real-time reporting
                    </span>
                </div>
            </div>

            {isAuthenticated && (
                <Button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('toggle-closure-form'));
                        if (isMobile) onClose();
                    }}
                    className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold uppercase tracking-tighter h-11 transition-all shadow-none rounded-full"
                >
                    <TriangleAlert className="w-4 h-4" />
                    <span>Report Closure</span>
                </Button>
            )}

            {/* Status Summary Grid */}
            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-destructive/10 border border-destructive/20 transition-all hover:bg-destructive/20">
                    <span className="text-base font-bold text-destructive leading-none">{activeClosures}</span>
                    <span className="text-[9px] font-bold uppercase text-destructive/70 mt-0.5 tracking-tighter">Active</span>
                </div>
                <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 transition-all hover:bg-amber-500/20">
                    <span className="text-base font-bold text-amber-600 leading-none">{upcomingClosures}</span>
                    <span className="text-[9px] font-bold uppercase text-amber-600/70 mt-0.5 tracking-tighter">Soon</span>
                </div>
                <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-muted border border-border transition-all hover:bg-muted/80">
                    <span className="text-base font-bold text-muted-foreground leading-none">{expiredClosures}</span>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground mt-0.5 tracking-tighter">Old</span>
                </div>
            </div>

            {/* Geography Type Statistics Cards */}
            {(pointClosures > 0 || lineStringClosures.length > 0) && (
                <div className="p-2.5 rounded-md bg-primary/5 border border-primary/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="font-bold text-primary text-[10px] uppercase tracking-tighter">Geometry Types</span>
                        </div>
                        <div className="flex gap-2 text-muted-foreground font-bold font-mono">
                            {pointClosures > 0 && (
                                <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3 text-orange-500" />
                                    <span>{pointClosures}</span>
                                </div>
                            )}
                            {lineStringClosures.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <RouteIcon className="w-3 h-3 text-primary" />
                                    <span>{lineStringClosures.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {lineStringClosures.length > 0 && (
                        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-primary/10">
                            <div className="flex items-center gap-1.5">
                                <Navigation className="w-3 h-3 text-primary" />
                                <span className="font-bold text-primary text-[10px] uppercase tracking-tighter">Direction Info</span>
                            </div>
                            <div className="flex gap-2 text-muted-foreground font-bold font-mono">
                                <span>↔ {bidirectionalClosures}</span>
                                <span>→ {unidirectionalClosures}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isAuthenticated && (
                <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-900 py-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-[11px] font-bold uppercase tracking-tight">Demo Mode Active</span>
                    </div>
                </Alert>
            )}
        </div>
    );

    // Shared closures list content
    const renderClosuresList = () => (
        <div className="flex-1 min-h-0">
            <ScrollArea className="h-full px-4 py-2">
                {loading ? (
                    <div className="space-y-3 py-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                ) : closures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="p-4 bg-muted rounded-full">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-muted-foreground">Clear Skies</p>
                            <p className="text-xs text-muted-foreground/60 max-w-[180px]">
                                No road closures reported in this area.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1.5 pb-8">
                        {closures.map((closure, index) => {
                            const status = getClosureStatus(closure);
                            const isSelected = selectedClosure?.id === closure.id;
                            const directionIcon = getDirectionIcon(closure);
                            const geometryLabel = getGeometryLabel(closure);
                            const canEdit = canEditClosure(closure);
                            const GeometryIcon = getGeometryIcon(closure);
                            const isLast = index === closures.length - 1;

                            return (
                                <React.Fragment key={closure.id}>
                                    <Card
                                        onClick={() => handleClosureClick(closure)}
                                        className={`
                                            cursor-pointer transition-all duration-200 group overflow-hidden rounded-lg outline-none ring-0 py-0 shadow-none border-2
                                            ${isSelected
                                                ? 'border-blue-600 bg-transparent'
                                                : 'border-border/50 hover:border-muted-foreground/30'
                                            }
                                        `}
                                    >
                                        <CardContent className="p-4">
                                            {/* Header with Status and Actions */}
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge 
                                                    variant={status === 'active' ? 'destructive' : status === 'upcoming' ? 'secondary' : 'outline'}
                                                    className={`uppercase tracking-tighter text-[10px] font-bold ${status === 'upcoming' ? 'bg-amber-500 text-white hover:bg-amber-600 border-none' : ''}`}
                                                >
                                                    {status}
                                                </Badge>
                                                
                                                <div className="flex items-center gap-2">
                                                    {isAuthenticated && canEdit && (
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => handleEditClick(e, closure.id)}
                                                                className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                                                            >
                                                                <Edit3 className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => handleDeleteClick(e, closure.id, closure.description)}
                                                                className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-1">
                                                        <Zap className="w-3 h-3 text-muted-foreground" />
                                                        <span className={`text-xs font-medium ${getConfidenceColor(closure.confidence_level)}`}>
                                                            {closure.confidence_level}/10
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDuration(closure.duration_hours)}
                                                    </span>
                                                    {canEdit && (
                                                        <div title="You can edit this closure">
                                                            <Edit3 className="w-3 h-3 text-green-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <h3 className="text-sm font-bold text-foreground leading-tight mb-3 line-clamp-2">
                                                {closure.description}
                                            </h3>

                                            {/* Meta Info Grid */}
                                            <div className="grid grid-cols-2 gap-y-2 text-[10px] items-center">
                                                <div className="flex items-center gap-1.5 text-muted-foreground font-bold uppercase tracking-tighter">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                                    <span>{closure.closure_type.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 justify-end text-muted-foreground">
                                                    <GeometryIcon className={`w-3 h-3 ${closure.geometry.type === 'Point' ? 'text-orange-600' : 'text-primary'}`} />
                                                    <span className="text-sm" title={geometryLabel}>{directionIcon}</span>
                                                    <span className="text-xs">
                                                        {closure.geometry.type === 'Point' ? 'Point' :
                                                            closure.is_bidirectional ? 'Both ways' : 'One way'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Timing & Details */}
                                            <div className="mt-3 pt-3 border-t border-border/50 space-y-1 text-xs text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {format(new Date(closure.start_time), 'MMM dd, HH:mm')} -
                                                        {format(new Date(closure.end_time), 'MMM dd, HH:mm')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <Building2 className="w-3 h-3" />
                                                    <span>Source: {closure.source}</span>
                                                </div>

                                                {closure.openlr_code && (
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="font-mono text-xs">
                                                            OpenLR: {closure.openlr_code.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Geometry information */}
                                                <div className="flex items-center space-x-1">
                                                    <GeometryIcon className="w-3 h-3" />
                                                    <span className="text-xs">
                                                        {closure.geometry.type === 'Point' ? 'Point closure' :
                                                            closure.is_bidirectional
                                                                ? 'Bidirectional road segment'
                                                                : 'Unidirectional road segment'}
                                                    </span>
                                                </div>

                                                {/* Submitter info */}
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-3 h-3" />
                                                    <span className="text-xs">ID: #{closure.id}</span>
                                                    {canEdit && (
                                                        <span className="text-green-600 font-medium ml-1">(Your closure)</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Validation Status */}
                                            {!closure.is_valid && (
                                                <div className="mt-2 flex items-center space-x-1">
                                                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                                                    <span className="text-xs text-yellow-600 font-medium">Validation pending</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    {!isLast && (
                                        <div className="py-0">
                                            <Separator className="opacity-10" />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </div>
    );

    // Shared footer content
    const renderFooter = () => (
        <div className={`${isMobile ? 'px-4 py-3' : 'h-[81px] px-4'} border-t border-border bg-muted/30 shrink-0 flex flex-col justify-center`}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span className={isAuthenticated ? "text-green-600" : "text-amber-600"}>
                        {isAuthenticated ? "● API Connected" : "⚠ Demo Mode"}
                    </span>
                    <span className="text-muted-foreground/60">
                        {pointClosures > 0 && `📍 ${pointClosures} points`}
                        {pointClosures > 0 && lineStringClosures.length > 0 && ' • '}
                        {lineStringClosures.length > 0 && `🛣️ ${lineStringClosures.length} segments`}
                        {lineStringClosures.length > 0 && (
                            <span className="ml-1 text-[8px]">
                                (↔ {bidirectionalClosures} • → {unidirectionalClosures})
                            </span>
                        )}
                    </span>
                </div>
                {isAuthenticated && !isMobile && (
                    <div className="text-[10px] text-muted-foreground/70 text-left uppercase tracking-tighter font-bold">
                        Right-click map or hover items to manage reports
                    </div>
                )}
            </div>
        </div>
    );

    // --- MOBILE: Bottom Sheet ---
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <SheetContent side="bottom" className="max-h-[75vh] flex flex-col p-0 rounded-t-2xl" showCloseButton={false}>
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                    <SheetTitle className="sr-only">Road Closures</SheetTitle>
                    <SheetDescription className="sr-only">List of road closures</SheetDescription>
                    {renderHeader()}
                    <Separator className="opacity-50" />
                    {renderClosuresList()}
                    {renderFooter()}
                </SheetContent>
            </Sheet>
        );
    }

    // --- DESKTOP: Sidebar ---
    return (
        <div className={`
            fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-background shadow-2xl transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:top-0 md:h-full md:translate-x-0 md:shadow-none md:border-r md:border-border flex flex-col overflow-hidden
        `}>
            {renderHeader()}
            <Separator className="opacity-50" />
            {renderClosuresList()}
            {renderFooter()}
        </div>
    );
};

export default ClosuresListPanel;