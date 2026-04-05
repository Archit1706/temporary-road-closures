"use client";

import React, { useState, useRef, ReactNode } from 'react';
import { cn } from '@/utils/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileResponsiveStackProps {
  isOpen: boolean;
  onClose?: () => void;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  miniHeight?: string; // e.g. "72px"
  peekHeight?: string; // e.g. "260px"
  midHeight?: string;  // e.g. "40vh"
  fullHeight?: string; // e.g. "80vh"
  className?: string;
}

export function MobileResponsiveStack({
  isOpen,
  onClose,
  header,
  children,
  footer,
  miniHeight = "h-[72px]",
  peekHeight = "h-[260px]",
  midHeight = "h-[50vh]",
  fullHeight = "h-[80vh]",
  className,
}: MobileResponsiveStackProps) {
  const isMobile = useIsMobile();
  const [mobileStage, setMobileStage] = useState(1); // 0: Mini, 1: Peek, 2: Mid, 3: Full
  const touchY = useRef<number | null>(null);

  if (!isMobile || !isOpen) return null;

  const toggleExpand = () => {
    setMobileStage((prev) => {
      if (prev === 0) return 1; // From mini to peek
      return (prev + 1) % 4;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const deltaY = touchY.current - e.changedTouches[0].clientY; // Positive = Swipe Up
    touchY.current = null;

    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // Swipe Up -> Increase Stage
        setMobileStage((prev) => Math.min(prev + 1, 3));
      } else {
        // Swipe Down -> Decrease Stage
        setMobileStage((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const getSheetHeight = () => {
    switch (mobileStage) {
      case 0: return miniHeight;
      case 2: return midHeight;
      case 3: return fullHeight;
      default: return peekHeight;
    }
  };

  const isExpanded = mobileStage >= 1;

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-[900] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-t-[32px] overflow-hidden flex flex-col bottom-16 overscroll-none",
        getSheetHeight(),
        className
      )}
    >
      {/* Drag Handle Area - Large Click Target & Swipe Source */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="shrink-0 touch-none"
      >
        <button 
          onClick={toggleExpand}
          className="w-full flex flex-col items-center pt-4 pb-2 cursor-pointer hover:bg-slate-50/50 active:bg-slate-100 transition-colors group"
          aria-label={mobileStage === 2 ? "Reset list" : "Expand list"}
        >
          <div className="w-16 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors" />
        </button>

        {/* Header - Clickable and Swipeable too */}
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button')) return;
          toggleExpand();
        }} className="cursor-pointer">
          {header}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className={cn(
          "flex-1 flex flex-col min-h-0 transition-all duration-300",
          isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        )}>
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain touch-pan-y">
            {children}
          </div>
        </div>

        {footer && (
          <div className={cn(
            "shrink-0",
            isExpanded ? 'block' : 'hidden'
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
