import {NextResponse} from "next/server";
import {getCurrentEpochInfo} from "@app/db/queries";

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/v1/epoch/current:
 *   get:
 *     summary: Get current epoch information
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json: {}
 */

export async function GET(req: Request) {
    console.log("GET: ", req.url);
    try {
        let data = await getCurrentEpochInfo();
        return NextResponse.json(data)
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}