import { NextRequest } from 'next/server.js';

import Redis, { RedisOptions } from 'ioredis';

import environments from '@app/configs/environments';


function getRedisConfiguration(): {
    port: number | undefined;
    host: string | undefined;
    password: string | undefined;
} {
    return {
        host: environments.REDIS.HOST,
        password: environments.REDIS.PASSWORD,
        port: environments.REDIS.PORT && parseInt(environments.REDIS.PORT) ? parseInt(environments.REDIS.PORT) : undefined
    };
}

let redisInstance: Redis | null = null;

export function createRedisInstance(config = getRedisConfiguration()) {
    try {
        const options: RedisOptions = {
            host: config.host,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 0,
            retryStrategy: (times: number) => {
                if (times > 3) {
                    console.error(`[Redis] Could not connect after ${times} attempts!`);
                    return;
                }

                return Math.min(times * 500, 1000);
            }
        };

        if (config.port) {
            options.port = config.port;
        }

        if (config.password) {
            options.password = config.password;
        }

        const redis = new Redis(options);

        console.log(redis);

        redis.on('error', (error: unknown) => {
            console.warn('[Redis] Error connecting ', error);
        });

        redis.on('connect', () => {
            redisInstance = redis;
        });

        return redis;
    } catch (e) {
        throw new Error(`[Redis] Could not create a Redis instance!`);
    }
}

export function getRedisInstance(): Redis {
    try {
        if (!redisInstance) {
            console.log('[Redis] Creating Redis Instance...');
            redisInstance = createRedisInstance();
        }

        return redisInstance;
    } catch (e: any) {
        throw new Error(e.toString());
    }
}

export function buildRedisKey(requestBody: NextRequest): string {
    const { url } = requestBody;

    if (url) {
        // You can concatenate the properties to create a unique key
        return `redis:${url}`;
    } else {
        throw new Error('[Redis] Invalid request body. Missing required properties.');
    }
}