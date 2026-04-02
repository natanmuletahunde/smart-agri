import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { hostname: "img.freepik.com" },
      { hostname: "media.gettyimages.com" },
      { hostname: "static.vecteezy.com" },
      { hostname: "media.istockphoto.com" },
      { hostname: "images.pexels.com" },
      { hostname: "images.stockcake.com" },
      { hostname: "assets.weforum.org" },
      { hostname: "www.shutterstock.com" },
      { hostname: "mega.onelogix.com" },
      { hostname: "abedinequipment.com" },
    ],
  },
};

export default nextConfig;
