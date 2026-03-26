"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Map as MapIcon, 
  Route, 
  BookOpen, 
  User, 
  LogOut, 
  LogIn,
  Info,
  ShieldCheck,
  Bell,
  TriangleAlert,
  Construction
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
  SidebarTrigger,
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
    title: 'Closure-Aware Routing',
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
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white border-b border-gray-100 p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:h-[64px] group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center w-full h-full">
          <Link href="/" className="flex items-center space-x-2 group-data-[collapsible=icon]:hidden min-w-0 flex-1 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg shrink-0">
              <Construction className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-base text-gray-900 tracking-tight truncate">OSM Road Closures</span>
          </Link>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:mx-auto shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100" />
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
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        {/* Alerts Section */}
        <SidebarGroup className="flex-1 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            <Bell className="w-3 h-3 mr-1" />
            Alerts
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 space-y-2 overflow-y-auto">
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-blue-900 mb-1">
                      Login Required for Full Features
                    </h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      You can view closures, but need to log in to report new ones or edit existing closures.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-green-900 mb-1">
                      Full Access Enabled
                    </h4>
                    <p className="text-xs text-green-700 leading-relaxed">
                      You can create, edit, and delete road closures.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pathname === '/closure-aware-routing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-blue-900 mb-1">
                      Routing Guide
                    </h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Click on the map to set the start location for driving, then click again to set your destination.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pathname === '/closures' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Bell className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-amber-900 mb-1">
                      Tip
                    </h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Use the &quot;Report Closure&quot; button in the map view panel to add new road closures, or hover over existing closures in the list to edit them.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-gray-50 p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-md">
                  <SidebarMenuButton size="lg" render={<div />} className="w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-xs">
                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">{user?.username}</span>
                      <span className="truncate text-xs text-gray-500">Editor</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" sideOffset={8} className="w-[200px]">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center group-data-[collapsible=icon]:bg-blue-600 group-data-[collapsible=icon]:rounded-full"
                tooltip="Login to Report"
              >
                <LogIn className="group-data-[state=expanded]:mr-2 h-4 w-4 shrink-0 font-bold" />
                <span className="group-data-[collapsible=icon]:hidden">Login to Report</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
