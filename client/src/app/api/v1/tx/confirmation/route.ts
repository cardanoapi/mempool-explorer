import { NextResponse } from 'next/server';

import { encode } from 'cbor-x';

import environments from '@app/configs/environments';
import { getConfirmationDetails } from '@app/db/queries';
import { getUrlObject } from '@app/utils/cardano-utils';
import { convertBuffersToString } from '@app/utils/utils';

/**
 * @swagger
 * /api/v1/tx/confirmation:
 *   get:
 *     summary: Retrieve the confirmation status of Cardano transactions based on their transaction hashes
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 *     parameters:
 *       - in: query
 *         name: hash
 *         schema:
 *           type: array
 *         required: true
 *         description: An array of transaction hashes to fetch confirmations for
 */

export async function GET(req: any) {
    console.log('GET: ', req.url);
    try {
        const urlObject = getUrlObject(req.url);
        const hashes = urlObject.searchParams.getAll('hash');
        const response = await fetch(environments.API_URL + '/tx/confirmation?' + hashes.map((hash: string) => `hash=${hash}`).join('&'));

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
    }

    // try {
    //     const urlObject = getUrlObject(req.url);
    //     const hashes = urlObject.searchParams.getAll('hash');
    //     const hashbytes = hashes.map((hash: string) => {
    //         return Buffer.from(hash, 'hex');
    //     });
    //     const confirmation = await getConfirmationDetails(hashbytes);
    //     if (req.headers.get('accept') === 'application/json') {
    //         const r = convertBuffersToString(confirmation);
    //         return NextResponse.json(r);
    //     }
    //     const serializedBuffer = encode(confirmation);
    //     const response = new NextResponse(serializedBuffer);
    //     response.headers.set('Content-Type', 'application/cbor');
    //     return response;
    // } catch (e: any) {
    //     console.log(req.url, e);
    //     return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    // }
}
