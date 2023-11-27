import { Prisma } from '@prisma/client';
import { Get, Route, Tags } from 'tsoa';

import {
    dbSyncDb,
    discoveryDb,
    getAverageConfirmationTimeForEpoch,
    getAverageTransactionPerBlockForEpoch
} from '../../queries';

@Tags('V1 Mempool')
@Route('/api/v1/mempool')
class EpochController {
    @Get('/size')
    async getMempoolSize() {
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
                size: number;
            }

            const sizeResult: AverageMempoolSizeQueryResult[] =
                await discoveryDb.$queryRaw(avgTxCountQuery);
            return sizeResult;
        } catch (e) {
            console.log('/api/db/mempool/size', e);
        }
    }
}

export default EpochController;
