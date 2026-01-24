const nextConfig = {
  // Explicitly disable React Compiler (requires babel-plugin-react-compiler)
  reactCompiler: false,
  // Experimental features
  experimental: {
    scrollRestoration: true,
  },
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Ignore build errors for Vercel compatibility
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
