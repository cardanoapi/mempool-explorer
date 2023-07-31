import {getArrivalTime, getBody, getCompeting, getConfirmation, getFollowups} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import {getUrlObject} from "@app/utils/cardano-utils";

export async function GET(req: any) {
    console.log("GET: ", req.url)
    try {
        const urlObject = getUrlObject(req.url);
        const hash = urlObject.searchParams.get("hash") as string;
        const txHash = Buffer.from(hash, 'hex');
        let arrivalTime = await getArrivalTime(txHash);
        let txbody = await getBody(txHash);
        let followups = await getFollowups(txHash);
        let confirmation = await getConfirmation([txHash]);
        let competing = await getCompeting(txHash);
        const detail = {tx: txbody, arrivalTime: arrivalTime?.received, followups, competing};
        const serializedBuffer = encode(detail);
        const response = new NextResponse(serializedBuffer);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log("/api/db/transactions", e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}