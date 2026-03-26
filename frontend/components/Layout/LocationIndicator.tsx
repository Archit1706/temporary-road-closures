"use client"
import React from 'react';
import { useLocationStatus } from '@/context/LocationContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationIndicatorProps {
    className?: string;
    showTooltip?: boolean;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ className, showTooltip = true }) => {
    const { status: locationStatus } = useLocationStatus();

    const getLocationLabel = () => {
        if (locationStatus.loading) return 'Locating...';
        if (locationStatus.usingGeolocation) return 'Your Location';
        if (locationStatus.error) return 'Default Location';
        return 'Map Centered';
    };

    const getLocationDotColor = () => {
        if (locationStatus.loading) return 'bg-blue-400 animate-pulse';
        if (locationStatus.usingGeolocation) return 'bg-green-500';
        if (locationStatus.error) return 'bg-orange-500';
        return 'bg-blue-500';
    };

    const content = (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full cursor-help group transition-colors hover:bg-white shadow-sm",
            className
        )}>
            <div className={cn("w-2 h-2 rounded-full ring-2 ring-white shadow-sm", getLocationDotColor())} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                {getLocationLabel()}
            </span>
        </div>
    );

    if (!showTooltip) return content;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {content}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">Location source for routing operations</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default LocationIndicator;
