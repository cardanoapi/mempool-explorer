import { NextResponse } from 'next/server';

import { parse } from 'url';

import environments from '@app/configs/environments';

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
        const response = await fetch(environments.API_URL + `/tx/${hash}`);

        const data = await response.json();

        return NextResponse.json(data);
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode });
    }
}
