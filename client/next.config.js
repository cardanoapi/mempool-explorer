/** @type {import('next').NextConfig} */
const nextConfig = {
    // publicRuntimeConfig: {
    //     WS_URL: process.env.WS_URL,
    //     CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK
    // }
    env: {
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NEXT_PUBLIC_CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK
    }
};

module.exports = nextConfig;
