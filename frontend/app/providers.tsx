"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ClosuresProvider } from '@/context/ClosuresContext';
import { LocationProvider } from '@/context/LocationContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ConditionalSidebar } from '@/components/Layout/ConditionalSidebar';
import { MobileNav } from '@/components/Layout/MobileNav';
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

  // App pages: sidebar + content + mobile nav
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <ConditionalSidebar />
        <main className="flex-1 w-full overflow-hidden relative bg-white pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
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
