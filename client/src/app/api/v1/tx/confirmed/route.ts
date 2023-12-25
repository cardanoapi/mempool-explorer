import { NextResponse } from 'next/server';

import environments from '@app/configs/environments';
import { getUrlObject } from '@app/utils/cardano-utils';

/**
 * @swagger
 * /api/v1/tx/confirmed:
 *   get:
 *     summary: get transaction list
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 *     parameters:
 *       - in: query
 *         name: pool
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter transactions for this pool only
 *       - in: query
 *         name: from
 *         schema:
 *           type: date-time
 *         required: true
 *         description: List transactions starting from this date/time
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Return only this no of result. [max 1000]
 */

export async function GET(req: Request) {
    console.log('GET: ', req.url);
    try {
        const urlObject = getUrlObject(req.url);
        const start_date_ = urlObject.searchParams.get('from') as string;
        const pool_ = urlObject.searchParams.get('pool') as string;
        const limit = parseInt(urlObject.searchParams.get('limit') as string) || 100;

        if (!start_date_) {
            return NextResponse.json({ message: 'Required parameter from is missing' }, { status: 400 });
        }
        if (pool_) {
            if (!pool_.startsWith('pool')) return NextResponse.json({ message: 'Required parameter from is missing' }, { status: 400 });
        }

        const start_date = Date.parse(start_date_);
        //@ts-ignore
        if (isNaN(start_date)) {
            return NextResponse.json({ message: 'Invalid date format. valid example: ' + new Date().toISOString() }, { status: 400 });
        }

        let url = `${environments.API_URL}/tx/confirmed?start=${start_date_}&limit=${limit}`;
        if (pool_) {
            url += `&pool=${pool_}`;
        }

        const response = await fetch(url);

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}
