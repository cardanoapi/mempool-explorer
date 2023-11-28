import { Prisma } from '@prisma/client';
import { Get, Route, Tags } from 'tsoa';

import { discoveryDb } from '../../queries';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';

@Tags('V1 Mempool')
@Route('/api/v1/mempool')
class MempoolController extends RedisBaseController<any> {
    constructor() {
        super();
    }

    @Get('/size')
    async getMempoolSize() {
        try {
            // Check if data is cached in Redis
            const cachedData =
                await this.redisManager?.getFromCache('mempoolSize');

            if (cachedData) {
                console.log('[Redis:Mempool/Size] Data retrieved from cache');
                return JSON.parse(cachedData);
            }

            // If not cached, fetch data and update the cache
            const data = await this.fetchDataAndUpdateCache();
            console.log('[Redis:Mempool/Size] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/mempool/size', e);
        }
    }

    protected async fetchDataAndUpdateCache() {
        const avgTxCountQuery = Prisma.sql`
                SELECT received_date,
                        previous_size AS size
                FROM (SELECT received_date,
                            type,
                            mempool_size,
                            LAG(mempool_size) OVER (ORDER BY received_date) AS previous_size
                    FROM mempool_log) AS lagged_data
                WHERE received_date >= NOW() - interval '10 minutes'
                AND received_date < NOW()
                AND type = 'remove'
                ORDER BY received_date;
                `;

        interface AverageMempoolSizeQueryResult {
            received_date: string;
            size: number;
        }

        const sizeResult: AverageMempoolSizeQueryResult[] =
            await discoveryDb.$queryRaw(avgTxCountQuery);

        // Cache the data in Redis with a short expiration time (e.g., 600 seconds)
        await this.redisManager?.setToCache(
            'mempoolSize',
            JSON.stringify(sizeResult),
            'EX',
            600
        );
        return sizeResult;
    }
}

export default MempoolController;
