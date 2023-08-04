import {getArrivalTime, getBody, getCompeting, getFollowups} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import {parse} from "url";
import {convertBuffersToString} from "@app/utils/utils";


async function fetchTheArrivalTime(arr: Array<any>) {
    return Promise.all(arr.map(async item => {
        const arrivalTime = await getArrivalTime(item.hash);
        return {
            ...item,
            arrivalTime: !!arrivalTime?.received ? arrivalTime.received.toString() : "N/A"
        }
    }))
}

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
    console.log("GET: ", req.url)
    try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname as string;
        const hash = pathname.split('/').pop() as string;
        // const urlObject = getUrlObject(req.url);
        // const hash = urlObject.searchParams.get("hash") as string;
        const txHash = Buffer.from(hash, 'hex');
        let arrivalTime = await getArrivalTime(txHash);
        let txbody = await getBody(txHash);
        let followups = await getFollowups(txHash);
        followups = await fetchTheArrivalTime(followups);
        // let confirmation = await getConfirmation([txHash]);
        let competing = await getCompeting(txHash);
        competing = await fetchTheArrivalTime(competing)
        const detail = {tx: txbody, arrivalTime: arrivalTime?.received, followups, competing};
        if (req.headers.get("accept") === "application/json") {
            return NextResponse.json(convertBuffersToString(detail))
        }
        const serializedBuffer = encode(detail);
        const response = new NextResponse(serializedBuffer);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}