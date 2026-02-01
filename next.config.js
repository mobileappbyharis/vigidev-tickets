/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['tzmilnltvvtsvdmrkhin.supabase.co'],
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  eslint: {
    // Disable ESLint during build for now - we'll enable strict linting in CI/CD later
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
