import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF where supported, fall back to WebP. Delivered images are
    // optimized without changing the source assets.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
