import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/en/projects/:slug",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
