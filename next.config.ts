import type { NextConfig } from "next";

const API_TARGET = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_API_URL ?? "";

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
