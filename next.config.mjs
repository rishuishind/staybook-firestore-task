/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "icons8.com",
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
      "storage.googleapis.com",
      "images.staybook.in",
      "images.com",
      "firebasestorage.googleapis.com",
      "r1imghtlak.mmtcdn.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    loader: "default",
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
