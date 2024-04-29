import { Prisma } from '@prisma/client';
import { Get, Path, Query, Route, Tags } from 'tsoa';

import { dbSyncDb, discoveryDb } from '../../queries';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';
import environments from '../../config/environment';

@Tags('V1 Pool')
@Route('/api/v1/pool')
class PoolController extends RedisBaseController<any> {
    constructor(cronJobTimeInSeconds: number = 30) {
        super(cronJobTimeInSeconds);
    }

    async _getPoolDistributionAndUpdateCache(weighted: boolean) {
        let poolDistQuery;
        if (!weighted) {
            poolDistQuery = Prisma.sql`
        SELECT tc.pool_id,
        round(sum(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)), 4) AS total_wait_time,
        count(tx_hash) as tx_count
        FROM tx_confirmed tc
        WHERE tc.epoch > ((SELECT max(tx_confirmed.epoch) - 5
                    FROM tx_confirmed))
         AND received_time IS NOT NULL
         AND EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) > 0
        GROUP BY tc.pool_id
        ORDER BY total_wait_time DESC;
                `;
        } else {
            poolDistQuery = Prisma.sql`
            SELECT
            tc.pool_id,
            ROUND(SUM(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)), 4)
                * (1 + LOG(1 + COUNT(tx_hash))) AS total_wait_time_weighted,
            COUNT(tx_hash) AS tx_count
            FROM
                tx_confirmed tc
            WHERE
                tc.epoch > (
                    (SELECT MAX(tx_confirmed.epoch) - 5 FROM tx_confirmed)
                )
                AND received_time IS NOT NULL
                AND EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) > 0
            GROUP BY
                tc.pool_id
            ORDER BY
                total_wait_time_weighted DESC;
                `;
        }



        const poolDistributionResult: any =
            await discoveryDb.$queryRaw(poolDistQuery);
        const pool_id_list = poolDistributionResult.map((v: any) => {
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
            total_wait_time: number;
            tx_count: number;
        }

        const info_result: PoolInfoResult[] =
            await dbSyncDb.$queryRaw(pool_info_query);
        console.log('Numbers of pools fetched from dbsync', info_result.length);

        // insert total_wait_time for each pool in info_result
        info_result.forEach((v) => {
            const pool = poolDistributionResult.find(
                (x: any) => x.pool_id === v.pool_id
            );
            if (pool) {
                v.total_wait_time = pool.total_wait_time;
                v.tx_count = pool.tx_count;
            }
        });

        // sort by total_wait_time desc
        info_result.sort((a, b) => {
            return b.total_wait_time - a.total_wait_time;
        });

        // Find the missing pool_ids from dbsync result
        const pool_ids = info_result.map((v) => {
            return v.pool_id;
        });
        const diff = poolDistributionResult.filter(
            (x: any) => !pool_ids.includes(x.pool_id)
        );
        diff.forEach((v: any) => {
            info_result.push({
                pool_id: v.pool_id,
                ticker_name: 'N/A',
                name: v.pool_id,
                url: '',
                total_wait_time: v.total_wait_time,
                tx_count: v.tx_count,
            });
        });

        if (environments.ENABLE_REDIS_CACHE) {
            // Cache the data in Redis with a short expiration time (e.g., 3600 seconds)
            await this.redisManager?.setToCache(
                weighted ? 'weightedPoolDistribution' : 'poolDistribution',
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
            const data = await this._getPoolDistributionAndUpdateCache(false);
            console.log('[Redis:Pool/Distribution] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/pool/distribution', e);
        }
    }

    @Get('/distribution/weighted')
    async getPoolDistributionWeightage() {
        try {
            if (environments.ENABLE_REDIS_CACHE) {
                // Check if data is cached in Redis
                const cachedData =
                    await this.redisManager?.getFromCache('weightedPoolDistribution');

                if (cachedData) {
                    console.log(
                        '[Redis:Pool/weightedPoolDistribution] Data retrieved from cache'
                    );
                    return JSON.parse(cachedData);
                }
            }

            // If not cached, fetch data and update the cache
            const data = await this._getPoolDistributionAndUpdateCache(true);
            console.log('[Redis:Pool/Distribution] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/pool/distribution', e);
        }
    }

    async _getPoolTimingAndUpdateCache() {
        const poolTimingQuery = Prisma.sql`
        -- Generate a series of intervals
        WITH IntervalSeries AS (SELECT generate_series(0, 140, 10)  AS start_range,
                                       generate_series(10, 140, 10) AS end_range),
        
        -- Compute average wait time for each pool_id and bucket into intervals
             AvgWaitTimePerPool AS (SELECT tc.pool_id,
                                           CASE
                                               WHEN AVG(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)) <= 140 THEN
                                                   CONCAT(
                                                               FLOOR(AVG(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)) / 10) *
                                                               10,
                                                               '-',
                                                               FLOOR(AVG(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)) / 10) *
                                                               10 + 10)
                                               ELSE
                                                   '140+'
                                               END AS wait_interval
                                    FROM tx_confirmed tc
                                    WHERE tc.received_time IS NOT NULL
                                      AND tc.epoch > (SELECT max(tx_confirmed.epoch) - 5 FROM tx_confirmed)
                                    GROUP BY tc.pool_id),
        
        -- Aggregate based on intervals and calculate statistics
             AggregatedData AS (SELECT wait_interval           AS interval_range,
                                       COUNT(pool_id)::integer AS pool_count
                                FROM AvgWaitTimePerPool
                                GROUP BY wait_interval),
        
        -- Generate a full list of intervals
             FullIntervals AS (SELECT CONCAT(start_range, '-', end_range) AS full_interval
                               FROM IntervalSeries
                               WHERE end_range <= 140
                               UNION
                               SELECT '140+')
        
        -- Join with full intervals to ensure all intervals are represented
        SELECT fi.full_interval AS interval_range, COALESCE(ad.pool_count, 0) AS pool_count
        FROM FullIntervals fi
                 LEFT JOIN AggregatedData ad ON fi.full_interval = ad.interval_range
        ORDER BY CASE
                     WHEN fi.full_interval = '140+' THEN 1000 -- Assuming a very large number for sorting purposes
                     ELSE CAST(SPLIT_PART(fi.full_interval, '-', 1) AS INT)
                     END;    
                `;

        interface AverageTransactionTimeQueryResult {
            day: string;
            overall_avg_wait_time: string;
        }

        const poolTimingResult: AverageTransactionTimeQueryResult[] =
            await discoveryDb.$queryRaw(poolTimingQuery);

        if (environments.ENABLE_REDIS_CACHE) {
            // Cache the data in Redis with a short expiration time (e.g., 7200 seconds)
            await this.redisManager?.setToCache(
                'poolTiming',
                JSON.stringify(poolTimingResult),
                'EX',
                7200
            );
        }
        return poolTimingResult;
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
        round(avg(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time)), 2) AS avg_wait_time
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
        limit 10 offset ${(pageNumber - 1) * 10};
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
        -- Generate a series of intervals
        WITH IntervalSeries AS (SELECT generate_series(0, 220, 20)  AS start_range,
                               generate_series(20, 240, 20) AS end_range)

        -- Classify transactions into intervals based on wait times
        , Intervals AS (SELECT CASE
                              WHEN EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) <= 200 THEN
                                  CONCAT(FLOOR(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) / 20) * 20,
                                         '-',
                                         FLOOR(EXTRACT(epoch FROM tc.confirmation_time - tc.received_time) / 20) * 20 +
                                         20)
                              ELSE
                                  '200+'
                              END AS wait_interval,
                          tc.tx_hash
                   FROM tx_confirmed tc
                   WHERE tc.received_time IS NOT NULL
                     AND tc.epoch > (SELECT max(tx_confirmed.epoch) - 5 FROM tx_confirmed)
                     AND tc.pool_id = ${poolId})

        -- Aggregate based on intervals and calculate statistics
        , AggregatedData AS (SELECT wait_interval              AS interval_range,
                               COUNT(tc.tx_hash)::integer AS transaction_count
                        FROM Intervals
                                 LEFT JOIN
                             tx_confirmed tc ON Intervals.tx_hash = tc.tx_hash
                        GROUP BY wait_interval)

        -- Generate a full list of intervals
        , FullIntervals AS (SELECT CONCAT(start_range, '-', end_range) AS full_interval
                       FROM IntervalSeries
                       WHERE end_range <= 200
                       UNION
                       SELECT '200+')

        -- Join with full intervals to ensure all intervals are represented
        SELECT fi.full_interval AS interval_range, COALESCE(ad.transaction_count, 0) AS transaction_count
        FROM FullIntervals fi
                LEFT JOIN
            AggregatedData ad
            ON fi.full_interval = ad.interval_range
        ORDER BY CASE
             WHEN fi.full_interval = '200+' THEN 1000 -- Assuming a very large number for sorting purposes
             ELSE CAST(SPLIT_PART(fi.full_interval, '-', 1) AS INT)
             END;
        `;
        const poolTxTimingResult =
            await discoveryDb.$queryRaw(poolTxTimingQuery);
        return poolTxTimingResult;
    }

    @Get("/{poolId}/timing")
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
        this._getPoolDistributionAndUpdateCache(true)
            .then((r) => r)
            .catch((e) => e);

        this._getPoolDistributionAndUpdateCache(false)
            .then((r) => r)
            .catch((e) => e);

        this._getPoolTimingAndUpdateCache()
            .then((r) => r)
            .catch((e) => e);
    }
}

export default PoolController;
