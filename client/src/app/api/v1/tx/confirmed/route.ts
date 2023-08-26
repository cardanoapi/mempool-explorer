import {getAddressDetails, getPoolDetails, getTheLatestTransactionEpochOfAddress, listConfirmedTransactions} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";
import {convertToTableData, getLatestEpoch, getUrlObject} from "@app/utils/cardano-utils";
import {convertBuffersToString} from "@app/utils/utils";


async function getTransactionHistoryOfPool(id: string, pageNumber: number) {
    const latestEpoch = await getTheLatestTransactionEpochOfAddress(id);
    if (latestEpoch != null)
        return await getPoolDetails(id, latestEpoch, pageNumber);
}

async function getTransactionHistoryOfAddress(id: string, pageNumber: number) {
    const latestEpoch = getLatestEpoch();
    return await getAddressDetails(id, latestEpoch, pageNumber)
}


/**
 * @swagger
 * /api/v1/tx:
 *   get:
 *     summary: get transaction list of address or pool
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
 *         description: The identifier for the address or pool.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number for pagination
 */
export async function GET(req: Request) {
    console.log("GET: ", req.url)
    const urlObject = getUrlObject(req.url);
    const start_date_ = urlObject.searchParams.get("from") as string;
    const pool_ = urlObject.searchParams.get("pool") as string;

    if(!start_date_){
        return NextResponse.json({message: "Required parameter from is missing"},{status: 400})

    }
    if(pool_){
        if(!pool_.startsWith('pool'))
            return NextResponse.json({message: "Required parameter from is missing"},{status: 400})

    }
    const start_date= start_date_? new Date(start_date_):new Date()
    const limit = parseInt(urlObject.searchParams.get("limit") as string) || 100;
    
    if(limit> 1000 || limit <0){
        return NextResponse.json({message: "Range for limit is (10,1000)"},{status: 400})
    }

    try {
        const result=await listConfirmedTransactions(start_date,pool_,limit)
        return NextResponse.json(convertBuffersToString(result))
    } catch (e: any) {
        console.log(req.url, e);
        return NextResponse.json({error: e.name, status: !e?.errorCode ? 500 : e.errorCode})
    }
}
