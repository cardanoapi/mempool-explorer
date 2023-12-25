import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server.js';

import environments from '@app/configs/environments';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/v1/pool/timing:
 *   get:
 *     summary: Get pool timing information for last seven days
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 */

export async function GET(req: NextRequest, res: NextResponse) {

    console.log('GET: ', req.url);
    try {
        const response = await fetch(environments.API_URL + '/pool/timing');

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}
