import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source:
          "/evals/:prefix([^:]+)\\::minutes(\\d{2})\\::seconds(\\d{2})\\.:ext(html|json)",
        destination: "/evals/:prefix-:minutes-:seconds.:ext",
        permanent: true,
      },
      {
        source:
          "/evals/:prefix([^:]+)\\::minutes(\\d{2})\\::seconds(\\d{2})",
        destination: "/evals/:prefix-:minutes-:seconds.html",
        permanent: true,
      },
      {
        source: "/evals/:evalId((?!.*\\.).*)",
        destination: "/evals/:evalId.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
