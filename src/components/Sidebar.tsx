'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@lib/utils';
import { BarChart3, Settings, Home, TrendingUp, DollarSign, Users } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: DollarSign },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/debt', label: 'Debt Tracking', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r border-primary-200 bg-white dark:bg-primary-950 dark:border-primary-800 flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-primary-200 dark:border-primary-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          ExpenseLedger
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-white'
                  : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 dark:text-primary-300'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
