import { Prisma, PrismaClient } from '@prisma/client';

import { dbSyncDbClient, discoveryDbClient } from './prisma';

export const discoveryDb: PrismaClient = discoveryDbClient;
export const dbSyncDb: PrismaClient = dbSyncDbClient;

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

        const avgWaitTimeResult: AvgWaitTimeQueryResult[] =
            await discoveryDb.$queryRaw(avgWaitTimeQuery);
        return parseFloat(avgWaitTimeResult[0].avg_wait_time);
    } catch (e) {
        console.log('/api/db/epoch/avg-wait-time', e);
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

        const avgTxCountResult: AverageTransactionCountQueryResult[] =
            await dbSyncDb.$queryRaw(avgTxCountQuery);
        return Math.round(
            parseFloat(avgTxCountResult[0].avg_transaction_count)
        );
    } catch (e) {
        console.log('/api/db/epoch/avg-wait-time', e);
    }
}

export async function getTheLatestTransactionEpochOfAddress(pool_id: string) {
    let latestEpoch = await discoveryDb.tx_confirmed.findFirst({
        where: {
            pool_id: pool_id
        },
        orderBy: {
            epoch: 'desc'
        },
        select: {
            epoch: true
        }
    });
    return latestEpoch?.epoch;
}

export async function getPoolDetails(
    pool_id: string,
    epochNo: number,
    pageNumber: number
) {
    try {
        return await discoveryDb.$queryRaw(
            Prisma.sql`SELECT tc.tx_hash, extract (epoch from ttn.wait_time) as wait_time, tc.epoch, tc.block_hash,tc.slot_no, tc.block_no, tc.confirmation_time from tx_confirmed as tc left join tx_timing as ttn on tc.tx_hash = ttn.tx_hash where pool_id=${pool_id} and epoch=${epochNo} order by confirmation_time desc limit 100 offset ${
                (pageNumber - 1) * 100
            }`
        );
    } catch (e) {
        console.error('error:', e);
    }
}

export async function getAddressDetails(
    address_id: string,
    epochNo: number,
    pageNumber: number
) {
    try {
        return await discoveryDb.$queryRaw(Prisma.sql`
                select tc.tx_hash, extract ( epoch from tt.wait_time) as wait_time, tc.epoch,tc.block_hash,tc.slot_no,tc.block_no,  tc.confirmation_time from tx_addresses
            join tx_confirmed tc on tx_addresses.tx_hash = tc.tx_hash
            left join tx_timing tt on tt.tx_hash = tc.tx_hash
            where address=${address_id}
            order by tc.confirmation_time desc
            limit 100 offset ${(pageNumber - 1) * 100}
        `);
    } catch (e) {
        console.error('error:', e);
    }
}

export async function getArrivalTime(txHash: Buffer) {
    try {
        return discoveryDb.tx_log.findFirst({
            where: {
                hash: txHash
            },
            select: {
                received: true
            },
            orderBy: {
                received: 'asc'
            }
        });
    } catch (e) {
        console.log('/api/db/transaction', e);
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
        console.log('/api/db/transaction', e);
    }
}

export async function getFollowups(txHash: Buffer) {
    const followHash = await discoveryDb.tx_in.findMany({
        where: {
            utxohash: txHash
        },
        distinct: ['hash'],
        select: {
            hash: true
        }
    });

    const followups = followHash.map(async (input) => {
        const body = await discoveryDb.tx_body.findUnique({
            where: {
                hash: input.hash
            }
        });
        return { hash: input.hash, body: body?.txbody, version: body?.version };
    });
    return await Promise.all(followups);
}

export async function getInputsForTxHash(hs: string | Buffer) {
    try {
        let txHash: Buffer = Buffer.alloc(0);
        if (typeof hs === 'string') {
            txHash = Buffer.from(hs, 'hex');
        }
        return discoveryDb.tx_in.findMany({
            where: {
                hash: txHash
            }
        });
    } catch (e) {
        console.log('/api/db/transaction', e);
    }
}

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
                distinct: ['hash'],
                select: {
                    hash: true
                }
            });
            const competitors = compHashes.map(async (input) => {
                const body = await discoveryDb.tx_body.findUnique({
                    where: {
                        hash: input.hash
                    }
                });
                return {
                    hash: input.hash,
                    body: body?.txbody,
                    version: body?.version
                };
            });
            const comp = await Promise.all(competitors);
            hashes.push(...comp);
        }
        return hashes;
    } catch (e) {
        console.log('/api/db/transaction', e);
    }
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
        console.log('/api/db/transaction', e);
    }
}
