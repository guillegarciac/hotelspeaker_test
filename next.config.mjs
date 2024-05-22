/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*'
      },
    ];
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    domains: ['example.com'],
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, Authorization, Content-Type' },
        ],
      },
    ];
  },
  output: 'export',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hotelspeaker_test/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/hotelspeaker_test' : '',
};

export default nextConfig;
