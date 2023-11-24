import { NextRequest, NextResponse } from 'next/server';

import { redisMiddleware, withCaching } from '@app/app/middleware';
import { getPoolDistributionGroup } from '@app/db/queries';


export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest, res: NextResponse) => {
    console.log('GET: ', req.url);
    try {
        let data = await getPoolDistributionGroup();
        console.log('Pool Distribution Handler: ', data);
        return data;
    } catch (e: any) {
        console.log(req.url, e);
        return { error: e.name, status: !e?.errorCode ? 500 : e.errorCode };
    }
};

/**
 * @swagger
 * /api/v1/pool/distribution:
 *   get:
 *     summary: Get current pool distribution information
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 */

export async function GET(req: NextRequest, res: NextResponse) {
    const data = await redisMiddleware(req, res, withCaching(handler));
    return NextResponse.json(data);
}