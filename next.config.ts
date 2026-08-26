import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All imagery is now local (public/work). No remote patterns needed.
  images: {
    formats: ['image/avif', 'image/webp'],
    // The comparator renders large stills; these widths match its breakpoints.
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 2000],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
