import Layout from "@app/shared/layout";
import {Heading} from "@app/utils/string-utils";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {checkForErrorResponse} from "@app/components/loader/error";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {copyToClipboard} from "@app/utils/utils";
import CopyToClipboard from "@app/assets/svgs/copy-to-clipboard";

import 'react-toastify/dist/ReactToastify.css';
import {DateTimeCustomoptions} from "@app/constants/constants";


enum MinerEnum {
    block_hash = "Block Hash",
    block_no = "Block Number",
    block_time = "Block Time",
    epoch = "Epoch",
    in_addrs = "Address",
    pool_id = "Pool Id",
    slot_no = "Slot Number",
    tx_hash = "Transaction Hash"
}

export default function Miner() {
    const router = useParams();

    const {isLoading, showLoader, hideLoader, error, setError} = useLoader();

    const [miner, setMiner] = useState<any>(null);

    const getTransactionDetails = async () => {
        const response = await fetch(`/api/v1/tx/confirmation?hash=${router.id}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    useEffect(() => {
        if (!router.id) return;
        showLoader();
        getTransactionDetails()
            .then((d) => {
                const date = new Date(d[0]?.block_time);
                const clientSideObj = {
                    [MinerEnum.block_no]: d[0]?.block_no.toString(),
                    [MinerEnum.epoch]: d[0]?.epoch.toString(),
                    [MinerEnum.slot_no]: parseInt(d[0]?.slot_no).toString(),
                    [MinerEnum.block_hash]: d[0]?.block_hash ? Buffer.from(d[0].block_hash).toString("hex") : "",
                    [MinerEnum.block_time]: new Intl.DateTimeFormat("en-US", DateTimeCustomoptions).format(date),
                    [MinerEnum.pool_id]: d[0]?.pool_id.toString(),
                    [MinerEnum.tx_hash]: d[0]?.tx_hash ? Buffer.from(d[0].tx_hash).toString("hex") : "",
                }
                setMiner(clientSideObj);
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
                        <div className={"flex gap-2 mt-2 justify-between items-center"}>
                            <p className={'font-xs font-semibold'}>{dataObj[key]}</p>
                            <div className={'cursor-pointer mr-2'} onClick={() => copyToClipboard(dataObj[key])}>
                                <CopyToClipboard/>
                            </div>
                        </div>

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
                        <div className={'flex flex-wrap gap-2'}>
                            <TransactionBlockInfo key={miner?.block_hash} transaction={miner}/>
                        </div> :
                        <EmptyPageIcon message={"The transaction is not available on the blockchain"}/>
                    }
                </>
            }
        </Layout>
    )
}