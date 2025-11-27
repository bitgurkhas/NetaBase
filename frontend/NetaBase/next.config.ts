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
  compiler: {
    removeConsole: true, // ⬅️ removes all console.* in production
  },
};

module.exports = nextConfig;
