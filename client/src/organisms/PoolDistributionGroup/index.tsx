'use client';

import React, { useEffect, useState } from 'react';

import _ from 'lodash';

import { Box, InputAdornment, TextField } from '@mui/material';

import BubbleChart from '@app/atoms/BubbleChart';
import GradientBanner from '@app/atoms/GradientBanner';
import GradientHealthBar from '@app/atoms/GradientHealthBar';
import SearchIcon from '@app/atoms/Icon/Search';
import environments from '@app/configs/environments';
import StakePoolTiming from '@app/molecules/DashboardStakePoolsInfo';
import { PoolDistribution } from '@app/types/poolDistribution';

export default function StakePoolsInfo() {
    const [poolData, setPoolData] = useState<PoolDistribution[]>();
    const [poolDistribution, setPoolDistribution] = useState<any[]>();
    const [totalWaitTime, setTotalWaitTime] = useState<string>();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleChange: any = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const getPoolDistribution = async () => {
        const response = await fetch('/api/v1/pool/distribution');
        return await response.json();
    };

    useEffect(() => {
        getPoolDistribution()
            .then((res: PoolDistribution[]) => {
                setPoolData(res);

                const waitTimes = res.map((item: PoolDistribution) => parseFloat(item.total_wait_time));
                setTotalWaitTime(_.mean(waitTimes).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' sec');
                const percentaileData = mapToPercentiles(waitTimes, res);
                const data = Object.keys(percentaileData).map((key) => {
                    const resultArray = percentaileData[key].map((pool: any) => ({
                        text: pool.name,
                        imageUrl: pool.ticker_name,
                        linkUrl: pool.url,
                        poolId: pool.pool_id,
                        totalWaitTime: parseFloat(pool.total_wait_time).toLocaleString('en-US', { maximumFractionDigits: 2 })
                    }));
                    return {
                        data: resultArray.length,
                        content: resultArray
                    };
                });
                setPoolDistribution(data);
            })
            .catch((e: any) => {
                console.log('Error occurred while fetching pool distribution');
                console.error(e);
            });
    }, []);

    return (
        <div>
            <GradientBanner>
                <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                    <div className="px-4 pt-6 flex flex-col gap-4 w-full lg:px-10 lg:pt-12 justify-between">
                        <div>
                            <p className="text-2xl font-medium text-[#E6E6E6]">Pool Distribution Graph</p>
                            <p className="mt-1 text-sm font-light text-gray">From Last 5 Epoch</p>
                            <p>Based on the data from the last five epochs (almost 25 days)</p>
                        </div>
                        <div className="flex justify-between md:justify-start md:gap-10">
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#7AE856]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Great Pools</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Suboptimal Pools</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-4 pb-12 lg:px-10 lg:py-8 lg:pb-16">
                        {environments.ENABLE_PERCENTILE_POOL_GRAPH && (
                            <div className="my-5">
                                {poolDistribution ? (
                                    <GradientHealthBar searchQuery={searchQuery} className="absolute" labelData={poolDistribution} labelIsPercentage />
                                ) : (
                                    <div className="h-[450px] isolate overflow-hidden shadow-xl shadow-black/5 grid grid-cols-10 gap-1">
                                        {_.range(0, 10).map((percent, index) => (
                                            <div key={index} className="h-full col-span-1 bg-black animate-pulse flex items-center justify-center"></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {poolData ? (
                            <div className="flex flex-col gap-4">
                                <p>
                                    This graph illustrates how different pools are distributed based on the total time, in seconds, of transactions each pool processed that were waiting in the Mempool for confirmation on the chain. A pool&apos;s rank
                                    improved with mining more disadvantaged transactions that waited longer to be confirmed.
                                    <br /> <br /> You can filter your <span className="font-bold">favorite</span> pool to find out where it ranks.
                                </p>
                                <Box sx={{ flexGrow: 1 }}>
                                    <TextField
                                        placeholder="Search your pool on distribution..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                height: '48px',
                                                background: '#292929',
                                                borderWidth: '1px',
                                                borderColor: 'transparent',
                                                borderRadius: '48px',
                                                maxWidth: '438px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: '#E6E6E6',
                                                paddingX: '16px',
                                                paddingY: '12px',
                                                fontFamily: 'IBM Plex Mono',
                                                fontWeight: 500,
                                                fontSize: '14px',
                                                caretColor: '#E6E6E6',
                                                '&:focus-within fieldset, &:focus-visible fieldset': {
                                                    border: '1px solid #E6E6E6 !important'
                                                }
                                            }
                                        }}
                                        fullWidth
                                        className="flex items-start !font-ibm !text-sm md:text-base"
                                        onChange={handleChange}
                                    />
                                </Box>
                                <BubbleChart data={poolData} searchQuery={searchQuery} tickText="" hoverTextPrefix="secs" stepSize={10} />
                            </div>
                        ) : (
                            <div className="h-[450px] isolate overflow-hidden shadow-xl shadow-black/5 grid grid-cols-10 gap-1 mt-5">
                                {_.range(0, 10).map((percent, index) => (
                                    <div key={index} className="h-full col-span-1 bg-black animate-pulse flex items-center justify-center"></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </GradientBanner>
            <StakePoolTiming totalWaitTime={totalWaitTime} poolData={poolData && Array.isArray(poolData) ? poolData?.slice(0, 12) : []} />
        </div>
    );
}

function mapToPercentiles(waitTimes: number[], data: any[]) {
    // Extract the wait times and calculate the min and max values
    const minValue = Math.min(...waitTimes);
    const maxValue = Math.max(...waitTimes);
    const rangeSize = (maxValue - minValue) / 10;

    // Populate the each percentile by filtering the data
    const result: any = {};
    for (let i = 0; i < 10; i++) {
        const lowerBound = maxValue - i * rangeSize;
        const upperBound = maxValue - (i + 1) * rangeSize;
        const percentileKey = `${100 - i * 10}-${90 - i * 10}`;
        result[percentileKey] = data.filter((item: any) => parseFloat(item.total_wait_time) <= lowerBound && parseFloat(item.total_wait_time) > upperBound);
    }
    return result;
}
