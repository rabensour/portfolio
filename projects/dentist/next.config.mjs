/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration optimisée pour la production
  reactStrictMode: true,

  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // SEO et performances
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
