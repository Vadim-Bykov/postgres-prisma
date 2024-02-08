/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pbs.twimg.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
};

module.exports = nextConfig;
