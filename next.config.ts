import type { NextConfig } from "next";

const FALLBACK_BACKEND = "https://gearup-igqw.onrender.com";

const API_TARGET = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL || FALLBACK_BACKEND;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
