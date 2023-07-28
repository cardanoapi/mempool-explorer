/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        WS_URL: process.env.WS_URL,
        CARDANO_NETWORK: process.env.CARDANO_NETWORK
    }
};

module.exports = nextConfig;
