import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  
  async redirects() {
    return [
      // Auth redirects
      {
        source: '/auth/login',
        destination: '/giris',
        permanent: true,
      },
      {
        source: '/auth/register',
        destination: '/kayit',
        permanent: true,
      },
      {
        source: '/auth/forgot-password',
        destination: '/sifremi-unuttum',
        permanent: true,
      },
      {
        source: '/auth/reset-password/:token',
        destination: '/sifre-sifirlama/:token',
        permanent: true,
      },
      
      // Admin/Employee redirects
      {
        source: '/admin',
        destination: '/yonetici',
        permanent: true,
      },
      {
        source: '/employee',
        destination: '/calisan',
        permanent: true,
      },
      
      // Hesabım alt sayfa redirects
      {
        source: '/hesabim/profile',
        destination: '/hesabim/profil',
        permanent: true,
      },
      {
        source: '/hesabim/orders',
        destination: '/hesabim/siparisler',
        permanent: true,
      },
      {
        source: '/hesabim/favorites',
        destination: '/hesabim/favoriler',
        permanent: true,
      },
      {
        source: '/hesabim/rewards',
        destination: '/hesabim/oduller',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
