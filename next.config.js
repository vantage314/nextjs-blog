/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置动态路由
  async redirects() {
    return [
      {
        source: '/notifications',
        destination: '/',
        permanent: false,
      },
    ];
  },
  // 配置页面重写
  async rewrites() {
    return [
      {
        source: '/notifications',
        destination: '/notifications',
      },
    ];
  },
};

module.exports = nextConfig; 