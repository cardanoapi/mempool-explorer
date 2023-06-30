import {encode} from "cbor-x";
import {NextResponse} from "next/server";
import {getAggregrationForLastThreeBlocks} from "@app/db/queries";
import {transformToClientSideData} from "@app/utils/cardano-utils";

function getUrlObject(urlStr: string) {
    return new URL(urlStr);
}

export async function GET(req: Request) {
    const urlObject = getUrlObject(req.url);
    const id = urlObject.searchParams.get("id") as string;
    let data = await getAggregrationForLastThreeBlocks(id);
    const transformedData = await transformToClientSideData(data);
    const serializedBuffer = encode(transformedData);
    const response = new NextResponse(serializedBuffer);
    response.headers.set("Content-Type", "application/cbor")
    return response;
}