import cron from 'node-cron';

import { RedisManager } from '../services/RedisManager';
import DependencyInjectionManager from '../services/DependencyInjectionManager';

export abstract class RedisBaseController<T> {
    protected readonly redisManager: RedisManager<T> | undefined;

    protected constructor() {
        this.redisManager =
            DependencyInjectionManager.getInstance().getDependency(
                'RedisManager'
            );

        // Schedule the API call and cache update every 20 seconds
        this.scheduleDataUpdate();
    }

    // Abstract method to be implemented by child controllers
    protected abstract fetchDataAndUpdateCache(): Promise<T>;

    private scheduleDataUpdate() {
        cron.schedule('*/20 * * * * *', async () => {
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
