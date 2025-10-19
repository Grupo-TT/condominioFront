import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          'http://ec2-3-143-229-202.us-east-2.compute.amazonaws.com:8080/:path*', // tu backend AWS
      },
    ];
  },
};

export default nextConfig;
