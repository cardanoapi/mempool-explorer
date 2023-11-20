'use client';

import React, { useEffect, useState } from 'react';

import GradientBanner from '@app/atoms/GradientBanner';
import GradientHealthBar from '@app/atoms/GradientHealthBar';
import Loader from '@app/components/loader';
import DashboardStakePoolsBanner from '@app/molecules/DashboardStakePoolsBanner';

type PoolDistribution = {
    pool_id: string,
    name: string,
    ticker_name: string,
    avg_wait_time: number,
}

export default function PoolDistributionGroup() {

    const [poolData, setPoolData] = useState<PoolDistribution[]>();
    const [poolDistribution, setPoolDistribution] = useState<any[]>();

    const getPoolDistribution = async () => {
        const response = await fetch('/api/v1/pool/distribution');
        return await response.json();
    };

    useEffect(() => {
        getPoolDistribution()
            .then((res) => {
                setPoolData(res);
                const percentaileData = mapToPercentiles(res);
                const data = Object.keys(percentaileData).map((key) => {
                    const resultArray = percentaileData[key].map((pool: any) => ({
                        text: pool.name,
                        imageUrl: pool.ticker_name,
                        linkUrl: pool.url
                    }));
                    return {
                        data: resultArray.length,
                        content: resultArray
                    };
                });
                setPoolDistribution(data);
            })
            .catch((e: any) => {
                console.log("Error occured while fetching pool distribution")
                console.error(e);
            })
    }, []);

    return (
        <div>
            <GradientBanner>
                <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                    <div className="px-4 pt-6 flex flex-col gap-8 w-full lg:px-10 lg:pt-12 justify-between">
                        <div>
                            <p className="text-2xl font-medium text-[#E6E6E6]">Pool Distribution Group</p>
                            <p className="mt-1 text-sm font-light text-gray">From Last 5 Epoch</p>
                        </div>
                        <div className="flex justify-between md:justify-start md:gap-10">
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#7AE856]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Great Pools</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#FEA72A]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Good Pools</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Bad Pools</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-4 pb-12 lg:px-10 lg:py-8 lg:pb-16">
                        {poolDistribution ?
                            <GradientHealthBar
                                className="absolute"
                                labelData={poolDistribution}
                                labelIsPercentage
                            /> : <Loader />
                        }
                    </div>

                </div>
            </GradientBanner>
            <DashboardStakePoolsBanner poolData={poolData?.slice(0, 10)} />
        </div>
    );
}

function mapToPercentiles(data: any) {
    // Extract the wait times and calculate the min and max values
    const waitTimes = data.map((item: any) => item.avg_wait_time);
    const minValue = Math.min(...waitTimes);
    const maxValue = Math.max(...waitTimes);
    const rangeSize = (maxValue - minValue) / 10;

    // Populate the each percentile by filtering the data
    const result: any = {};
    for (let i = 0; i < 10; i++) {
        const lowerBound = maxValue - i * rangeSize;
        const upperBound = maxValue - (i + 1) * rangeSize;
        const percentileKey = `${100 - i * 10}-${90 - i * 10}`;
        result[percentileKey] = data
            .filter((item: any) =>
                item.avg_wait_time <= lowerBound &&
                item.avg_wait_time > upperBound);
    }
    return result;
}
