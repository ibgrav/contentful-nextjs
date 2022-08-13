/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  // experimental: {
  // https://github.com/vercel/next.js/pull/22867
  // externalDir: false,
  // },
  rewrites: async () => [],
  redirects: async () => [],
};

module.exports = nextConfig;
