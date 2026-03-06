import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mapainversiones.obraspublicas.gob.ar",
      },
    ],
  },
};

export default nextConfig;
