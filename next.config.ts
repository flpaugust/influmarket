import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/auth/register",
        destination: "/cadastro",
        permanent: true,
      },
      {
        source: "/dashboard/brand",
        destination: "/dashboard/marca",
        permanent: true,
      },
      {
        source: "/dashboard/influencer",
        destination: "/dashboard/creator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
