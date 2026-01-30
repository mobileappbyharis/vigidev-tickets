import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tzmilnltvvtsvdmrkhin.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

export default config;
