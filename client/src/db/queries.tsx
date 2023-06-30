import {PrismaClient} from "@prisma/client";
import {toast} from "react-toastify";

const prisma: any = new PrismaClient();
import {Prisma} from '@prisma/client'

export async function getSomeData() {
    try {
        return await prisma.tx_confirmed.findUnique({
            where: {
                tx_hash: Buffer.from("37AEB174C904F9BDB84DCA75856A1316A241C714422E1BF95A1B587214A2BFB8", "hex"),
            },
        })
    } catch (e) {
        console.error("error:", e);
    }
}

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

export async function getAggregrationForLastThreeBlocks() {
    try {
        return await prisma.tx_confirmed.groupBy({
            by: ['epoch'],
            _avg: {
                waitTime: true,
            },
        }).select({
            epoch: true,
            waitTime: true,
        })
            .orderBy({epoch: 'desc'})
            .take(3)
    } catch (e) {
        console.error("error: ", e)
    }
}

export async function closeConnection() {
    await prisma.$disconnect();
}