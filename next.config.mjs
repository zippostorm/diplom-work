/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wallpaperflare.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.befunky.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
