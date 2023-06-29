import {getSomeData} from "@app/db/queries";
import {NextResponse} from "next/server";
import {encode} from "cbor-x";

export async function GET() {
    const data = await getSomeData();
    const serializedBuffer = encode(data);
    const response = new NextResponse(serializedBuffer);
    response.headers.set("Content-Type", "application/cbor")
    return response;
}

// export default async function handler(req: any, res: any) {
//     console.log("handler hit: ", req);
//     try {
//         const data = await getSomeData();
//         res.status(200).json(data);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({message: "Internal server error"})
//     }
// if (req.method === "GET") {
//     try {
//         const data = await getSomeData();
//         res.status(200).json(data);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({message: "Internal server error"})
//     }
// } else {
//     res.status(405).json({message: "Method Not Allowed"})
// }
// }