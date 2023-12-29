'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import _ from 'lodash';

import BarChart from '@app/atoms/BarChart';
import GradientTypography from '@app/atoms/GradientTypography';
import TableHeader from '@app/atoms/TableHeader';
import { toMidDottedStr } from '@app/utils/string-utils';


interface IDashboardStakePoolsBannerProps {
    avgWaitTime?: string;
    poolData?: any;
}

export default function StakePoolTiming({ avgWaitTime, poolData }: IDashboardStakePoolsBannerProps) {
    const [poolTimingLabels, setPoolTimingLabels] = useState<string[]>();
    const [poolTimingValues, setPoolTimingValues] = useState<number[]>();

    const getPoolTiming = async () => {
        const response = await fetch('/api/v1/pool/timing');
        return await response.json();
    };

    useEffect(() => {
        getPoolTiming()
            .then((res) => {
                const dataLables: string[] = [];
                const dataValues: number[] = [];
                res.forEach((result: any) => {
                    dataLables.push(result.interval_range + " sec");
                    dataValues.push(result.pool_count);
                });
                setPoolTimingLabels(dataLables);
                setPoolTimingValues(dataValues);
            })
            .catch((e: any) => {
                console.log('Error occured while fetching pool distribution');
                console.error(e);
            });
    }, []);

    return (
        <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3 mb-2">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Stake Pools</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 5 Epochs</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Average Wait Time</p>
                        <p className="text-2xl font-medium text-[#E6E6E6]">{avgWaitTime}</p>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    {poolTimingLabels && poolTimingValues ? (
                        <BarChart labels={poolTimingLabels} data={poolTimingValues} tickText="" hoverTextPrefix='pools' stepSize={50} />
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
                    <p className="text-2xl font-medium text-[#E6E6E6]">Top Stake Pools</p>
                </div>

                <div className="lg:h-[100%] overflow-y-auto">
                    <table className="table-auto w-full pb-6 lg:pb-12">
                        <TableHeader thClassName="md:px-4 lg:px-10" columns={['Pool Hash', 'Avg. Wait Time']} />
                        <tbody className="!text-xs lg:!text-sm !font-normal">
                            {poolData && poolData.length > 0
                                ? poolData.map((pool: any) => (
                                    <tr key={pool.pool_id} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        <td className="py-5 px-4 lg:px-10 text-start">
                                            <GradientTypography>
                                                <Link href={`/pool/${pool.pool_id}`}>{toMidDottedStr(pool.pool_id, 5)}</Link>
                                            </GradientTypography>
                                        </td>
                                        <td className="py-5 px-4 lg:px-10 text-start">
                                            <span className="text-white">{pool.avg_wait_time}</span>
                                        </td>
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
            </div>
        </div>
    );
}