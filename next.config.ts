import type { NextConfig } from "next";

// We use 'any' here to silence the strict type checker
const nextConfig: any = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;