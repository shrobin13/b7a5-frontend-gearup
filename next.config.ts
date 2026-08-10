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
  images: {
    remotePatterns: [
      // Gear image URLs are provider-supplied, so allow any HTTPS host
      // plus localhost for local development.
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
};

export default nextConfig;
