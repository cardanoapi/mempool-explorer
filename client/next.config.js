/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        WS_URL: process.env.WS_URL
    }
};

module.exports = nextConfig;
