import { Request as ExpressRequest, Response } from 'express';
import { Get, Query, Route, Tags, Request, Res } from 'tsoa';
import {
    convertBuffersToString,
    convertToTableData,
    getUrlObject,
    transformToClientSideData
} from '../../utilities/cardanoUtils';
import {
    discoveryDb,
    getAggregrationForLastThreeBlocks,
    getArrivalTime,
    getBody,
    getCompeting,
    getConfirmationDetails,
    getFollowups,
    listConfirmedTransactions
} from '../../queries';
import { CborTransactionParser } from '../../lib/cborParser';
import {
    addAddressFieldsToResponse,
    fetchTheArrivalTime,
    getTransactionHistoryOfAddress,
    getTransactionHistoryOfPool
} from '../../utilities/txUtils';
import { encode } from 'cbor-x';
import { Prisma } from '@prisma/client';
import { RedisBaseController } from '../../baseControllers/RedisBaseController';
import environments from '../../config/environment';

@Tags('V1 Transaction')
@Route('/api/v1/tx')
class TxController extends RedisBaseController<any> {
    constructor(cronJobTimeInSeconds: number = 40) {
        super(cronJobTimeInSeconds);
    }

    @Get('')
    public async getTxList(
        @Request() req: ExpressRequest,
        @Query() query: string,
        @Query() pageNumber: number
    ): Promise<any> {
        try {
            let data: any;

            if (query.startsWith('pool')) {
                data = await getTransactionHistoryOfPool(query, pageNumber);
            } else {
                data = await getTransactionHistoryOfAddress(query, pageNumber);
            }
            return convertToTableData(data);
        } catch (e: any) {
            console.error(req.url, e);
        }
    }

    @Get('/:hash')
    public async getTxDetails(@Route() hash: string): Promise<any> {
        try {
            const txHash = Buffer.from(hash, 'hex');
            let arrivalTime = await getArrivalTime(txHash);
            let txbody = await getBody(txHash);
            const parsedTransaction = new CborTransactionParser(
                txbody!.txbody!
            );
            const resolvedTransactionToAddressObj =
                await addAddressFieldsToResponse(parsedTransaction);
            let followups = await getFollowups(txHash);
            followups = await fetchTheArrivalTime(followups);
            let competing = await getCompeting(txHash);
            competing = await fetchTheArrivalTime(competing);
            const detail = {
                tx: txbody,
                arrivalTime: arrivalTime?.received_time ?? 'N/A',
                followups,
                competing,
                inputAddress: resolvedTransactionToAddressObj,
                fee: parsedTransaction.getFee()
            };
            return convertBuffersToString(detail);
        } catch (e: any) {
            console.error('/api/db/tx/{hash}', e);
        }
    }

    @Get('/confirmation')
    async getConfirmationDetails(
        @Request() req: ExpressRequest,
        @Query('hash') hash: string[]
    ) {
        try {
            const hashBytes = hash.map((hash: string) =>
                Buffer.from(hash, 'hex')
            );
            const confirmation = await getConfirmationDetails(hashBytes);

            if (req.headers.accept === 'application/json') {
                return convertBuffersToString(confirmation);
            }

            return encode(confirmation);
        } catch (e: any) {
            console.error(req.url, e);
        }
    }

    @Get('/confirmed')
    async getConfirmedTransactions(
        @Request() req: ExpressRequest,
        @Query('from') from: string,
        @Query('pool') pool?: string,
        @Query('limit') limit?: number
    ): Promise<any> {
        if (!from) {
            throw new Error('Required parameter from is missing');
        }

        if (pool && !pool.startsWith('pool')) {
            throw new Error('Invalid pool format');
        }

        const startDate = Date.parse(from);
        if (isNaN(startDate)) {
            throw new Error(
                `Invalid date format. Valid example: ${new Date().toISOString()}`
            );
        }

        const parsedLimit = parseInt(<string>limit?.toString()) || 100;
        if (parsedLimit > 1000 || parsedLimit < 0) {
            throw new Error('Range for limit is (10,1000)');
        }

        try {
            const result = await listConfirmedTransactions(
                new Date(startDate),
                pool,
                parsedLimit
            );
            return convertBuffersToString(result);
        } catch (e: any) {
            console.error(req.url, e);
        }
    }

    @Get('/stats')
    async getTxStats(
        @Request() req: ExpressRequest,
        @Query('query') id: string
    ): Promise<any> {
        try {
            let data = await getAggregrationForLastThreeBlocks(id);
            const transformedData = await transformToClientSideData(data);
            return transformedData
        } catch (e: any) {
            console.error(req.url, e);
        }
    }

    @Get('/timing')
    async getTxTiming(): Promise<any> {
        try {
            if (environments.ENABLE_REDIS_CACHE) {
                // Check if data is cached in Redis
                const cachedData =
                    await this.redisManager?.getFromCache('txTiming');

                if (cachedData) {
                    console.log('[Redis:Tx/Timing] Data retrieved from cache');
                    return JSON.parse(cachedData);
                }
            }

            // If not cached, fetch data and update the cache
            const data = await this.fetchDataAndUpdateCache();
            console.log('[Redis:Tx/Timing] Data fetched and cached');
            return data;
        } catch (e) {
            console.log('/api/db/epoch/avg-wait-time', e);
        }
    }

    protected async fetchDataAndUpdateCache() {
        const avgTxCountQuery = Prisma.sql`
                SELECT DATE_TRUNC('day', tc.confirmation_time) AS day,
                AVG(EXTRACT(EPOCH FROM (tc.confirmation_time - tc.received_time))) AS avg_wait_time
                FROM tx_confirmed tc
                WHERE tc.confirmation_time > CURRENT_TIMESTAMP AT TIME ZONE 'UTC' - INTERVAL '6 days'
                GROUP BY day
                ORDER BY day;
                `;

        const result = await discoveryDb.$queryRaw(avgTxCountQuery);

        if (environments.ENABLE_REDIS_CACHE) {
            // Cache the data in Redis with a short expiration time (e.g., 7200 seconds)
            await this.redisManager?.setToCache(
                'txTiming',
                JSON.stringify(result),
                'EX',
                7200
            );
        }
        return result;
    }
}

export default TxController;
