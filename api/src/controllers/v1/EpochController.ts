import { Prisma } from '@prisma/client';
import { Get, Route, Tags } from 'tsoa';

import {
    dbSyncDb,
    getAverageConfirmationTimeForEpoch,
    getAverageTransactionPerBlockForEpoch
} from '../../queries';

@Tags('V1 Epoch')
@Route('/api/v1/epoch')
class EpochController {
    @Get('/current')
    async getCurrentEpoch() {
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

            const epochResult: EpochQueryResult[] =
                await dbSyncDb.$queryRaw(epochQuery);
            const epoch: EpochQueryResult = epochResult[0];

            epoch.avg_wait_time = await getAverageConfirmationTimeForEpoch(
                epoch.epoch_number
            );
            epoch.avg_transaction_per_block =
                await getAverageTransactionPerBlockForEpoch(epoch.epoch_number);

            return epoch;
        } catch (e) {
            console.log('/api/db/epoch', e);
        }
    }
}

export default EpochController;
