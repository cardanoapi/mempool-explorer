import { Express } from 'express';

import environments from '../config/environment';
import DependencyInjectionManager from '../services/DependencyInjectionManager';
import { RedisManager } from '../services/RedisManager';

const appSetup = (app: Express) => {
    if (environments.ENABLE_REDIS_CACHE) {
        console.log('Registering RedisManager in DependencyInjectionManager');
        // Register RedisManager as a dependency
        DependencyInjectionManager.getInstance().registerDependency(
            'RedisManager',
            new RedisManager({
                password: environments.REDIS_PASSWORD,
                username: environments.REDIS_USERNAME,
                socket: {
                    host: environments.REDIS_HOST,
                    port: environments.REDIS_PORT,
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
    }

    // set database connections

    const APP_PORT = process.env.PORT ?? 8000;

    app.listen(APP_PORT, () => {
        console.log(`Server started on port ${APP_PORT}`);
    });
};

export default appSetup;
