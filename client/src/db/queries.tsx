import {dbClient, syncClient} from "./prisma";
import {Prisma, PrismaClient} from "@prisma/client";
import {getLatestEpoch} from "@app/utils/cardano-utils";

const prisma: PrismaClient = dbClient;
const sync: PrismaClient = syncClient;

export async function getTheLatestTransactionEpochOfAddress(pool_id: string) {
    let latestEpoch = await prisma.tx_confirmed.findFirst({
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
        return await prisma.$queryRaw(Prisma.sql`
        select tc.tx_hash, extract ( epoch from tt.wait_time) as wait_time, tc.epoch,tc.block_hash,tc.slot_no,tc.block_no,  tc.confirmation_time from tx_addresses
    join tx_confirmed tc on tx_addresses.tx_hash = tc.tx_hash
    left join tx_timing tt on tt.tx_hash = tc.tx_hash
    where address=${address_id}
    order by tc.confirmation_time desc
    limit 100 offset ${(pageNumber-1) * 100}
        `)
    } catch (e) {
        console.error("error:", e)
    }
}

export async function getPoolDetails(pool_id: string, epochNo: number, pageNumber: number) {
    try {
        return await prisma.$queryRaw(Prisma.sql`SELECT tc.tx_hash, extract (epoch from ttn.wait_time) as wait_time, tc.epoch, tc.block_hash,tc.slot_no, tc.block_no, tc.confirmation_time from tx_confirmed as tc left join tx_timing as ttn on tc.tx_hash = ttn.tx_hash where pool_id=${pool_id} and epoch=${epochNo} order by confirmation_time desc limit 100 offset ${(pageNumber-1) * 100}`)
    } catch (e) {
        console.error("error:", e)
    }
}

function buildQuery(id: string, epoch: number) {
    if (id.startsWith("pool")) {
        return `select
    tc.epoch as epoch ,
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
      and epoch < ${epoch}
group by tc.epoch
order by  epoch  desc
limit 3`
    } else {
        return `select
    tc.epoch as epoch ,
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
      and epoch < ${epoch}
group by tc.epoch
order by  epoch  desc
limit 3`
    }
}

export async function getAggregrationForLastThreeBlocks(id: string) {
    const latestEpoch = getLatestEpoch();
    try {
        if (id.startsWith("pool")) {
            return await prisma.$queryRaw(
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
            return await prisma.$queryRaw(
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
        return prisma.tx_body.findFirst({
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
        return prisma.tx_in.findMany({
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
            const compHashes = await prisma.tx_in.findMany({
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
                const body = await prisma.tx_body.findUnique({
                    where: {
                        hash: input.hash
                    },
                })
                return {'hash': input.hash, 'body': body?.txbody, version: body?.version};
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
    const followHash = await prisma.tx_in.findMany({
        where: {
            utxohash: txHash
        },
        distinct: ["hash"],
        select: {
            hash: true
        }
    });

    const followups = followHash.map(async (input) => {
        const body = await prisma.tx_body.findUnique({
            where: {
                hash: input.hash
            },
        })
        return {'hash': input.hash, 'body': body?.txbody, 'version': body?.version};
    });
    return await Promise.all(followups);
}

export async function getConfirmation(txHash: Buffer[]) {
    try {
        return prisma.tx_confirmed.findMany({
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
    await prisma.$disconnect();
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
        return sync.$queryRaw(query);

    } catch (e) {
        // return prisma.
        console.log("/api/db/transaction", e)
    }
}

export async function getArrivalTime(txHash: Buffer) {
    try {
        return prisma.tx_log.findFirst({
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