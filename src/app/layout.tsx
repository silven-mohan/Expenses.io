import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@styles/globals.css';
import { AppProvider } from '@providers/AppProvider';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ExpenseLedger - Personal Finance Ledger',
  description: 'Premium personal finance ledger application that works entirely offline',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4F46E5" />
        <meta name="description" content="Premium personal finance ledger application - Offline first" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ExpenseLedger" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-white dark:bg-primary-950`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
