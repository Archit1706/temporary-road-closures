"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Map as MapIcon, 
  Route, 
  BookOpen, 
  User, 
  LogOut, 
  LogIn 
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useClosures } from '@/context/ClosuresContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Map View',
    url: '/closures',
    icon: MapIcon,
  },
  {
    title: 'Routing',
    url: '/closure-aware-routing',
    icon: Route,
  },
  {
    title: 'Documentation',
    url: '/docs',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, logout } = useClosures();
  const { isAuthenticated, user } = state;

  return (
    <Sidebar>
      <SidebarHeader className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">OSM Road Closures</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url || pathname?.startsWith(item.url + '/')}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-gray-50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-md">
                  <SidebarMenuButton size="lg" render={<div />} className="w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username}</span>
                      <span className="truncate text-xs text-gray-500">Editor</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton 
                render={<Link href="/login" />}
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center"
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login to Report</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
