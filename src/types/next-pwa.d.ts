declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  // Minimal typing for next-pwa to satisfy TypeScript during build.
  // Adjust PWAOptions if you need stronger typing.
  type PWAOptions = Record<string, any>;

  function withPWA(options?: PWAOptions): (nextConfig?: NextConfig) => NextConfig;

  export default withPWA;
}
