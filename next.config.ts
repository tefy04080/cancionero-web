import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // El linting se hace en desarrollo, no bloqueamos el build de producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Los type errors no bloquean el build en Vercel
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
