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
