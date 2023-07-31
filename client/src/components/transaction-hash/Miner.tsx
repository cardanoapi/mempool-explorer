import Layout from "@app/shared/layout";
import {Heading, toMidDottedStr} from "@app/utils/string-utils";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {checkForErrorResponse} from "@app/components/loader/error";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";

export default function Miner() {
    const router = useParams();

    const {isLoading, showLoader, hideLoader, error, setError} = useLoader();

    const [miner, setMiner] = useState<any>(null);

    const getTransactionDetails = async () => {
        const response = await fetch(`/api/db/transaction/confirmation?hash=${router.id}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    useEffect(() => {
        if (!router.id) return;
        showLoader();
        getTransactionDetails()
            .then((d) => {
                console.log("confirmation", d)
                setMiner(d);
            })
            .catch((e: any) => {
                console.error(e);
                setError({
                    message: e?.message ?? '',
                    status: e?.code
                });
            })
            .finally(() => hideLoader());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.id]);

    if (error.status !== -1) {
        return (
            <Layout className={"!max-h-full !overflow-y-scroll"}>
                <Heading title={"Miner"}/>
                <EmptyPageIcon message={error.message}/>
            </Layout>
        )
    }

    function TransactionBlockInfo(props: any) {
        const dataObj = props.transaction;
        return (
            <>
                {Object.keys(dataObj).map(key => (
                    <Layout key={key}>
                        <p className={'text-gray-600 mr-1'}>{key}</p>
                        <p className={' font-xs font-semibold'}>{toMidDottedStr(dataObj[key])}</p>
                    </Layout>
                ))}
            </>
        )
    }

    return (
        <Layout className={"!max-h-full !overflow-y-scroll"}>
            <Heading title={"Miner"}/>
            {isLoading ? <EmptyPageIcon message={"Fetching miner info..."}/> :
                <>
                    {!!miner ?
                        <div className={'grid gap-2 grid-cols-1 md:grid-cols-2'}>
                            <TransactionBlockInfo key={miner?.block_hash} transaction={miner}/>
                        </div> :
                        <EmptyPageIcon message={"Miner not available"}/>
                    }
                </>
            }
        </Layout>
    )
}