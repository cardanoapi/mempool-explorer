import { discoveryDbClient, dbSyncDbClient } from "./prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { getLatestEpoch } from "@app/utils/cardano-utils";
import { json } from "stream/consumers";

const discoveryDb: PrismaClient = discoveryDbClient;
const dbSyncDb: PrismaClient = dbSyncDbClient;

export async function getTheLatestTransactionEpochOfAddress(pool_id: string) {
    let latestEpoch = await discoveryDb.tx_confirmed.findFirst({
        where: {
            pool_id: pool_id
        },
        orderBy: {
            epoch: "desc"
        },
        select: {
            epoch: true
        }
    });
    return latestEpoch?.epoch;
}

export async function getAddressDetails(address_id: string, epochNo: number, pageNumber: number) {
    try {
        return await discoveryDb.$queryRaw(Prisma.sql`
        select tc.tx_hash, extract ( epoch from tt.wait_time) as wait_time, tc.epoch,tc.block_hash,tc.slot_no,tc.block_no,  tc.confirmation_time from tx_addresses
    join tx_confirmed tc on tx_addresses.tx_hash = tc.tx_hash
    left join tx_timing tt on tt.tx_hash = tc.tx_hash
    where address=${address_id}
    order by tc.confirmation_time desc
    limit 100 offset ${(pageNumber - 1) * 100}
        `)
    } catch (e) {
        console.error("error:", e)
    }
}

export async function getPoolDetails(pool_id: string, epochNo: number, pageNumber: number) {
    try {
        return await discoveryDb.$queryRaw(Prisma.sql`SELECT tc.tx_hash, extract (epoch from ttn.wait_time) as wait_time, tc.epoch, tc.block_hash,tc.slot_no, tc.block_no, tc.confirmation_time from tx_confirmed as tc left join tx_timing as ttn on tc.tx_hash = ttn.tx_hash where pool_id=${pool_id} and epoch=${epochNo} order by confirmation_time desc limit 100 offset ${(pageNumber - 1) * 100}`)
    } catch (e) {
        console.error("error:", e)
    }
}

// function buildQuery(id: string, epoch: number) {
//     if (id.startsWith("pool")) {
//         return `select
//     tc.epoch as epoch ,
//     count(tc.tx_hash) tx_count,
//     extract ( epoch from avg(wait_time))avg_wait_time,
//     extract ( epoch from min(wait_time)) min_wait_time,
//     extract ( epoch from max(wait_time)) max_wait_time,
//     extract ( epoch from (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY wait_time asc ))) median_wait_time,
//     extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time asc ))) best_5_percent,
//     extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time desc ))) worst_5_percent
// from tx_addresses
//          join tx_timing tt on tx_addresses.tx_hash = tt.tx_hash
//          join tx_confirmed tc on tt.tx_hash = tc.tx_hash
// where
//       pool_id = ${id}
//       and epoch < ${epoch}
// group by tc.epoch
// order by  epoch  desc
// limit 3`
//     } else {
//         return `select
//     tc.epoch as epoch ,
//     count(tc.tx_hash) tx_count,
//     extract ( epoch from avg(wait_time))avg_wait_time,
//     extract ( epoch from min(wait_time)) min_wait_time,
//     extract ( epoch from max(wait_time)) max_wait_time,
//     extract ( epoch from (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY wait_time asc ))) median_wait_time,
//     extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time asc ))) best_5_percent,
//     extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time desc ))) worst_5_percent
// from tx_addresses
//          join tx_timing tt on tx_addresses.tx_hash = tt.tx_hash
//          join tx_confirmed tc on tt.tx_hash = tc.tx_hash
// where
//       address = ${id}
//       and epoch < ${epoch}
// group by tc.epoch
// order by  epoch  desc
// limit 3`
//     }
// }

export async function getAggregrationForLastThreeBlocks(id: string) {
    const latestEpoch = getLatestEpoch();
    try {
        if (id.startsWith("pool")) {
            return await discoveryDb.$queryRaw(
                Prisma.sql`
            select tc.epoch as epoch ,
            count(tc.tx_hash) tx_count,
            extract ( epoch from avg(wait_time))avg_wait_time,
            extract ( epoch from min(wait_time)) min_wait_time,
            extract ( epoch from max(wait_time)) max_wait_time,
            extract ( epoch from (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY wait_time asc ))) median_wait_time,
            extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time asc ))) best_5_percent,
            extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time desc ))) worst_5_percent
            from tx_addresses
            join tx_timing tt on tx_addresses.tx_hash = tt.tx_hash
            join tx_confirmed tc on tt.tx_hash = tc.tx_hash
            where
            pool_id = ${id}
            and epoch < ${latestEpoch}
            group by tc.epoch
            order by  epoch  desc
            limit 3
            `
            )
        } else if (id.startsWith("addr")) {
            return await discoveryDb.$queryRaw(
                Prisma.sql`
            select tc.epoch as epoch ,
            count(tc.tx_hash) tx_count,
            extract ( epoch from avg(wait_time))avg_wait_time,
            extract ( epoch from min(wait_time)) min_wait_time,
            extract ( epoch from max(wait_time)) max_wait_time,
            extract ( epoch from (PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY wait_time asc ))) median_wait_time,
            extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time asc ))) best_5_percent,
            extract ( epoch from (PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY wait_time desc ))) worst_5_percent
            from tx_addresses
            join tx_timing tt on tx_addresses.tx_hash = tt.tx_hash
            join tx_confirmed tc on tt.tx_hash = tc.tx_hash
            where
            address = ${id}
            and epoch < ${latestEpoch}
            group by tc.epoch
            order by  epoch  desc
            limit 3
            `
            )
        }
    } catch (e) {
        console.log("aggregration blocks query: ", e)
    }
}


export async function getBody(txHash: Buffer) {
    try {
        return discoveryDb.tx_body.findFirst({
            where: {
                hash: txHash
            }
        });
    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}

export async function getInputsForTxHash(hs: string | Buffer) {
    try {
        let txHash: Buffer = Buffer.alloc(0);
        if (typeof hs === "string") {
            txHash = Buffer.from(hs, 'hex')
        }
        return discoveryDb.tx_in.findMany({
            where: {
                hash: txHash
            }
        });
    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}

// getOutputsCounts
export async function getCompeting(txHash: Buffer) {
    try {
        const inputs: any = await getInputsForTxHash(txHash);
        const hashes: any = [];
        for (const input of inputs) {
            const compHashes = await discoveryDb.tx_in.findMany({
                where: {
                    utxohash: input.utxohash,
                    utxoindex: input.utxoindex,
                    hash: {
                        not: input.hash
                    }
                },
                distinct: ["hash"],
                select: {
                    hash: true
                }
            })
            const competitors = compHashes.map(async (input) => {
                const body = await discoveryDb.tx_body.findUnique({
                    where: {
                        hash: input.hash
                    },
                })
                return { 'hash': input.hash, 'body': body?.txbody, version: body?.version };
            });
            const comp = await Promise.all(competitors);
            hashes.push(...comp);
        }
        return hashes;

    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}

export async function getFollowups(txHash: Buffer) {
    const followHash = await discoveryDb.tx_in.findMany({
        where: {
            utxohash: txHash
        },
        distinct: ["hash"],
        select: {
            hash: true
        }
    });

    const followups = followHash.map(async (input) => {
        const body = await discoveryDb.tx_body.findUnique({
            where: {
                hash: input.hash
            },
        })
        return { 'hash': input.hash, 'body': body?.txbody, 'version': body?.version };
    });
    return await Promise.all(followups);
}

export async function getConfirmation(txHash: Buffer[]) {
    try {
        return discoveryDb.tx_confirmed.findMany({
            where: {
                tx_hash: {
                    in: txHash
                }
            }
        });
    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}

export async function closeConnection() {
    await discoveryDb.$disconnect();
}

export async function getConfirmationDetails(txHashes: Buffer[]) {
    try {
        const query = Prisma.sql` select tx.hash tx_hash ,b.hash  block_hash , b.slot_no  slot_no , ph.view  pool_id
        , b.block_no as block_no,b.time as block_time,b.epoch_no as epoch,
        (select json_agg(distinct tout.address)
                from tx_out tout join tx_in ti
                    on tout.tx_id = ti.tx_out_id and tout.index = ti.tx_out_index
            where ti.tx_in_id = tx.id ) as in_addrs
        from tx join block b on b.id = tx.block_id
        left join slot_leader sl on b.slot_leader_id = sl.id
        left join pool_hash ph on sl.pool_hash_id = ph.id  
        where 
            tx.hash in (${Prisma.join(txHashes)})`;
        return dbSyncDb.$queryRaw(query);
    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}


export async function listConfirmedTransactions(start_date: Date, pool?: string, limit: number = 1000) {
    console.log("listConfirmedTransactions", !!start_date, start_date, pool, limit)
    let query;
    if (pool) {
        query = Prisma.sql`
        select tx.hash tx_hash ,b.hash  block_hash , b.slot_no  slot_no ,
            b.block_no as block_no,b.time as block_time,b.epoch_no as epoch
        from tx join block b on b.id = tx.block_id
            left join slot_leader sl on b.slot_leader_id = sl.id
            left join pool_hash ph on sl.pool_hash_id = ph.id
        where 
            b.time >= ${start_date}
            and 
            ph.view = ${pool}
        order by b.time asc
        limit ${limit};`;
    } else {
        query = Prisma.sql`
        select tx.hash tx_hash ,b.hash  block_hash , b.slot_no  slot_no , ph.view  pool_id
            , b.block_no as block_no,b.time as block_time,b.epoch_no as epoch
        from tx join block b on b.id = tx.block_id
            left join slot_leader sl on b.slot_leader_id = sl.id
            left join pool_hash ph on sl.pool_hash_id = ph.id
        where b.time >= ${start_date}
        order by b.time asc
        limit ${limit};`;
    }


    const results: any[] = await dbSyncDb.$queryRaw(query);
    if (results.length == 0) {
        return []
    }
    const hashes = results.map(x => {
        return x.tx_hash
    })
    results.forEach(r => r.tx_hash = r.tx_hash.toString('hex'))

    const arrival_query = Prisma.sql` select min(received) as arrival_time , hash  from tx_log    
            where  hash in (${Prisma.join(hashes)})  group by hash `;

    interface QueryResult {
        hash: Buffer;
        arrival_time: Date
    }
    const arrival_times: QueryResult[] = await discoveryDb.$queryRaw(arrival_query)

    const lookup: Record<string, Date> = {}
    arrival_times.map((v: any) => {
        lookup[v.hash.toString('hex')] = v.arrival_time
    })

    return results.map((v) => {
        return {
            ...v,
            arrival_time: lookup[v.tx_hash]?.toISOString()
        }
    })
}

export async function getArrivalTime(txHash: Buffer) {
    try {
        return discoveryDb.tx_log.findFirst({
            where: {
                hash: txHash
            },
            select: {
                received: true,
            },
            orderBy: {
                received: "asc"
            }
        });
    } catch (e) {
        console.log("/api/db/transaction", e)
    }
}

export async function getCurrentEpochInfo() {
    try {
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
        const epochResult: EpochQueryResult[] = await dbSyncDb.$queryRaw(epochQuery);
        const epoch: EpochQueryResult = epochResult[0];

        epoch.avg_wait_time = await getAverageConfirmationTimeForEpoch(epoch.epoch_number);
        epoch.avg_transaction_per_block = await getAverageTransactionPerBlockForEpoch(epoch.epoch_number);

        return epoch


    } catch (e) {
        console.log("/api/db/epoch", e)
    }
}

export async function getAverageConfirmationTimeForEpoch(epoch: number) {
    try {
        const avgWaitTimeQuery = Prisma.sql`
        SELECT AVG(EXTRACT(EPOCH FROM (tc.confirmation_time - tl.earliest_received))) AS avg_wait_time
        FROM tx_confirmed tc JOIN (SELECT hash,
            MIN(received) AS earliest_received
            FROM tx_log
            GROUP BY hash) AS tl ON tc.tx_hash = tl.hash
        WHERE epoch = ${epoch}
        `;
        interface AvgWaitTimeQueryResult {
            avg_wait_time: string;
        }
        const avgWaitTimeResult: AvgWaitTimeQueryResult[] = await discoveryDb.$queryRaw(avgWaitTimeQuery);
        return parseFloat(avgWaitTimeResult[0].avg_wait_time);
    } catch (e) {
        console.log("/api/db/epoch/avg-wait-time", e)
    }
}

export async function getAverageTransactionPerBlockForEpoch(epoch: number) {
    try {
        const avgTxCountQuery = Prisma.sql`
        SELECT AVG(tx_count) AS avg_transaction_count
        FROM block
        WHERE epoch_no = ${epoch};
        `;
        interface AverageTransactionCountQueryResult {
            avg_transaction_count: string;
        }
        const avgTxCountResult: AverageTransactionCountQueryResult[] = await dbSyncDb.$queryRaw(avgTxCountQuery);
        return Math.round(parseFloat(avgTxCountResult[0].avg_transaction_count));
    } catch (e) {
        console.log("/api/db/epoch/avg-wait-time", e)
    }
}

export async function getAverageTransactionTimeForLastSevenDays() {
    try {
        const avgTxCountQuery = Prisma.sql`
        SELECT DATE_TRUNC('day', tc.confirmation_time) AS day,
        AVG(EXTRACT(EPOCH FROM (tc.confirmation_time - tl.earliest_received))) AS avg_wait_time
        FROM tx_confirmed tc JOIN (SELECT hash,
            MIN(received) AS earliest_received
            FROM tx_log
            GROUP BY hash) AS tl ON tc.tx_hash = tl.hash
        WHERE tc.confirmation_time > CURRENT_TIMESTAMP AT TIME ZONE 'UTC' - INTERVAL '6 days'
        GROUP BY day
        ORDER BY day;
        `;
        interface AverageTransactionTimeQueryResult {
            day: string;
            avg_wait_time: string
        }
        const avgTxCountResult: AverageTransactionTimeQueryResult[] = await discoveryDb.$queryRaw(avgTxCountQuery);
        return avgTxCountResult;
    } catch (e) {
        console.log("/api/db/epoch/avg-wait-time", e)
    }
}

export async function getLatestMempoolAverageSizes() {
    try {
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
            size: number
        }
        const sizeResult: AverageMempoolSizeQueryResult[] = await discoveryDb.$queryRaw(avgTxCountQuery);
        return sizeResult;
    } catch (e) {
        console.log("/api/db/mempool/size", e)
    }
}

export async function getPoolDistributionGroup() {
    try {
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
            avg_wait_time: number
        }
        const poolDistributionResult: PoolDistributionQueryResult[] = await discoveryDb.$queryRaw(avgTxCountQuery);
        const pool_id_list = poolDistributionResult.map((v) => {
            return v.pool_id
        });

        console.log("Numbers of pools fetched from discovery db", pool_id_list.length)

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
            ticker_name: string
            name: String,
            url: String,
            avg_wait_time: number
        }
        const info_result: PoolInfoResult[] = await dbSyncDb.$queryRaw(pool_info_query);
        console.log("Numbers of pools fetched from dbsync", info_result.length)

        // insert avg_wait_time for each pool in info_result
        info_result.forEach((v) => {
            const pool = poolDistributionResult.find((x) => x.pool_id === v.pool_id);
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
            return v.pool_id
        });
        const diff = poolDistributionResult.filter(x => !pool_ids.includes(x.pool_id));
        diff.forEach((v) => {
            info_result.push({
                pool_id: v.pool_id,
                ticker_name: "N/A",
                name: v.pool_id,
                url: "",
                avg_wait_time: v.avg_wait_time
            })
        });
        return info_result
    } catch (e) {
        console.log("/api/db/mempool/size", e)
    }
}



export async function getAveragePoolConfirmTimeForLastSevenDays() {
    try {
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
            overall_avg_wait_time: string
        }
        const avgTxCountResult: AverageTransactionTimeQueryResult[] = await discoveryDb.$queryRaw(avgTxCountQuery);
        return avgTxCountResult;
    } catch (e) {
        console.log("/api/db/epoch/avg-wait-time", e)
    }
}