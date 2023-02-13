/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.shopify.com", "static.survaq.com"],
  },
  redirects: () => [
    {
      source: "/products/:path*",
      destination: "/",
      statusCode: 301,
    },
  ],
  env: {
    SURVAQ_API_ORIGIN: process.env.SURVAQ_API_ORIGIN,
    SURVAQ_STATIC_ORIGIN: process.env.SURVAQ_STATIC_ORIGIN,
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
