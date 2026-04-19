import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "zh-TW", "hi"],
    defaultLocale: "en",
  },
  images: {
    domains: ["patents.google.com"],
  },
};

export default nextConfig;