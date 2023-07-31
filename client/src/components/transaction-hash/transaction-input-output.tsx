import {convertToADA, toMidDottedStr} from '@app/utils/string-utils';
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {useEffect, useState} from "react";
import {convertToClientSideInputOutputObject} from "@app/utils/transaction-details-utils";
import {useParams} from "next/navigation";

interface MultiAssetType {
    hash: string;
    Amount: number;
}

interface OutputType {
    address: string;
    amount: number;
    multiasset: Array<Map<string, number>>
}

interface UtxoType {
    hash: string;
    inputs: Array<string>;
    outputs: Array<OutputType>;
}

interface TransactionOutputInputType {
    txInputOutputs: UtxoType;
    isLoading: Boolean;
    error: ErrorType;
}

export interface ErrorType {
    status: number;
    message: string;
}

export default function TransactionInputOutput(props: TransactionOutputInputType) {

    const router = useParams();

    const [tx, setTxDetails] = useState<any>();


    useEffect(() => {
        if (!props.txInputOutputs) return;
        let inputOutputObject = convertToClientSideInputOutputObject(props.txInputOutputs);
        inputOutputObject = {...inputOutputObject, hash: router.id};
        setTxDetails(inputOutputObject)
    }, [props.txInputOutputs, router.id])

    if (props.error.status !== -1) {
        return (
            <Layout>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold text-2xl mb-2'}>Cardano Transaction</h1>
                    <EmptyPageIcon message={props.error.message}/>
                </div>
            </Layout>
        )
    }


    function Layout(props: any) {
        return <div
            className={'border-solid bg-white border-[1px] border-[#bfbfbf] p-4 rounded-md'}>{props.children}</div>;
    }

    function Outputs() {
        return (
            <>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold'}>Outputs</h1>
                    {tx?.outputs?.map((tx: OutputType, idx: number) => (
                        <div key={tx.address} className={'flex mb-4 items-start'}>
                            <p className={'font-semibold mr-2'}>{idx}<span>.</span></p>
                            <div className={'flex flex-col text-sm'}>
                                <div className={'flex items-center gap-2'}>
                                    <p className={'text-blue-500'}>{toMidDottedStr(tx.address)}</p>
                                    <p className={'font-semibold'}>{convertToADA(tx.amount)}</p>
                                </div>
                                <div className={"flex gap-1 flex-wrap"}>
                                    {tx.multiasset.map((t: any) => {
                                        return (
                                            <div key={t.hash} className={"flex w-full flex-wrap"}>
                                                {Object.keys(t).map((key: string) => {
                                                    return <div key={t.hash} className={"flex items-center m-2"}>
                                                        <p className={'p-1 text-xs border-solid border-[1px] bg-blue-50 rounded-lg'}>{key}<span
                                                            className={"ml-2 text-green-800 font-bold"}>{convertToADA(parseInt(t[key]))}</span>
                                                        </p>
                                                    </div>
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    function Inputs() {
        return (
            <div className={'mr-40'}>
                <h1 className={'font-semibold mb-2'}>Inputs</h1>
                {tx?.inputs?.map((tx: any, idx: number) => (
                    <div key={tx.address} className={'flex gap-2 mb-4 items-center'}>
                        <p className={'font-semibold mr-2'}>{idx + 1}.</p>
                        <div className={'flex flex-col text-sm'}>
                            <p className={'text-blue-500'}>{toMidDottedStr(tx.address)}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Layout>
            <h1 className={'font-semibold text-2xl mb-2'}>Cardano Transaction</h1>
            {props.isLoading ? <EmptyPageIcon message={"Fetching transaction details..."}/> :
                <>
                    {!!tx ?
                        <>
                            <div className={'flex flex-col'}>
                                <p className={'mr-1 font-semibold'}>Hash ID </p>
                                <p className={'text-gray-500 font-xs'}>{tx?.hash}</p>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <Inputs/>
                                <Outputs/>
                            </div>
                        </> : <EmptyPageIcon message={"No transactions available"}/>}
                </>
            }
        </Layout>
    )
        ;
}
