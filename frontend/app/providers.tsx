"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { LocationProvider } from '@/context/LocationContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ConditionalSidebar } from '@/components/Layout/ConditionalSidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Routes that bypass the app shell (no sidebar/SidebarProvider)
const PUBLIC_ROUTES = ['/', '/login', '/register'];

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (isPublic) {
    // Public pages: no sidebar, just full-width content
    return <>{children}</>;
  }

  // App pages: sidebar + content
  return (
    <SidebarProvider>
      <ConditionalSidebar />
      <main className="flex-1 w-full overflow-hidden relative bg-white">
        {children}
      </main>
    </SidebarProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClosuresProvider>
      <LocationProvider>
        <TooltipProvider>
          <AppShell>
            {children}
          </AppShell>
        </TooltipProvider>
      </LocationProvider>
      <Toaster position="top-center" />
    </ClosuresProvider>
  );
}
