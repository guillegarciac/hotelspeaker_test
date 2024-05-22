// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`, 
      },
    ];
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, 
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
  webpack(config) {
    // Logging for debugging
    console.log('CLIENT_ID:', process.env.CLIENT_ID);
    console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);

    return config;
  }
};

export default nextConfig;
