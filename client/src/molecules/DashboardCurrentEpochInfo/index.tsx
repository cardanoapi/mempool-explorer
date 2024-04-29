'use client';

import React, { forwardRef, useEffect, useState } from 'react';

import _ from 'lodash';

import { getEpochDetails } from '@app/api/epoch';
import GradientBanner from '@app/atoms/GradientBanner';
import LineChart from '@app/atoms/LineChart';

type EpochDetails = {
    epoch_number?: number;
    tx_count?: number;
    avg_wait_time?: number;
    block_count?: number;
    avg_transaction_per_block?: number;
};

type TxTiming = {
    day: string;
    avg_wait_time: string;
};

const CurrentEpochInfo = forwardRef<HTMLDivElement, {}>((props, ref) => {
    const [currentEpoch, setCurrentEpoch] = useState<EpochDetails>({});

    useEffect(() => {
        getEpochDetails()
            .then((d) => {
                setCurrentEpoch(d);
            })
            .catch((e: any) => {
                console.error(e);
            });
    }, []);

    const [txTimingsDays, setTxTimingsDays] = useState<string[]>([]);
    const [txTimingsAvgTime, setTxTimingsAvgTime] = useState<number[]>([]);

    const getTxTimings = async () => {
        const response = await fetch('/api/v1/tx/timing');
        return await response.json();
    };

    useEffect(() => {
        getTxTimings()
            .then((res) => {
                const days: string[] = [];
                const avgWaitTimes: number[] = [];

                const formatDay = (inputDay: string): string => {
                    const date = new Date(inputDay);
                    date.setUTCHours(new Date().getUTCHours(), new Date().getUTCMinutes(), new Date().getUTCSeconds());
                    const month = date.toLocaleString('en-us', { month: 'short' });
                    const day = date.getDate();
                    return `${month} ${day}`;
                };

                res.forEach((result: TxTiming) => {
                    const formattedDate = formatDay(result.day);
                    const avg_wait_time = parseFloat(parseFloat(result.avg_wait_time).toFixed(2));
                    days.push(formattedDate);
                    avgWaitTimes.push(avg_wait_time);
                });
                setTxTimingsDays(days);
                setTxTimingsAvgTime(avgWaitTimes);
            })
            .catch((e: any) => {
                console.error(e);
            });
    }, []);

    return (
        <GradientBanner ref={ref} minHeight="566px">
            <div className="grid grid-cols-1 min-h-[566px] md:grid-cols-3">
                <div className="col-span-1 border-r-0 border-b-[1px] border-b-[#666666] md:border-r-[1px] md:border-r-[#666666] md:border-b-0">
                    <div className="px-4 py-6 md:px-10 md:py-5 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-2xl font-medium text-[#E6E6E6]">Current Epoch</p>
                        <p className={`text-base md:text-2xl font-medium text-[#E6E6E6] ${!currentEpoch.epoch_number ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>{currentEpoch.epoch_number?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Total Transactions</p>
                        <p className={`text-base md:text-2xl font-medium text-[#E6E6E6] ${!currentEpoch.tx_count ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>{currentEpoch.tx_count?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Average Confirmation Time</p>
                        <p className={`text-base md:text-2xl font-medium text-[#E6E6E6] ${!currentEpoch.avg_wait_time ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>
                            {currentEpoch?.avg_wait_time ? `${currentEpoch.avg_wait_time.toLocaleString('en-Us', { maximumFractionDigits: 2 })} sec` : ''}
                        </p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Total Blocks</p>
                        <p className={`text-base md:text-2xl font-medium text-[#E6E6E6] ${!currentEpoch.block_count ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>{currentEpoch.block_count?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Avg. Transaction Per Block</p>
                        <p className={`text-base md:text-2xl font-medium text-[#E6E6E6] ${!currentEpoch.avg_transaction_per_block ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>{currentEpoch.avg_transaction_per_block?.toLocaleString('en-US')}</p>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <div className="px-4 py-6 lg:px-10 lg:py-10">
                        <div className="flex flex-col gap-8 w-full lg:flex-row lg:justify-between">
                            <div>
                                <p className="text-2xl font-medium text-[#E6E6E6]">Average Transaction Wait Time</p>
                                <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                            </div>
                            <div className="flex gap-12 md:gap-[72px]">
                                <div>
                                    {/* TODO : Global is not shown for now */}
                                    {/* <p className="text-sm font-normal text-[#E6E6E6]">Global</p>
                                <p className="text-2xl font-medium text-[#E6E6E6]">.. sec</p> */}
                                </div>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                        <p className="text-sm font-normal text-[#E6E6E6]">This Epoch</p>
                                    </div>
                                    {currentEpoch?.avg_wait_time && <p className="text-2xl font-medium text-[#E6E6E6]">{currentEpoch.avg_wait_time.toLocaleString('en-US', { maximumFractionDigits: 2 })} sec</p>}
                                </div>
                            </div>
                        </div>
                        <p className="mt-4">How long, on average, in the last seven days did a transaction take to be confirmed on the Cardano blockchain?</p>
                    </div>
                    <div className="md:min-h-[355px] px-4 py-4 md:px-10 md:py-8">
                        {txTimingsDays.length === 0 ? (
                            <div className="h-[450px] isolate overflow-hidden shadow-xl shadow-black/5 grid grid-cols-10 gap-[2px]">
                                {_.range(0, 10).map((percent, index) => (
                                    <div key={index} className="h-full col-span-1 grid grid-rows-10 gap-[2px]">
                                        {_.range(0, 10).map((h, idx) => (
                                            <div key={idx} className="grid-rows-1 bg-black animate-pulse" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <LineChart labels={txTimingsDays} data={txTimingsAvgTime} tickText="sec" suggestedMin={15} suggestedMax={30} stepSize={5} />
                        )}
                        <p className="mt-4 italic">The line chart visually shows the average daily transaction wait time in the last seven days.</p>
                    </div>
                </div>
            </div>
        </GradientBanner>
    );
});

CurrentEpochInfo.displayName = 'CurrentEpochInfo';

export default CurrentEpochInfo;
