import type { NextConfig } from 'next';
import { parseEnvironment } from './src/lib/env-schema';
import { getSecurityHeaders } from './src/lib/security-headers';

parseEnvironment(process.env);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: getSecurityHeaders(process.env.NODE_ENV === 'production'),
      },
    ];
  },
};

export default nextConfig;
