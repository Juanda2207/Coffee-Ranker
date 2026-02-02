import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BLOB_HOSTNAME!,
        port: '',
        pathname: '**',
        search: '',
      }]
  }
};

export default nextConfig;
