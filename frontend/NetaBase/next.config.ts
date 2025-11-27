/** @type {import("next").NextConfig} */
const nextConfig = {
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/sitemap.xml/",
        destination: "/sitemap.xml",
      },
    ];
  },

  compiler: {
    removeConsole: true, // removes console.* in production
  },
};

module.exports = nextConfig;
