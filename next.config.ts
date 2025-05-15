import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/external",
        permanent: false, // change to true if this should be cached by browsers
      },
    ];
  },
};

export default nextConfig;
