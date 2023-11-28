import express, { Express } from 'express';

import dotenv from 'dotenv';

import appSetup from './init';
import routerSetup from './init/routerSetup';
import securitySetup from './security';
import middlewareSetup from './middlewares';
import DependencyInjectionManager from './services/DependencyInjectionManager';
import { RedisManager } from './services/RedisManager';

dotenv.config();

const index: Express = express();

// Register RedisManager as a dependency
DependencyInjectionManager.getInstance().registerDependency(
    'RedisManager',
    new RedisManager({
        password: process.env.REDIS_PASSWORD ?? '',
        username: process.env.REDIS_USERNAME ?? 'default',
        socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: process.env.REDIS_PORT
                ? parseInt(process.env.REDIS_PORT)
                : 6379,
            reconnectStrategy: (times: number) => {
                if (times > 3) {
                    console.error(
                        `[Redis] Could not connect after ${times} attempts!`
                    );
                    throw new Error(
                        `[Redis] Could not connect after ${times} attempts!`
                    );
                }

                return Math.min(times * 500, 1000);
            }
        },
        pingInterval: 10000
    })
);

appSetup(index);
securitySetup(index, express);
middlewareSetup(index);
routerSetup(index);
