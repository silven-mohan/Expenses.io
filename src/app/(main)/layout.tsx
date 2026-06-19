export const dynamic = 'force-dynamic';

import React from 'react';
import { Sidebar } from '@components/Sidebar';
import { MobileNav } from '@components/MobileNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-primary-50 dark:bg-primary-950">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
