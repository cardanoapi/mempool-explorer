import { NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { encode } from 'cbor-x';
import { parse } from 'url';

import { discoveryDbClient } from '@app/db/prisma';
import { getArrivalTime, getBody, getCompeting, getFollowups } from '@app/db/queries';
import { CborTransactionParser } from '@app/lib/cborparser';
import { convertBuffersToString } from '@app/utils/utils';


async function fetchTheArrivalTime(arr: Array<any>) {
    return Promise.all(
        arr.map(async (item) => {
            const arrivalTime = await getArrivalTime(item.hash);
            return {
                ...item,
                arrivalTime: !!arrivalTime?.received ? arrivalTime.received.toString() : 'N/A'
            };
        })
    );
}

async function getAddressFromTxHashAndIndex(inputId: string, index: number) {
    const hash = Buffer.from(inputId, 'hex');
    const query = Prisma.sql`select address, value from tx_out where hash=${hash} and index=${index}`;
    return discoveryDbClient.$queryRaw(query);
}

async function addAddressFieldsToResponse(parsedTransaction: any) {
    const transactions = parsedTransaction.getTransaction();
    let transactionToAddressObj: any = {};
    if (Array.isArray(transactions.inputs) && !!transactions.inputs.length) {
        for (const input of transactions.inputs) {
            const hash: string = input.hash;
            const index: number = input.index;
            const key = `${hash}#${index}`;
            const value: any = await getAddressFromTxHashAndIndex(hash, index);
            transactionToAddressObj[key] = !!value ? value[0] : '';
        }
    }
    return transactionToAddressObj;
}

/**
 * @swagger
 * /api/v1/tx/{hash}:
 *   get:
 *     summary: get transaction details of a transaction hash
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 *     parameters:
 *       - in: path
 *         name: hash
 *         schema:
 *           type: string
 *         required: true
 *         description: transaction hash of a transaction
 */

export async function GET(req: any) {
    console.log('GET: ', req.url);
    try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname as string;
        const hash = pathname.split('/').pop() as string;
        const txHash = Buffer.from(hash, 'hex');
        let arrivalTime = await getArrivalTime(txHash);
        let txbody = await getBody(txHash);
        const parsedTransaction = new CborTransactionParser(txbody!.txbody!);
        const resolvedTransactionToAddressObj = await addAddressFieldsToResponse(parsedTransaction);
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
        if (req.headers.get('accept') === 'application/json') {
            return NextResponse.json(convertBuffersToString(detail));
        }
        const serializedBuffer = encode(detail);
        const response = new NextResponse(serializedBuffer);
        response.headers.set('Content-Type', 'application/cbor');
        return response;
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}