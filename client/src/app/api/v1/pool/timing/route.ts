import { NextResponse } from "next/server";
import { getAveragePoolConfirmTimeForLastSevenDays, getCurrentEpochInfo, getPoolDistributionGroup } from "@app/db/queries";

export const dynamic = 'force-dynamic'

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

export async function GET(req: Request) {
    console.log("GET: ", req.url);
    try {
        let data = await getAveragePoolConfirmTimeForLastSevenDays();
        return NextResponse.json(data)
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({ error: e.name, status: !e?.errorCode ? 500 : e.errorCode })
    }
}