/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'university.pdp.uz',
      'bojxonaservis.netlify.app',
      'www.afisha.uz',
    ],
  },
    eslint: {
    // ESLint xatolariga qaramay build qilishga ruxsat beriladi
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;