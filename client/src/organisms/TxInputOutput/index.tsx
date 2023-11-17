'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import GradientTypography from '@app/atoms/GradientTypography';
import CopyIcon from '@app/atoms/Icon/Copy';
import { convertToADA } from '@app/utils/string-utils';
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

export interface ErrorType {
    status: number;
    message: string;
}
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

export interface ErrorType {
    status: number;
    message: string;
}

type ITxInputOutputProps = {
    txInputOutputs: UtxoType;
    inputResolvedAddress: any;
    isLoading: boolean;
    error: ErrorType;
};

export default function TxInputOutput({ txInputOutputs, error, isLoading, inputResolvedAddress }: ITxInputOutputProps) {
    const router = useParams();

    const [tx, setTx] = useState<any>();
    const [showTokensMap, setShowTokensMap] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!txInputOutputs) return;

        let inputOutputObject = convertToClientSideInputOutputObject(txInputOutputs);
        inputOutputObject = { ...inputOutputObject, hash: router?.id || '' };
        setTx(inputOutputObject);
    }, [txInputOutputs, router?.id]);

    if (isLoading) return <EmptyPageIcon message={'Fetching transaction details...'} />;

    if (error.status !== -1) {
        return <EmptyPageIcon message={error.message} />;
    }

    if (!tx) return <EmptyPageIcon message="No transaction details found" />;

    return (
        <div className="flex flex-col gap-7 md:gap-8">
            <div className="px-4 py-6 lg:px-10 lg:pb-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                <p className="text-[#E6E6E6] text-base font-medium mb-6">Inputs ({tx?.inputs?.length}):</p>
                {tx?.inputs?.map((tx: any, idx: number) => (
                    <div key={tx.address} className="flex gap-2 mb-4 items-start">
                        <p className="text-[#B9B9B9] font-normal text-base">{idx + 1}.</p>
                        <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-2">
                                {inputResolvedAddress[tx?.address]?.address ? (
                                    <GradientTypography className="break-all">
                                        <Link href={`/${inputResolvedAddress[tx.address].address}`}>{inputResolvedAddress[tx.address].address}</Link>
                                    </GradientTypography>
                                ) : (
                                    <GradientTypography className="break-all">
                                        <Link href={`/transactions/${tx.address.split('#')[0]}`}>{tx.address}</Link>
                                    </GradientTypography>
                                )}
                                <button onClick={() => copyToClipboard(inputResolvedAddress[tx?.address]?.address ? inputResolvedAddress[tx.address].address : tx.address)}>
                                    <CopyIcon />
                                </button>
                            </div>
                            {inputResolvedAddress[tx?.address]?.value?.lovelace && <p className="font-medium pt-4 text-base text-[#B9B9B9]">{convertToADA(inputResolvedAddress[tx.address].value.lovelace)}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-6 lg:px-10 lg:pb-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                <p className="text-[#E6E6E6] text-base font-medium mb-6">Outputs ({tx?.outputs?.length}):</p>
                {tx?.outputs?.map((tx: OutputType, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-4 items-start">
                        <p className="text-[#B9B9B9] font-normal text-base">{idx + 1}.</p>
                        <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-2">
                                <GradientTypography className="break-all">
                                    <Link href={`/${tx.address}`}>{tx.address}</Link>
                                </GradientTypography>
                                <button onClick={() => copyToClipboard(tx.address)}>
                                    <CopyIcon />
                                </button>
                            </div>
                            <p className="font-medium pt-4 text-base text-[#B9B9B9]">{convertToADA(tx.amount)}</p>
                            {tx?.multiasset?.length > 0 && (
                                <div className="flex gap-1 mt-4 flex-wrap">
                                    <button
                                        className="bg-[#292929] text-white !px-2 !py-1"
                                        onClick={() => {
                                            setShowTokensMap((prev) => ({
                                                ...prev,
                                                [tx.address]: !prev[tx.address]
                                            }));
                                        }}
                                    >
                                        {showTokensMap[tx.address] ? `Hide all tokens (${tx?.multiasset?.length})` : `See all tokens (${tx?.multiasset?.length})`}
                                    </button>
                                    {showTokensMap[tx.address] &&
                                        tx?.multiasset?.map((t: any) => {
                                            return (
                                                <div key={t.hash} className="flex flex-wrap flex-col gap-2">
                                                    {Object.keys(t).map((key: string) => {
                                                        return (
                                                            <p key={t.hash} className="break-all text-[#B9B9B9] text-base font-normal">
                                                                {key}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
