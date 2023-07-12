import {useEffect, useState} from "react";
import {checkForErrorResponse} from "@app/components/loader/error";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";
import {useRouter} from "next/navigation";
import {Transaction} from "@emurgo/cardano-serialization-lib-asmjs";

export default function Competitors() {

    const [competitors, setCompetitors] = useState([]);
    const {isLoading, hideLoader, error, setError} = useLoader();

    const router = useRouter();

    // const getTransactionDetails = async () => {
    //     const response = await fetch(`/api/db/transaction?hash=${router.id}`);
    //     await checkForErrorResponse(response);
    //     const arrayBuffer = await response.arrayBuffer();
    //     return decode(new Uint8Array(arrayBuffer));
    // }
    //
    // useEffect(() => {
    //     getTransactionDetails().then(d => {
    //         console.log(d)
    //         // const tx_hash = Transaction.from_bytes(response.tx.hash);
    //         // const txBodyObject = Transaction.from_bytes(response.tx.txbody);
    //
    //         // console.log(txBodyObject.to_js_value())
    //     }).catch((e: any) => setError({
    //         message: e.message,
    //         status: e.code
    //     })).finally(() => hideLoader())
    // }, [router.id])

    return (
        <>

        </>
    )
}