import { Prisma } from '@prisma/client';
import { Get, Path, Query, Route, Tags } from 'tsoa';

import { dbSyncDb, discoveryDb } from '../../queries';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';
import environments from '../../config/environment';

@Tags('V1 Pool')
@Route('/api/v1/pool')
class PoolController extends RedisBaseController<any> {
    constructor(cronJobTimeInSeconds: number = 120) {
        super(cronJobTimeInSeconds);
    }

    async _getPoolDistributionAndUpdateCache() {
        const avgTxCountQuery = Prisma.sql`
        SELECT tc.pool_id,
        round(avg(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)), 4) AS avg_wait_time
        FROM tx_confirmed tc
        WHERE tc.epoch > ((SELECT max(tx_confirmed.epoch) - 5
                    FROM tx_confirmed))
         AND received_time IS NOT NULL
        GROUP BY tc.pool_id
        ORDER BY avg_wait_time DESC;
                `;

        interface PoolDistributionQueryResult {
            pool_id: string;
            avg_wait_time: number;
        }

        const poolDistributionResult: PoolDistributionQueryResult[] =
            await discoveryDb.$queryRaw(avgTxCountQuery);
        const pool_id_list = poolDistributionResult.map((v) => {
            return v.pool_id;
        });

        console.log(
            'Numbers of pools fetched from discovery db',
            pool_id_list.length
        );

        const pool_info_query = Prisma.sql` 
                SELECT ph.view AS pool_id,
                    pod.ticker_name AS ticker_name,
                    pod.json->'name' AS name,
                    pod.json->'homepage' AS url
                FROM pool_hash ph
                JOIN (SELECT max(id) as pod_id, pool_id as latest_id
                      FROM pool_offline_data
                      GROUP BY pool_id) as max_pod
                     ON ph.id = max_pod.latest_id
                JOIN pool_offline_data pod ON pod.id = max_pod.pod_id
                WHERE  view IN (${Prisma.join(pool_id_list)})`;

        interface PoolInfoResult {
            pool_id: string;
            ticker_name: string;
            name: String;
            url: String;
            avg_wait_time: number;
        }

        const info_result: PoolInfoResult[] =
            await dbSyncDb.$queryRaw(pool_info_query);
        console.log('Numbers of pools fetched from dbsync', info_result.length);

        // insert avg_wait_time for each pool in info_result
        info_result.forEach((v) => {
            const pool = poolDistributionResult.find(
                (x) => x.pool_id === v.pool_id
            );
            if (pool) {
                v.avg_wait_time = pool.avg_wait_time;
            }
        });

        // sort by avg_wait_time desc
        info_result.sort((a, b) => {
            return b.avg_wait_time - a.avg_wait_time;
        });

        // Find the missing pool_ids from dbsync result
        const pool_ids = info_result.map((v) => {
            return v.pool_id;
        });
        const diff = poolDistributionResult.filter(
            (x) => !pool_ids.includes(x.pool_id)
        );
        diff.forEach((v) => {
            info_result.push({
                pool_id: v.pool_id,
                ticker_name: 'N/A',
                name: v.pool_id,
                url: '',
                avg_wait_time: v.avg_wait_time
            });
        });

        if (environments.ENABLE_REDIS_CACHE) {
            // Cache the data in Redis with a short expiration time (e.g., 3600 seconds)
            await this.redisManager?.setToCache(
                'poolDistribution',
                JSON.stringify(info_result),
                'EX',
                3600
            );
        }
        return info_result;
    }

    @Get('/distribution')
    async getPoolDistribution() {
        try {
            if (environments.ENABLE_REDIS_CACHE) {
                // Check if data is cached in Redis
                const cachedData =
                    await this.redisManager?.getFromCache('poolDistribution');

                if (cachedData) {
                    console.log(
                        '[Redis:Pool/Distribution] Data retrieved from cache'
                    );
                    return JSON.parse(cachedData);
                }
            }

            // If not cached, fetch data and update the cache
            const data = await this._getPoolDistributionAndUpdateCache();
            console.log('[Redis:Pool/Distribution] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/pool/distribution', e);
        }
    }

    async _getPoolTimingAndUpdateCache() {
        const avgTxCountQuery = Prisma.sql`
        SELECT day,
        AVG(avg_wait_time) AS overall_avg_wait_time
        FROM (SELECT DATE_TRUNC('day', tc.confirmation_time)                                    AS day,
              ROUND(AVG(EXTRACT(EPOCH FROM tc.confirmation_time - tc.received_time)), 4) AS avg_wait_time
        FROM tx_confirmed tc
        WHERE tc.confirmation_time >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY day, tc.pool_id
        ORDER BY day DESC, avg_wait_time DESC) AS k
        GROUP BY day
        ORDER BY day;
                `;

        interface AverageTransactionTimeQueryResult {
            day: string;
            overall_avg_wait_time: string;
        }

        const avgTxCountResult: AverageTransactionTimeQueryResult[] =
            await discoveryDb.$queryRaw(avgTxCountQuery);

        if (environments.ENABLE_REDIS_CACHE) {
            // Cache the data in Redis with a short expiration time (e.g., 7200 seconds)
            await this.redisManager?.setToCache(
                'poolTiming',
                JSON.stringify(avgTxCountResult),
                'EX',
                7200
            );
        }
        return avgTxCountResult;
    }

    @Get('/timing')
    async getPoolTiming() {
        try {
            if (environments.ENABLE_REDIS_CACHE) {
                // Check if data is cached in Redis
                const cachedData =
                    await this.redisManager?.getFromCache('poolTiming');

                if (cachedData) {
                    console.log(
                        '[Redis:Pool/Timing] Data retrieved from cache'
                    );
                    return JSON.parse(cachedData);
                }
            }

            // If not cached, fetch data and update the cache
            const data = await this._getPoolTimingAndUpdateCache();
            console.log('[Redis:Pool/Timing] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/pool/', e);
        }
    }

    async _getPoolEpochInfo(poolId: string) {
        const poolEpochInfoQuery = Prisma.sql`
        SELECT tc.epoch,
        count(tx_hash)::integer as tx_count,
        round(avg(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)), 4) AS avg_wait_time
        FROM tx_confirmed tc
        WHERE tc.epoch > ((SELECT max(tx_confirmed.epoch) - 5
                    FROM tx_confirmed))
        AND received_time IS NOT NULL
        AND pool_id = ${poolId}
        GROUP BY epoch
        ORDER BY epoch DESC;
        `;
        const poolEpochInfoResult = await discoveryDb.$queryRaw(poolEpochInfoQuery);
        console.log(poolEpochInfoResult);
        return poolEpochInfoResult;
    }

    @Get("/{poolId}/epoch")
    async getPoolEpochInfo(
        @Path("poolId") poolId: string
    ) {
        console.log("here")
        try {
            const data = await this._getPoolEpochInfo(poolId);
            return data;
        } catch (e) {
            console.log('/api/db/pool/', e);
        }
    }

    async _getPoolTransactions(poolId: string, pageNumber: number) {
        const poolEpochInfoQuery = Prisma.sql`
        SELECT encode(tx_hash,'hex') AS tx_hash,
        epoch,
        slot_no,
        block_no,
        received_time,
        confirmation_time,
        EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) AS wait_time
        FROM tx_confirmed tc
        WHERE pool_id = ${poolId}
        ORDER BY confirmation_time DESC
        limit 100 offset ${(pageNumber - 1) * 100};
        `;
        const poolTransactionsResult =
            await discoveryDb.$queryRaw(poolEpochInfoQuery);
        return poolTransactionsResult;
    }

    @Get("/{poolId}/transactions")
    async getPoolTransactions(
        @Path() poolId: string,
        @Query() pageNumber: number
    ) {
        try {
            const data = await this._getPoolTransactions(poolId, pageNumber);
            return data;
        } catch (e) {
            console.log('/api/db/pool/', e);
        }
    }

    async _getPoolTransactionTiming(poolId: string) {
        const poolTxTimingQuery = Prisma.sql`
        -- Generate series of intervals
        WITH IntervalSeries AS (SELECT generate_series(0, 200, 20)  AS start_range,
                                       generate_series(20, 200, 20) AS end_range)
        
        -- Classify transactions into intervals based on wait times
           , Intervals AS (SELECT CASE
                                      WHEN EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) BETWEEN start_range AND end_range
                                          THEN
                                          CONCAT(start_range, '-', end_range)
                                      ELSE '200+'
                                      END AS wait_interval,
                                  tc.tx_hash
                           FROM tx_confirmed tc
                                    JOIN IntervalSeries iss
                                         ON EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) BETWEEN iss.start_range AND iss.end_range
                           WHERE EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) > 0
                             AND tc.epoch > (SELECT max(tx_confirmed.epoch) - 5 FROM tx_confirmed)
                             AND tc.pool_id = ${poolId})
        
        -- Aggregate based on intervals and calculate statistics
        SELECT wait_interval                                                    AS interval_range,
               COUNT(tc.tx_hash)::integer                                       AS transaction_count
        FROM Intervals
                 LEFT JOIN tx_confirmed tc ON Intervals.tx_hash = tc.tx_hash
        GROUP BY wait_interval
        ORDER BY MIN(CASE
                         WHEN wait_interval = '200+' THEN 1000 -- Assuming a very large number for sorting purposes
                         ELSE CAST(SPLIT_PART(wait_interval, '-', 1) AS INT)
            END);
        
        `;
        const poolTxTimingResult =
            await discoveryDb.$queryRaw(poolTxTimingQuery);
        return poolTxTimingResult;
    }

    @Get("/{poolId}/transaction-timing")
    async getPoolTransactionTiming(
        @Path() poolId: string,
    ) {
        try {
            const data = await this._getPoolTransactionTiming(poolId);
            return data;
        } catch (e) {
            console.log('/api/db/pool/', e);
        }
    }


    protected async fetchDataAndUpdateCache() {
        this._getPoolDistributionAndUpdateCache()
            .then((r) => r)
            .catch((e) => e);
        this._getPoolTimingAndUpdateCache()
            .then((r) => r)
            .catch((e) => e);
    }
}

export default PoolController;
