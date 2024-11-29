/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        // Optional: Add `port`, `pathname` or `query` to further specify the allowed URLs if needed.
      },
      {
        protocol: 'https',
        hostname: 'cdn.t.shef.com',
        // Same here, optional further pattern adjustments
      },
    ],
  },
};

export default nextConfig;
