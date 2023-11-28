import { Prisma } from '@prisma/client';
import { Get, Route, Tags } from 'tsoa';

import { dbSyncDb, discoveryDb } from '../../queries';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';

@Tags('V1 Pool')
@Route('/api/v1/pool')
class PoolController extends RedisBaseController<any> {
    constructor() {
        super();
    }

    async _getPoolDistributionAndUpdateCache() {
        const avgTxCountQuery = Prisma.sql`
                SELECT tc.pool_id,
                    ROUND(AVG(EXTRACT(EPOCH FROM tc.confirmation_time - tl.earliest_received)), 4) AS avg_wait_time
                FROM tx_confirmed tc
                        JOIN (SELECT hash,
                                    MIN(received) AS earliest_received
                            FROM tx_log
                            GROUP BY hash) AS tl ON tl.hash = tc.tx_hash
                WHERE tc.epoch > (SELECT MAX(epoch) - 5 FROM tx_confirmed)
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

        // Cache the data in Redis with a short expiration time (e.g., 600 seconds)
        await this.redisManager?.setToCache(
            'poolDistribution',
            JSON.stringify(info_result),
            'EX',
            600
        );
        return info_result;
    }

    @Get('/distribution')
    async getPoolDistribution() {
        try {
            // Check if data is cached in Redis
            const cachedData =
                await this.redisManager?.getFromCache('poolDistribution');

            if (cachedData) {
                console.log(
                    '[Redis:Pool/Distribution] Data retrieved from cache'
                );
                return JSON.parse(cachedData);
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
                FROM (SELECT DATE_TRUNC('day', tc.confirmation_time)                                        AS day,
                            ROUND(AVG(EXTRACT(EPOCH FROM tc.confirmation_time - tl.earliest_received)), 4) AS avg_wait_time
                    FROM tx_confirmed tc
                            JOIN
                        (SELECT hash,
                                MIN(received) AS earliest_received
                            FROM tx_log
                            GROUP BY hash) AS tl ON tl.hash = tc.tx_hash
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

        // Cache the data in Redis with a short expiration time (e.g., 600 seconds)
        await this.redisManager?.setToCache(
            'poolTiming',
            JSON.stringify(avgTxCountResult),
            'EX',
            600
        );
        return avgTxCountResult;
    }

    @Get('/timing')
    async getPoolTiming() {
        try {
            // Check if data is cached in Redis
            const cachedData =
                await this.redisManager?.getFromCache('poolTiming');

            if (cachedData) {
                console.log('[Redis:Pool/Timing] Data retrieved from cache');
                return JSON.parse(cachedData);
            }

            // If not cached, fetch data and update the cache
            const data = await this._getPoolTimingAndUpdateCache();
            console.log('[Redis:Pool/Timing] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/pool/avg-wait-time', e);
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