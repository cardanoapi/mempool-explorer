/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache');
const withPlugins = require('next-compose-plugins');

const { i18n } = require('./next-i18next.config');

const getHostnameFromRegex = (url) => {
    // run against regex
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    // extract hostname (will be empty string if no match is found)
    return matches ? matches[1] : '';
};

const imageUrls = process.env.IMAGE_DOMAINS ? process.env.IMAGE_DOMAINS.split(',') : null;
const imageDomains = [];

if (imageUrls && Array.isArray(imageUrls)) {
    imageUrls.map((url) => {
        const domain = getHostnameFromRegex(url);
        if (domain) imageDomains.push(domain);
    });
}

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/]
});

const nextConfig = {
    basePath: process.env.BASE_DEPLOY_PATH || '',
    productionBrowserSourceMaps: true,
    compress: true,
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    reactStrictMode: true,
    i18n,
    optimizeFonts: true,
    compiler: {
        emotion: false,
        removeConsole: false
    },
    images: {
        minimumCacheTTL: 600,
        formats: ['image/avif', 'image/webp'],
        domains: [...imageDomains]
    },
    publicRuntimeConfig: {
        BASE_DEPLOY_PATH: process.env.BASE_DEPLOY_PATH,
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NEXT_PUBLIC_CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK
    },
    env: {
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NEXT_PUBLIC_CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK
    }
};

if (process.env.BASE_DEPLOY_PATH) {
    nextConfig['assetPrefix'] = process.env.BASE_DEPLOY_PATH;
    nextConfig['basePath'] = process.env.BASE_DEPLOY_PATH;
}

const nextConfigWithPWA = withPWA({
    ...nextConfig,
    ...(process.env.NODE_ENV === 'production' && {
        typescript: {
            ignoreBuildErrors: false
        },
        eslint: {
            ignoreDuringBuilds: false
        }
    })
});

module.exports = nextConfigWithPWA;
