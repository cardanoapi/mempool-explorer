import { NextResponse } from "next/server";
import { getCurrentEpochInfo, getPoolDistributionGroup } from "@app/db/queries";

export const dynamic = 'force-dynamic'

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

export async function GET(req: Request) {
    console.log("GET: ", req.url);
    try {
        let data = await getPoolDistributionGroup();
        return NextResponse.json(data)
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode })
    }
}