import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",         // Frontend → /api/... гэж дуудагдана
        destination: "http://localhost:8000/api/:path*",  // Backend URL
      },
    ];
  },
};

export default nextConfig;
