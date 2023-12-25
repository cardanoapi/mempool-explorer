'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import _ from 'lodash';

import GradientButton from '@app/atoms/Button/GradientButton';
import GradientTypography from '@app/atoms/GradientTypography';
import LineChart from '@app/atoms/LineChart';
import TableHeader from '@app/atoms/TableHeader';
import { MempoolEventType } from '@app/constants/constants';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import useMempoolAndMintEvent from '@app/lib/hooks/useMempoolAndMintEvent';
import { AddRejectTxClientSideType, MempoolTransactionResponseType, RemoveMintedTransactions, RemoveTxClientSideType } from '@app/types/clientside/dashboard';
import { getRelativeTime } from '@app/utils/cardano-utils';
import { createLinkElementsForCurrentMempoolTransactions, toMidDottedStr } from '@app/utils/string-utils';

type MempoolSizeData = {
    received_date: string;
    size: number;
};

export default function MempoolInfo() {
    const [mempoolSizeDataLables, setMempoolSizeDataLables] = useState<string[]>([]);
    const [mempoolSizeDataValues, setMempoolSizeDataValues] = useState<number[]>([]);
    const [avgMempoolSize, setAvgMempoolSize] = useState<string | undefined>(undefined);

    const isMobile = useIsMobile();

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
                    const formattedTime = formatDay(result.received_date);
                    const sizeInKb = parseFloat((result.size / 1024).toFixed(2));
                    dataLables.push(formattedTime);
                    dataValues.push(sizeInKb);
                });
                setMempoolSizeDataLables(dataLables);
                setMempoolSizeDataValues(dataValues);
                setAvgMempoolSize(_.mean(dataValues).toFixed(2) + " Kb");
            })
            .catch((e: any) => {
                console.error(e);
            });
    }, []);

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
                        <p className="text-2xl font-medium text-[#E6E6E6]">{avgMempoolSize}</p>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    {mempoolSizeDataValues.length > 0 && mempoolSizeDataLables.length > 0 ? (
                        <LineChart labels={mempoolSizeDataLables} data={mempoolSizeDataValues} tickText="Kb" />
                    ) : (
                        <div className="h-[450px] isolate overflow-hidden shadow-xl shadow-black/5 grid grid-cols-10 gap-[2px]">
                            {_.range(0, 10).map((percent, index) => (
                                <div key={index} className="h-full col-span-1 grid grid-rows-10 gap-[2px]">
                                    {_.range(0, 10).map((h, idx) => (
                                        <div key={idx} className="grid-rows-1 bg-[#303030] animate-pulse" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="col-span-1">
                <div className="px-4 py-6 lg:px-10 lg:py-12">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Unconfirmed Transactions</p>
                </div>
                <div className="lg:h-[670px] overflow-y-auto">
                    <table className="table-auto w-full">
                        <TableHeader thClassName="md:px-4 lg:px-10" columns={['Tx Hash', 'Arrival Time']} />
                        <tbody className="!text-xs lg:!text-sm !font-normal w-full">
                            {currentMempoolTransactions && currentMempoolTransactions.length > 0
                                ? currentMempoolTransactions.map((mt, index) => (
                                    <tr key={index} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        {Object.entries(mt).map(([k, d], idx) => {
                                            if (k !== 'hash' && k !== 'received_time') return null;
                                            let item: any = d;
                                            let content;
                                            if (typeof item === 'object' && item?.type !== 'div') {
                                                content = (
                                                    <GradientTypography>
                                                        <Link href={item?.props?.href}>{toMidDottedStr(item?.key, isMobile ? 3 : 5)}</Link>
                                                    </GradientTypography>
                                                );
                                            } else if (typeof item === 'object' && item?.type === 'div' && Array.isArray(item?.props?.children?.props?.children) && item?.props?.children?.props?.children?.length > 0) {
                                                content = <GradientTypography>{item?.props?.children?.props?.children[0]?.length}</GradientTypography>;
                                            } else {
                                                content = toMidDottedStr(item, isMobile ? 3 : 5);
                                            }

                                            return (
                                                <td key={idx} className="py-5 px-4 md:px-10 text-start">
                                                    {content}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                                : _.range(0, 8).map((percent, index) => (
                                    <tr key={index} className="border-b-[1px] h-[65px] hover:bg-[#292929] w-full isolate overflow-hidden shadow-xl shadow-black/5 gap-[2px]">
                                        <td className="grid-cols-1 bg-[#303030] animate-pulse w-full py-5 px-4 lg:px-10 text-start" />
                                        <td className="grid-cols-1 bg-[#303030] animate-pulse w-full py-5 px-4 lg:px-10 text-start" />
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 lg:p-10">
                    <Link href="/mempool">
                        <GradientButton size="large" fullWidth onClick={() => { }}>
                            Show Live Data
                        </GradientButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}