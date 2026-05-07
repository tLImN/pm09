import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.twc1.net",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "*.twc1.net",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.twc1.net",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "*.twc1.net",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
