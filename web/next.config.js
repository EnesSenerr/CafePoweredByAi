/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/chatbot/:path*',
        destination: 'http://localhost:5000/api/chatbot/:path*',
      },
      {
        source: '/api/recommendations/:path*',
        destination: 'http://localhost:5000/api/recommendations/:path*',
      },
    ];
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig; 