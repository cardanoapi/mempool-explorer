import { NextResponse } from 'next/server';


import environments from '@app/configs/environments';
import { getUrlObject } from '@app/utils/cardano-utils';


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
    try {
        const urlObject = getUrlObject(req.url);
        const id = urlObject.searchParams.get('query') as string;
        const pageNumber = parseInt(urlObject.searchParams.get('pageNumber') as string);
        const response = await fetch(environments.API_URL + '/tx?query=' + id + '&pageNumber=' + pageNumber);

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}

