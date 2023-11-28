import {
    createClient,
    RedisClientOptions,
    RedisClientType,
    RedisDefaultModules,
    RedisFunctions,
    RedisModules,
    RedisScripts
} from 'redis';
import { promisify } from 'util';

export class RedisManager<T> {
    private static instance: RedisManager<any> | null = null;
    private readonly redisClient: RedisClientType<
        RedisDefaultModules & RedisModules,
        RedisFunctions,
        RedisScripts
    >;
    private readonly redisGetAsync: (key: string) => Promise<T | null>;
    private readonly redisSetAsync: (
        key: string,
        value: string,
        mode: string,
        duration: number
    ) => Promise<string>;

    public constructor(redisConfig: RedisClientOptions) {
        this.redisClient = createClient(redisConfig);

        this.redisClient.on('error', (error) => {
            console.error('Redis Error:', error);
        });

        (async (redisClient) => await redisClient.connect())(this.redisClient);

        this.redisClient.on('connect', () => {
            console.log('Redis connected!');
        });

        this.redisGetAsync = promisify(this.redisClient.get).bind(
            this.redisClient
        );
        this.redisSetAsync = promisify(this.redisClient.set).bind(
            this.redisClient
        );
    }

    static getInstance<T>(redisConfig: RedisClientOptions): RedisManager<T> {
        if (!this.instance) {
            this.instance = new RedisManager<T>(redisConfig);
        }
        return this.instance as RedisManager<T>;
    }

    async getFromCache(key: string): Promise<T | null> {
        const cachedData = await this.redisClient.get(key);
        return cachedData ? JSON.parse(cachedData as string) : null;
    }

    async setToCache(
        key: string,
        value: T,
        mode: string,
        duration: number
    ): Promise<string> {
        return this.redisSetAsync(key, JSON.stringify(value), mode, duration);
    }
}
