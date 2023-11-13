import { NextResponse } from 'next/server';

import { encode } from 'cbor-x';

import { getAddressDetails, getPoolDetails, getTheLatestTransactionEpochOfAddress } from '@app/db/queries';
import { convertToTableData, getLatestEpoch, getUrlObject } from '@app/utils/cardano-utils';
import { convertBuffersToString } from '@app/utils/utils';

async function getTransactionHistoryOfPool(id: string, pageNumber: number) {
    const latestEpoch = await getTheLatestTransactionEpochOfAddress(id);
    if (latestEpoch != null) return await getPoolDetails(id, latestEpoch, pageNumber);
}

async function getTransactionHistoryOfAddress(id: string, pageNumber: number) {
    const latestEpoch = getLatestEpoch();
    return await getAddressDetails(id, latestEpoch, pageNumber);
}

/**
 * @swagger
 * /api/v1/tx:
 *   get:
 *     summary: get transaction list of address or pool
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The identifier for the address or pool.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number for pagination
 */
export async function GET(req: Request) {
    console.log('GET: ', req.url);
    const urlObject = getUrlObject(req.url);
    const id = urlObject.searchParams.get('query') as string;
    const pageNumber = parseInt(urlObject.searchParams.get('pageNumber') as string);
    let data: any;
    try {
        if (id.startsWith('pool')) {
            data = await getTransactionHistoryOfPool(id, pageNumber);
        } else {
            data = await getTransactionHistoryOfAddress(id, pageNumber);
        }
        if (req.headers.get('accept') === 'application/json') {
            const r = convertBuffersToString(data);
            return NextResponse.json(r);
        }
        const serializedBuffer = encode(convertToTableData(data));
        const response = new NextResponse(serializedBuffer);
        response.headers.set('Content-Type', 'application/cbor');
        return response;
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}

async function listTransactions() {}
