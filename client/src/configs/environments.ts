let CACHE_MAX_AGE_IN_SECONDS = 600;

try {
    if (process.env.REDIS_CACHE_MAX_AGE_IN_SECONDS) CACHE_MAX_AGE_IN_SECONDS = parseInt(process.env.REDIS_CACHE_MAX_AGE_IN_SECONDS);
} catch (e) {}

const environments = {
    WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws',
    CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? 'mainnet',
    // @ts-ignore
    ENABLE_CONNECT_WALLET: (process.env.ENABLE_CONNECT_WALLET && (process.env.ENABLE_CONNECT_WALLET === 'true' || process.env.ENABLE_CONNECT_WALLET === true)) ?? false,
    API_URL: process.env.API_URL ?? 'http://localhost:8080/api/v1',
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PASSWORD: process.env.REDIS_PASSWORD,
        PORT: process.env.REDIS_PORT,
        CACHE_MAX_AGE_IN_SECONDS: CACHE_MAX_AGE_IN_SECONDS
    }
};

export default environments;
