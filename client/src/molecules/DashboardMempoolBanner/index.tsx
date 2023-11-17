'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import _ from 'lodash';

import GradientButton from '@app/atoms/Button/GradientButton';
import GradientTypography from '@app/atoms/GradientTypography';
import LineChart from '@app/atoms/LineChart';
import TableHeader from '@app/atoms/TableHeader';
import { createLinkElementsForCurrentMempoolTransactions, toMidDottedStr } from '@app/utils/string-utils';
import { useEffect, useState } from 'react';
import useMempoolAndMintEvent from '@app/lib/hooks/useMempoolAndMintEvent';
import { AddRejectTxClientSideType, MempoolTransactionResponseType, RemoveMintedTransactions, RemoveTxClientSideType } from '@app/types/clientside/dashboard';
import { getRelativeTime } from '@app/utils/cardano-utils';
import { MempoolEventType } from '@app/constants/constants';

type MempoolSizeData = {
    received_date: string;
    size: number;
}

export default function DashboardMempoolBanner() {


    const [mempoolSizeDataLables, setMempoolSizeDataLables] = useState<string[]>([]);
    const [mempoolSizeDataValues, setMempoolSizeDataValues] = useState<number[]>([]);
    const [avgMempoolSize, setAvgMempoolSize] = useState<string | undefined>(undefined);

    const getMempoolSizeData = async () => {
        const response = await fetch('/api/v1/mempool/size');
        return await response.json();
    };

    useEffect(() => {
        getMempoolSizeData()
            .then((res) => {
                const formatDay = (inputDay: string): string => {
                    const date = new Date(inputDay);
                    // Convert to format hour:min:sec
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const seconds = date.getSeconds();
                    return `${hours}:${minutes}:${seconds}`;
                };
                const dataLables: string[] = [];
                const dataValues: number[] = [];
                res.forEach((result: MempoolSizeData) => {
                    const formattedTime = formatDay(result.received_date)
                    const sizeInKb = parseFloat((result.size / 1024).toFixed(2));
                    dataLables.push(formattedTime);
                    dataValues.push(sizeInKb);
                });
                setMempoolSizeDataLables(dataLables);
                setMempoolSizeDataValues(dataValues);
                setAvgMempoolSize(_.mean(dataValues).toFixed(2));
            })
            .catch((e: any) => {
                console.error(e);
            })
    }, []);


    const router = useRouter();

    const { mempoolEvent, mintEvent } = useMempoolAndMintEvent();

    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<MempoolTransactionResponseType>>([]);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMempoolTransactions((prevState) => {
                return prevState.map((obj) => {
                    return {
                        ...obj,
                        received_time: getRelativeTime(new Date(obj.arrival_time))
                    };
                });
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [mempoolEvent]);

    useEffect(() => {
        if (!mempoolEvent) return;
        const nonEmptyEvent = mempoolEvent as AddRejectTxClientSideType | RemoveTxClientSideType;
        mutateCurrentMempoolStateBasedOnEvent(nonEmptyEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mempoolEvent]);

    const addTransactionToMempoolState = (event: AddRejectTxClientSideType) => {
        const clientSideObject: MempoolTransactionResponseType = {
            hash: event.hash,
            inputs: event.tx.transaction.inputs,
            outputs: event.tx.transaction.outputs,
            arrival_time: event?.arrivalTime ? event.arrivalTime.toString() : '',
            received_time: event?.arrivalTime ? getRelativeTime(new Date(event.arrivalTime)) : getRelativeTime(new Date())
        };
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(clientSideObject);
        setCurrentMempoolTransactions([transformedClientSideObject, ...currentMempoolTransactions]);
    };

    const removeTransactionFromMempoolState = (hashes: Array<string>) => {
        let updatedArray = [...currentMempoolTransactions];
        for (const hash of hashes) {
            updatedArray = updatedArray.filter((item: any) => item.hash.key.toLowerCase() !== hash.toLowerCase());
        }
        setCurrentMempoolTransactions(updatedArray);
    };

    function mutateCurrentMempoolStateBasedOnEvent(event: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions) {
        switch (event.action) {
            case MempoolEventType.Remove:
                const removeEvent = event as RemoveTxClientSideType;
                removeTransactionFromMempoolState(removeEvent.txHashes);
                break;
            case MempoolEventType.Add:
                const addEvent = event as AddRejectTxClientSideType;
                addTransactionToMempoolState(addEvent);
                break;
            case MempoolEventType.Mint:
                removeTransactionFromMempoolState((event as RemoveMintedTransactions).txHashes);
                break;
            default:
                //TODO: logic on reject event
                return;
        }
    }
    return (
        <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Mempool Size</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 10 minutes</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Average Size</p>
                        <p className="text-2xl font-medium text-[#E6E6E6]">{avgMempoolSize} Kb</p>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    <LineChart labels={mempoolSizeDataLables} data={mempoolSizeDataValues} tickText="Kb" />
                </div>
            </div>
            <div className="col-span-1">
                <div className="px-4 py-6 lg:px-10 lg:py-12">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Unconfirmed Transactions</p>
                </div>
                <div className="lg:h-[670px] overflow-y-auto">
                    <table className="table-auto w-full">
                        <TableHeader thClassName="md:px-4 lg:px-10" columns={['Tx Hash', 'Arrival Time']} />
                        <tbody className="!text-xs lg:!text-sm !font-normal">
                            {currentMempoolTransactions.map((mt, index) => (
                                <tr key={index} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <GradientTypography>
                                            <Link href={`/transactions/test`}>{mt.hash}</Link>
                                        </GradientTypography>
                                    </td>
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <span className="text-white">{mt.received_time}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 lg:p-10">
                    <GradientButton size="large" fullWidth onClick={() => router.push('/mempool')}>
                        Show Live Data
                    </GradientButton>
                </div>
            </div>
        </div>
    );
}
