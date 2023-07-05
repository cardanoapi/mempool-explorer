import {getAddressDetails, getPoolDetails, getTheLatestTransactionEpochOfAddress} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import {convertToTableData, getLatestEpoch, getUrlObject} from "@app/utils/cardano-utils";




async function getTransactionHistoryOfPool(id: string, pageNumber: number) {
    const latestEpoch = await getTheLatestTransactionEpochOfAddress(id);
    return await getPoolDetails(id, latestEpoch, pageNumber);
}

async function getTransactionHistoryOfAddress(id: string, pageNumber: number) {
    const latestEpoch = getLatestEpoch();
    return await getAddressDetails(id, latestEpoch, pageNumber)
}


export async function GET(req: Request) {
    const urlObject = getUrlObject(req.url);
    const id = urlObject.searchParams.get("id") as string;
    const pageNumber = parseInt(<string>urlObject.searchParams.get("pageNumber"));
    let data;
    try {
        if (id.startsWith("pool")) {
            data = await getTransactionHistoryOfPool(id, pageNumber)
        } else {
            data = await getTransactionHistoryOfAddress(id, pageNumber)
        }
        const serializedBuffer = encode(convertToTableData(data));
        const response = new NextResponse(serializedBuffer);
        response.headers.set("Content-Type", "application/cbor")
        return response;
    } catch (e: any) {
        console.log("/api/db/", e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}