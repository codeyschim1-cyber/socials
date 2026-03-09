'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, BarChart3, Lightbulb,
  Handshake, UserCircle, ChevronLeft, ChevronRight, Sparkles, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/brands', label: 'Brands', icon: Handshake },
  { href: '/media-kit', label: 'Media Kit', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`hidden md:flex flex-col bg-surface-card border-r border-zinc-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-zinc-200 ${collapsed ? 'justify-center' : ''}`}>
        <Sparkles className="w-6 h-6 text-violet-600 shrink-0" />
        {!collapsed && <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Creator Hub</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-violet-100 text-violet-600'
                  : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100'
              } ${collapsed ? 'justify-center px-0 mx-1' : ''}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200">
        <button
          onClick={signOut}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-full h-10 text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
