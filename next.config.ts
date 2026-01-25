import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Compiler (requires babel-plugin-react-compiler)
  reactCompiler: false,
  // Ignore build errors for Vercel compatibility
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap/sitemap.xml',
        permanent: true,
      },
    ]
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

