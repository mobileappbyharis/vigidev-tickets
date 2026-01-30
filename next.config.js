/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tzmilnltvvtsvdmrkhin.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  eslint: {
    // Disable ESLint during build for now - we'll enable strict linting in CI/CD later
    ignoreDuringBuilds: process.env.VERCEL === '1',
  },
};

module.exports = nextConfig;
