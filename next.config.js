/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // SEO & Performance
  compress: true,
  poweredByHeader: false,
  // Render.com compatible
  output: 'standalone',
}

module.exports = nextConfig
