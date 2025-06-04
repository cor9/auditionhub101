// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Set to standalone to ensure proper server functionality

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
};

module.exports = nextConfig;