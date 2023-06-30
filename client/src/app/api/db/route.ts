import {getAddressDetails, getPoolDetails, getTheLatestTransactionEpochOfAddress} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import {convertToTableData, getLatestEpoch} from "@app/utils/cardano-utils";


function getUrlObject(urlStr: string) {
    return new URL(urlStr);
}

async function getTransactionHistoryOfPool(id: string, pageNumber: number) {
    const latestEpoch = await getTheLatestTransactionEpochOfAddress(id);
    const data = await getPoolDetails(id, latestEpoch, pageNumber);
    return convertToTableData(data);
}

async function getTransactionHistoryOfAddress(id: string, pageNumber: number) {
    const latestEpoch = getLatestEpoch();
    const data = await getAddressDetails(id, latestEpoch, pageNumber)
    return convertToTableData(data);
}


export async function GET(req: Request) {
    const urlObject = getUrlObject(req.url);
    const id = urlObject.searchParams.get("id") as string;
    const pageNumber = parseInt(<string>urlObject.searchParams.get("pageNumber"));
    let data;
    if (id.startsWith("pool")) {
        data = await getTransactionHistoryOfPool(id, pageNumber)
    } else {
        data = await getTransactionHistoryOfAddress(id, pageNumber)
    }
    const serializedBuffer = encode(data);
    const response = new NextResponse(serializedBuffer);
    response.headers.set("Content-Type", "application/cbor")
    return response;
}