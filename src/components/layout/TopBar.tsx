'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Content Calendar',
  '/analytics': 'Analytics',
  '/ideas': 'Content Ideas',
  '/brands': 'Brands & Revenue',
  '/media-kit': 'Media Kit',
};

export function TopBar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Creator Hub';

  return (
    <header className="h-16 border-b border-zinc-200 bg-surface-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span className="font-bold text-sm bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Creator Hub</span>
          <span className="text-zinc-400 mx-1">/</span>
        </div>
        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
      </div>
    </header>
  );
}
