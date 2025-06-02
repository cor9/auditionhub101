// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // <--- CRITICAL: Commented out or removed to allow API routes and server-side features.
                      // This fixes the error with "/api/auth/[...nextauth]".

  images: {
    unoptimized: true, // Consider changing to 'false' or removing this line once builds are stable,
                       // as Render (Node.js environment) can support Next.js image optimization.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // Recommended to address lint issues and remove this later.
  },

  typescript: {
    ignoreBuildErrors: true, // Recommended to address TypeScript errors and remove this later.
  },

  // --- Cache Disabling (Consider Removing Once Builds Are Stable) ---
  // The following webpack and generateBuildId configurations were likely added
  // to combat previous caching issues. Once the primary build errors (like the
  // one caused by 'output: "export"') are resolved, these can usually be removed
  // to restore default Next.js caching, which improves build times.

  /*
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
  */

  /*
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  */
  // --- End of Cache Disabling Section ---
};

module.exports = nextConfig;
