import {getAddressDetails, getBody, getConfirmation, getPoolDetails, getTheLatestTransactionEpochOfAddress} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import { getFollowups, getCompeting } from "@app/db/queries";
import {getUrlObject} from "@app/utils/cardano-utils";

export async function GET(req:any ) {
    try {
        const urlObject = getUrlObject(req.url);
        const hashes = urlObject.searchParams.getAll("hash");
        const hashbytes = hashes.map((hash: string) => {
            return Buffer.from(hash, 'hex');
        });
        const confirmation = await getConfirmation(hashbytes);
        const serializedBuffer = encode(confirmation);
        const response = new NextResponse(serializedBuffer);
        console.log(confirmation);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log("/api/db/transaction", e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}