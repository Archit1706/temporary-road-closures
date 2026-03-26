"use client";

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/Layout/AppSidebar';

// Routes that should NOT show the app sidebar
const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function ConditionalSidebar() {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) return null;
  return <AppSidebar />;
}
