import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors ignore karo
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint errors ignore karo
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
