import { Request as ExpressRequest } from 'express';
import { Get, Query, Route, Tags, Request } from 'tsoa';
import {
    convertBuffersToString,
    convertToTableData
} from '../../utilities/cardanoUtils';
import {
    getArrivalTime,
    getBody,
    getCompeting,
    getConfirmationDetails,
    getFollowups
} from '../../queries';
import { CborTransactionParser } from '../../lib/cborParser';
import {
    addAddressFieldsToResponse,
    fetchTheArrivalTime,
    getTransactionHistoryOfAddress,
    getTransactionHistoryOfPool
} from '../../utilities/txUtils';
import { encode } from 'cbor-x';

@Tags('V1 Transaction')
@Route('/api/v1/tx')
class TxController {
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

            if (req.headers.accept === 'application/json') {
                return convertBuffersToString(data);
            }
            return encode(convertToTableData(data));
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
                arrivalTime: arrivalTime?.received?.toString() ?? 'N/A',
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
}

export default TxController;
