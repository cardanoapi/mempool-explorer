import cron from 'node-cron';

import { RedisManager } from '../services/RedisManager';
import DependencyInjectionManager from '../services/DependencyInjectionManager';
import environments from '../config/environment';

export abstract class RedisBaseController<T> {
    protected readonly redisManager: RedisManager<T> | undefined;

    protected constructor(cronJobTimeInSeconds: number = 40) {
        if (environments.ENABLE_REDIS_CACHE) {
            this.redisManager =
                DependencyInjectionManager.getInstance().getDependency(
                    'RedisManager'
                );

            console.log(
                `[Redis:${this.constructor.name}] Redis cache cron job enabled!`
            );

            // Schedule the API call and cache update every cronJobTimeInSeconds seconds
            this.scheduleDataUpdate(cronJobTimeInSeconds);
        }
    }

    // Abstract method to be implemented by child controllers
    protected abstract fetchDataAndUpdateCache(): Promise<T>;

    private scheduleDataUpdate(cronJobTimeInSeconds: number) {
        cron.schedule(`*/${cronJobTimeInSeconds} * * * * *`, async () => {
            try {
                await this.fetchDataAndUpdateCache();
                console.log(
                    `[Redis:${this.constructor.name}] Data in cache updated!`
                );
            } catch (error) {
                console.error(
                    `[Redis:${this.constructor.name}] Error updating cached data:`,
                    error
                );
            }
        });
    }
}
