import { NextRequest, NextResponse } from 'next/server';

import { redisMiddleware, withCaching } from '@app/app/middleware';
import environments from '@app/configs/environments';
import { getAverageTransactionTimeForLastSevenDays } from '@app/db/queries';

export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest, res: NextResponse) => {
    console.log('GET: ', req.url);
    try {
        let data = await getAverageTransactionTimeForLastSevenDays();
        console.log('Transaction Timing Handler: ', data);
        return data;
    } catch (e: any) {
        console.log(req.url, e);
        return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
    }
};

/**
 * @swagger
 * /api/v1/tx/timing:
 *   get:
 *     summary: Get transaction timing related information for last 7 days
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 */

export async function GET(req: NextRequest, res: NextResponse) {
    // const data = await redisMiddleware(req, res, withCaching(handler));
    // return NextResponse.json(data);

    console.log('GET: ', req.url);
    try {
        const response = await fetch(environments.API_URL + '/tx/timing');

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
    }
}
