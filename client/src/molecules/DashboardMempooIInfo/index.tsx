'use client';

import React, { useEffect, useState } from 'react';

import _ from 'lodash';

import LineChart from '@app/atoms/LineChart';

type MempoolSizeData = {
    received_date: string;
    size: number;
};

export default function MempoolInfo() {
    const [mempoolSizeDataLabels, setMempoolSizeDataLabels] = useState<string[]>([]);
    const [mempoolSizeDataValues, setMempoolSizeDataValues] = useState<number[]>([]);
    const [avgMempoolSize, setAvgMempoolSize] = useState<string | undefined>(undefined);

    const getMempoolSizeData = async () => {
        const response = await fetch('/api/v1/mempool/size');
        return await response.json();
    };

    useEffect(() => {
        getMempoolSizeData()
            .then((res) => {
                const dataLabels: string[] = [];
                const dataValues: number[] = [];
                res.forEach((result: MempoolSizeData) => {
                    const currentDate = new Date(); // It is inside loop because some time might pass between iterations
                    const receivedDate = new Date(result.received_date);

                    // Calculate time difference in seconds
                    const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - receivedDate.getTime()) / 1000);

                    // Push the time difference to the dataLabels array
                    if (timeDifferenceInSeconds < 60) {
                        // If time difference is less than 60 seconds, push seconds format
                        dataLabels.push(`${timeDifferenceInSeconds} sec`);
                    } else {
                        // If time difference is greater than or equal to 60 seconds, convert to minutes format
                        const minutes = Math.floor(timeDifferenceInSeconds / 60);
                        dataLabels.push(`${minutes} min`);
                    }

                    const sizeInKb = parseFloat((result.size / 1024).toFixed(2));
                    dataValues.push(sizeInKb);
                });
                setMempoolSizeDataLabels(dataLabels);
                setMempoolSizeDataValues(dataValues);
                setAvgMempoolSize(_.mean(dataValues).toFixed(2) + ' Kb');
            })
            .catch((e: any) => {
                console.error(e);
            });
    }, []);

    return (
        <div className="border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
            <div className="px-4 py-6 lg:px-10 lg:py-12">
                <div className="flex flex-col gap-8 w-full lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Mempool Size</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 10 minutes</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Average Size</p>
                        <p className="text-2xl font-medium text-[#E6E6E6]">{avgMempoolSize}</p>
                    </div>
                </div>
                <p className="mt-4">This displays the real-time size of the Mempool for this explorer node, as measured over the last 10 minutes.</p>
            </div>
            <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                {mempoolSizeDataValues.length > 0 && mempoolSizeDataLabels.length > 0 ? (
                    <LineChart labels={mempoolSizeDataLabels} data={mempoolSizeDataValues} tickText="Kb" />
                ) : (
                    <div className="h-[86vh] isolate overflow-hidden shadow-xl shadow-black/5 grid grid-cols-10 gap-[2px]">
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
    );
}
