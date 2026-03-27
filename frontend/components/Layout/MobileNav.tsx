"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, ArrowLeftRight, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClosures } from '@/context/ClosuresContext';

const mobileNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Map View',
    url: '/closures',
    icon: Wallet,
  },
  {
    title: 'Routing',
    url: '/closure-aware-routing',
    icon: ArrowLeftRight,
  },
  {
    title: 'Documentation',
    url: '/docs',
    icon: Calendar,
  },
  {
    title: 'Profile',
    url: '/profile', // We'll handle this specially or link to login if not auth
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { state } = useClosures();
  const { isAuthenticated } = state;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1100] md:hidden bg-white border-t border-gray-100 shadow-none pt-2 pb-5">
      <nav className="w-full flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.url || (item.url !== '/' && pathname?.startsWith(item.url));
          const Icon = item.icon;
          
          // Special case for profile/login
          const url = item.title === 'Profile' && !isAuthenticated ? '/login' : item.url;

          return (
            <Link
              key={item.title}
              href={url}
              className="flex flex-col items-center justify-center transition-all duration-300"
            >
              <div className={cn(
                "p-2 transition-all duration-300 flex items-center justify-center",
                isActive ? "text-slate-900 active:scale-95" : "text-slate-400 active:scale-95"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <div className="h-1.5 flex items-center justify-center -mt-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-blue-600 transition-all duration-300",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )} />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
