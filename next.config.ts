import type { NextConfig } from "next";

const serverActionAllowedOrigins = [
  ...(process.env.NEXT_PUBLIC_SITE_URL ? [new URL(process.env.NEXT_PUBLIC_SITE_URL).host] : []),
  ...(process.env.SERVER_ACTION_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
};

export default nextConfig;
