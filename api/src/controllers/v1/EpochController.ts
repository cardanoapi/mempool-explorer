import { Prisma } from '@prisma/client';
import { Get, Route, Tags } from 'tsoa';

import {
    dbSyncDb,
    getAverageConfirmationTimeForEpoch,
    getAverageTransactionPerBlockForEpoch
} from '../../queries';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';

@Tags('V1 Epoch')
@Route('/api/v1/epoch')
class EpochController extends RedisBaseController<any> {
    constructor() {
        super();
    }

    @Get('/current')
    async getCurrentEpoch() {
        try {
            // Check if data is cached in Redis
            const cachedData =
                await this.redisManager?.getFromCache('currentEpoch');

            if (cachedData) {
                console.log('[Redis:Epoch/Current] Data retrieved from cache');
                return JSON.parse(cachedData);
            }

            // If not cached, fetch data and update the cache
            const data = await this.fetchDataAndUpdateCache();
            console.log('[Redis:Epoch/Current] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/epoch', e);
        }
    }

    protected async fetchDataAndUpdateCache() {
        const epochQuery = Prisma.sql`
            SELECT no AS epoch_number, tx_count,
                blk_count AS block_count
            FROM epoch
            ORDER BY no DESC
            LIMIT 1;`;

        interface EpochQueryResult {
            epoch_number: number;
            tx_count: number;
            block_count: number;
            avg_wait_time?: number;
            avg_transaction_per_block?: number;
        }

        const epochResult: EpochQueryResult[] =
            await dbSyncDb.$queryRaw(epochQuery);
        const epoch: EpochQueryResult = epochResult[0];

        epoch.avg_wait_time = await getAverageConfirmationTimeForEpoch(
            epoch.epoch_number
        );
        epoch.avg_transaction_per_block =
            await getAverageTransactionPerBlockForEpoch(epoch.epoch_number);

        // Cache the data in Redis with a short expiration time (e.g., 600 seconds)
        await this.redisManager?.setToCache(
            'currentEpoch',
            JSON.stringify(epoch),
            'EX',
            600
        );

        return epoch;
    }
}

export default EpochController;
