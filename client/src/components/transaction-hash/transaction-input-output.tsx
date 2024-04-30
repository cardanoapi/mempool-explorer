import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import CopyToClipboard from '@app/assets/svgs/copy-to-clipboard';
import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import { convertToADA, toMidDottedStr } from '@app/utils/string-utils';
import { convertToClientSideInputOutputObject } from '@app/utils/transaction-details-utils';
import { copyToClipboard } from '@app/utils/utils';

interface MultiAssetType {
    hash: string;
    Amount: number;
}

interface OutputType {
    address: string;
    amount: number;
    multiasset: Array<Map<string, number>>;
}

interface UtxoType {
    hash: string;
    inputs: Array<string>;
    outputs: Array<OutputType>;
}

interface TransactionOutputInputType {
    txInputOutputs: UtxoType;
    inputResolvedAddress: any;
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
        if (!props?.txInputOutputs) return;
        let inputOutputObject = convertToClientSideInputOutputObject(props.txInputOutputs);
        inputOutputObject = { ...inputOutputObject, hash: (router?.id as string) || '' };
        setTxDetails(inputOutputObject);
    }, [props.txInputOutputs, router?.id]);

    if (props.error.status !== -1) {
        return (
            <Layout>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold text-2xl mb-2'}>Cardano Transaction</h1>
                    <EmptyPageIcon message={props.error.message} />
                </div>
            </Layout>
        );
    }

    function Layout(props: any) {
        return <div className={'bg-white p-4 rounded-md'}>{props.children}</div>;
    }

    function Outputs() {
        return (
            <div className={'flex flex-col'}>
                <h1 className={'font-semibold'}>Outputs</h1>
                {tx?.outputs?.map((tx: OutputType, idx: number) => (
                    <div key={idx} className={'flex mb-4 items-start'}>
                        <p className={'font-semibold mr-2'}>
                            {idx}
                            <span>.</span>
                        </p>
                        <div className={'flex flex-col text-sm'}>
                            <div className={'flex items-center gap-2'}>
                                <p className={'text-blue-500'}>{toMidDottedStr(tx.address)}</p>
                                <div className={'cursor-pointer mr-2'} onClick={() => copyToClipboard(tx.address)}>
                                    <CopyToClipboard />
                                </div>
                            </div>
                            <p className={'font-bold text-lg'}>{convertToADA(tx.amount)}</p>
                            <div className={'flex gap-1 mt-2 flex-wrap'}>
                                {tx?.multiasset?.map((t: any) => {
                                    return (
                                        <div key={t.hash} className={'flex w-full flex-wrap'}>
                                            {Object.keys(t).map((key: string) => {
                                                return (
                                                    <div key={t.hash} className={'flex items-center m-2'}>
                                                        <div className={'p-1 text-xs text-green-800 font-bold border-solid border-[1px] bg-blue-50 rounded-lg'}>
                                                            {parseInt(t[key])}
                                                            <span className={'ml-2 text-black'}>{key}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
                            <div className={'flex items-center gap-2'}>
                                {!!props?.inputResolvedAddress[tx?.address]?.address ? (
                                    <Link href={`/${props.inputResolvedAddress[tx.address].address}`} target={'_blank'} prefetch={false}>
                                        <p className={'text-blue-500'}>{toMidDottedStr(props.inputResolvedAddress[tx.address].address, 14)}</p>
                                    </Link>
                                ) : (
                                    <Link href={`/transactions/${tx.address.split('#')[0]}`} target={'_blank'} className={'text-gray-600'} prefetch={false} >
                                        {tx.address}
                                    </Link>
                                )}
                                <div className={'cursor-pointer mr-2'} onClick={() => copyToClipboard(!!props?.inputResolvedAddress[tx?.address]?.address ? props.inputResolvedAddress[tx.address].address : tx.address)}>
                                    <CopyToClipboard />
                                </div>
                            </div>
                            {props?.inputResolvedAddress[tx?.address]?.value?.lovelace && <p className={'font-bold text-lg'}>{convertToADA(props.inputResolvedAddress[tx.address].value.lovelace)}</p>}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Layout>
            <h1 className={'font-semibold text-2xl mb-2'}>Cardano Transaction</h1>
            <div className={'flex flex-col mb-2'}>
                <p className={'mr-1 font-semibold'}>Hash ID </p>
                <div className={'flex items-center gap-2 mb-2'}>
                    <p className={'text-gray-500 font-xs'}>{((router?.id as string) || '')?.toLowerCase()}</p>
                    <div className={'cursor-pointer mr-2'} onClick={() => copyToClipboard((router?.id as string) || '')}>
                        <CopyToClipboard />
                    </div>
                </div>
            </div>
            {props.isLoading ? (
                <EmptyPageIcon message={'Fetching transaction details...'} />
            ) : (
                <>
                    {!!tx ? (
                        <div>
                            <div className={'flex flex-col'}>
                                <Inputs />
                                <Outputs />
                            </div>
                        </div>
                    ) : (
                        <EmptyPageIcon message={'No transaction body available'} />
                    )}
                </>
            )}
        </Layout>
    );
}
