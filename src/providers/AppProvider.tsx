'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useInitializeApp } from '@hooks/useInitializeApp';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // initialize app (we don't need to use the loading state here)
  useInitializeApp();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
