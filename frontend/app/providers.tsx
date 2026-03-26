"use client";

import React from 'react';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClosuresProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </SidebarProvider>
      <Toaster position="top-right" />
    </ClosuresProvider>
  );
}
