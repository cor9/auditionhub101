/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Completely disable webpack caching and configure for clean builds
  webpack: (config) => {
    // Disable all caching mechanisms
    config.cache = false;
    
    // Ensure webpack doesn't try to use cache
    if (config.optimization) {
      config.optimization.moduleIds = 'named';
      // Disable chunk caching
      config.optimization.chunkIds = 'named';
      // Disable runtime caching
      config.optimization.runtimeChunk = false;
    }
    
    return config;
  },
  // Disable Next.js internal caching
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;