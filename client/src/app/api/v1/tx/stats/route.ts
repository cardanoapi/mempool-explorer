import {encode} from "cbor-x";
import {NextResponse} from "next/server";
import {getAggregrationForLastThreeBlocks} from "@app/db/queries";
import {getUrlObject, transformToClientSideData} from "@app/utils/cardano-utils";
import {convertBuffersToString} from "@app/utils/utils";

export const dynamic = 'force-dynamic'

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

export async function GET(req: Request) {
    console.log("GET: ", req.url)
    try {
        const urlObject = getUrlObject(req.url);
        const id = urlObject.searchParams.get("query") as string;
        let data = await getAggregrationForLastThreeBlocks(id);
        if (req.headers.get("accept") === "application/json") {
            const r = convertBuffersToString(await transformToClientSideData(data));
            return NextResponse.json(r)
        }
        const transformedData = await transformToClientSideData(data);
        const serializedBuffer = encode(transformedData);
        const response = new NextResponse(serializedBuffer);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}