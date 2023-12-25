import { NextRequest, NextResponse } from 'next/server';


import environments from '@app/configs/environments';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/v1/tx/stats:
 *   get:
 *     summary: Get aggregation or statistics of the last three blocks of queried pool or address
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
 *         description: The identifier for the address or pool
 */

export async function GET(req: NextRequest, res: NextResponse) {
    console.log('GET: ', req.url);
    try {
        const response = await fetch(environments.API_URL + '/tx/stats');

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}
