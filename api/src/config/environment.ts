import dotenv from 'dotenv';

dotenv.config();

const environments = {
    CARDANO_NETWORK: process.env.CARDANO_NETWORK || 'mainnet',
    ENABLE_REDIS_CACHE:
        (process.env.ENABLE_REDIS_CACHE &&
            (process.env.ENABLE_REDIS_CACHE === 'true' ||
                // @ts-ignore
                process.env.ENABLE_REDIS_CACHE === true)) ||
        false,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
};

export default environments;
