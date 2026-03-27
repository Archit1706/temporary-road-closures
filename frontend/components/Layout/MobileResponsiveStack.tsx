"use client";

import React, { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileResponsiveStackProps {
  isOpen: boolean;
  onClose?: () => void;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
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
  peekHeight = "260px",
  midHeight = "40vh",
  fullHeight = "80vh",
  className,
}: MobileResponsiveStackProps) {
  const isMobile = useIsMobile();
  const [mobileStage, setMobileStage] = useState(0); // 0: Peek, 1: Mid, 2: Full
  const touchY = useRef<number | null>(null);

  if (!isMobile || !isOpen) return null;

  const toggleExpand = () => {
    setMobileStage((prev) => (prev + 1) % 3);
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
        setMobileStage((prev) => Math.min(prev + 1, 2));
      } else {
        // Swipe Down -> Decrease Stage
        setMobileStage((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const getSheetHeight = () => {
    switch (mobileStage) {
      case 1: return midHeight;
      case 2: return fullHeight;
      default: return peekHeight;
    }
  };

  const isExpanded = mobileStage > 0;

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-[900] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-t-[32px] overflow-hidden flex flex-col bottom-16",
        getSheetHeight(),
        className
      )}
    >
      {/* Drag Handle Area - Large Click Target & Swipe Source */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="shrink-0"
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
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className={cn(
          "transition-all duration-500 flex flex-col min-h-0",
          isExpanded ? 'opacity-100 flex-1' : 'opacity-0 h-0 overflow-hidden'
        )}>
          {children}
        </div>

        {footer && (
          <div className={isExpanded ? 'mt-auto shrink-0' : 'hidden'}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
