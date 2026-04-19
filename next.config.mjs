/** @type {import('next').NextConfig} */
const nextConfig = {
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
