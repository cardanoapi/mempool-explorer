import { NextRequest, NextResponse } from 'next/server.js';

import environments from '@app/configs/environments';
import { getLatestMempoolAverageSizes } from '@app/db/queries';

export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest, res: NextResponse) => {
    console.log('GET: ', req.url);
    try {
        let data = await getLatestMempoolAverageSizes();
        console.log('Mempool Size Handler: ', data);
        return data;
    } catch (e: any) {
        console.log(req.url, e);
        return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
    }
};

/**
 * @swagger
 * /api/v1/mempool/size:
 *   get:
 *     summary: Get latest mempool size information
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 */
export async function GET(req: NextRequest, res: NextResponse) {
    console.log('GET: ', req.url);
    try {
        const response = await fetch(environments.API_URL + '/mempool/size');

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}
