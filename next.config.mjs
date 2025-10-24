/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.jsonld$/,
            type: "json",
        });
        return config;
    },
    output: 'export',
    images: { unoptimized: true },
    basePath: '/',
    assetPrefix: '/',
};

export default nextConfig;