/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache');
const withPlugins = require('next-compose-plugins');
const { withPlausibleProxy } = require('next-plausible');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const plausiblePlugin = withPlausibleProxy;

// To analyze the bundle, run `ANALYZE="true" npm run build`
const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true' || process.env.ANALYZE === true,
    openAnalyzer: true
});

const { i18n } = require('./next-i18next.config');

const getHostnameFromRegex = (url) => {
    // run against regex
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    // extract hostname (will be empty string if no match is found)
    return matches ? matches[1] : '';
};

const imageUrls = process.env.IMAGE_DOMAINS ? process.env.IMAGE_DOMAINS.split(',') : null;
const imageDomains = ['images.unsplash.com'];

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
    env: {
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NEXT_PUBLIC_CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK,
        ENABLE_CONNECT_WALLET: process.env.ENABLE_CONNECT_WALLET,
        API_URL: process.env.API_URL,
        CONTRIBUTERS_JSON_URL: process.env.CONTRIBUTERS_JSON_URL,
        CONTACT_US_URL: process.env.CONTACT_US_URL
    },
    experimental: {
        maximumFileSizeToCacheInBytes: {
            js: 10 * 1024 * 1024, // 10 MB
            css: 10 * 1024 * 1024 // 10 MB
        }
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

console.log(process.env);

module.exports = withPlugins([[plausiblePlugin, bundleAnalyzer]], nextConfigWithPWA);

// module.exports = nextConfigWithPWA;
