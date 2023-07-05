import {encode} from "cbor-x";
import {NextResponse} from "next/server";
import {getAggregrationForLastThreeBlocks} from "@app/db/queries";
import {getUrlObject, transformToClientSideData} from "@app/utils/cardano-utils";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const urlObject = getUrlObject(req.url);
        const id = urlObject.searchParams.get("id") as string;
        let data = await getAggregrationForLastThreeBlocks(id);
        const transformedData = await transformToClientSideData(data);
        const serializedBuffer = encode(transformedData);
        const response = new NextResponse(serializedBuffer);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log("/api/db/block", e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}