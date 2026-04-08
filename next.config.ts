import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/evals/:evalId((?!.*\\.).*)",
        destination: "/evals/:evalId.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
