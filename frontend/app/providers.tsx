"use client";

import React from 'react';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { LocationProvider } from '@/context/LocationContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClosuresProvider>
      <LocationProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
        </SidebarProvider>
      </LocationProvider>
      <Toaster position="top-right" />
    </ClosuresProvider>
  );
}
