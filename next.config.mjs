/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: '/backoffice',
  compiler: {
    emotion: true
  },
  output: 'standalone',
};

export default nextConfig; 
