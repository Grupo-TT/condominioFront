import type { NextConfig } from "next";

const isTurbopack = Boolean(process.env.TURBOPACK)

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  ...(isTurbopack
    ? {}
    : {
        webpack: (config, { isServer }) => {
          // Suprimir warnings de source maps de librerías de terceros (solo aplica en Webpack)
          if (!isServer) {
            config.ignoreWarnings = [
              { module: /node_modules\/@hugeicons/ },
              /Failed to parse source map/,
            ]
          }
          return config
        },
      }),
  // Suprimir warnings de source maps en la consola del navegador
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig;
