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
  // Completely disable webpack caching
  webpack: (config) => {
    config.cache = false;
    // Ensure the cache property is explicitly disabled
    if (config.optimization) {
      config.optimization.moduleIds = 'named';
    }
    return config;
  },
};

module.exports = nextConfig;