/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    return config;
  },
};

module.exports = nextConfig;
