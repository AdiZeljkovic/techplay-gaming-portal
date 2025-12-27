import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Power off "X-Powered-By" header
  poweredByHeader: false,
  // React strict mode
  reactStrictMode: true,

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },

  images: {
    minimumCacheTTL: 60 * 60 * 24, // Cache images for 24h
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: '**.techplay.gg',
      },
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
      {
        protocol: 'https',
        hostname: '**.rawg.io',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
