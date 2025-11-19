const nextConfig: import("next").NextConfig = {
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
};

module.exports = nextConfig;
