"use client";

import React from 'react';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { LocationProvider } from '@/context/LocationContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { Toaster } from '@/components/ui/sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClosuresProvider>
      <LocationProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full overflow-hidden relative bg-white">
              {children}
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </LocationProvider>
      <Toaster position="top-center" />
    </ClosuresProvider>
  );
}
