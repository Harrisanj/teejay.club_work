/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    swcPlugins: [["next-superjson-plugin", { excluded: [] }]],
  },
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
