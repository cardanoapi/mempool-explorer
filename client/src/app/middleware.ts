import { NextRequest, NextResponse } from 'next/server.js';

import environments from '@app/configs/environments';
import { buildRedisKey, getRedisInstance } from '@app/configs/redis';


export const redisMiddleware = async (req: NextRequest, res: NextResponse, next: (req: NextRequest, res: NextResponse) => Promise<any>) => {
    try {
        const redis = getRedisInstance();

        // Build a key based on the request body or any other criteria
        const key = buildRedisKey(req);

        // Try to fetch cached data
        const cached = await redis.get(key);

        // If cached data exists, send it as the response and skip the actual API logic
        if (cached) {
            console.log(`[Redis] Sending cached data for ${req.url}...`);
            return JSON.parse(cached);
        } else {
            console.log(`[Redis] No cached data found. Getting it from the API ${req.url}...`);
            // If no cached data, continue to the next middleware or the actual API handler
            return await next(req, res);
        }
    } catch (e: any) {
        console.error('[Redis] Middleware Error:', e);
        return await next(req, res);
    }
};

/**
 * Caching callback
 * @param handler takes in the API method
 * @param maxAge default caching time 10 minutes = 600 seconds
 */
export const withCaching = (handler: (req: NextRequest, res: NextResponse) => Promise<any>, maxAge: number = environments.REDIS.CACHE_MAX_AGE_IN_SECONDS) => {
    return async (req: NextRequest, res: NextResponse) => {
        try {
            // Generic API logic goes here
            const data = await handler(req, res);

            // Cache the data in Redis with a specified expiry time
            const key = buildRedisKey(req);
            // Check if Redis instance is available
            try {
                const redis = getRedisInstance();
                const EXPIRY_MS: 'EX' | 'PX' | number = 'EX'; // seconds
                // TODO: update redis cached data from startup (periodic)
                await redis.set(key, JSON.stringify(data), EXPIRY_MS, maxAge);
            } catch (e) {
                console.warn('[Redis] Instance not available. Skipping caching...');
                return data; // Return data from the API handler if Redis is not available
            }

            // Return data to the client
            return data;
        } catch (e: any) {
            console.error('[Redis] Generic API Handler Error:', e);
            return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
        }
    };
};