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
    basePath: '/me',
    assetPrefix: '/me/',
};

export default nextConfig;