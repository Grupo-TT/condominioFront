import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Suprimir warnings de source maps de librerías de terceros
    if (!isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/@hugeicons/ },
        /Failed to parse source map/,
      ];
    }
    return config;
  },
  // Suprimir warnings de source maps en la consola del navegador
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
