'use client';

import Link from 'next/link';

import _ from 'lodash';

import GradientTypography from '@app/atoms/GradientTypography';
import LineChart from '@app/atoms/LineChart';
import TableHeader from '@app/atoms/TableHeader';
import { toMidDottedStr } from '@app/utils/string-utils';
import Loader from '@app/components/loader';
import { useEffect, useState } from 'react';


interface IDashboardStakePoolsBannerProps {
    poolData?: any;
}


export default function DashboardStakePoolsBanner({ poolData }: IDashboardStakePoolsBannerProps) {

    const [poolTimingLabels, setPoolTimingLabels] = useState<string[]>();
    const [poolTimingValues, setPoolTimingValues] = useState<number[]>();
    const [avgWaitTime, setAvgWaitTime] = useState<string | undefined>();

    const getPoolDistribution = async () => {
        const response = await fetch('/api/v1/pool/timing');
        return await response.json();
    };

    useEffect(() => {
        getPoolDistribution()
            .then((res) => {
                const formatDay = (inputDay: string): string => {
                    const date = new Date(inputDay);
                    const month = date.toLocaleString('en-us', { month: 'short' });
                    const day = date.getDate();
                    return `${month} ${day}`;
                };
                const dataLables: string[] = [];
                const dataValues: number[] = [];
                res.forEach((result: any) => {
                    const formattedTime = formatDay(result.day)
                    dataLables.push(formattedTime);
                    dataValues.push(parseFloat(parseFloat(result.overall_avg_wait_time).toFixed(2)));
                });
                setPoolTimingLabels(dataLables);
                setPoolTimingValues(dataValues);
                setAvgWaitTime(_.mean(dataValues).toFixed(2));
            })
            .catch((e: any) => {
                console.log("Error occured while fetching pool distribution")
                console.error(e);
            })
    }, []);


    return (
        <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3 mb-2">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Stake Pools</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Average Wait Time</p>
                        <p className="text-2xl font-medium text-[#E6E6E6]">{avgWaitTime}</p>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    {poolTimingLabels && poolTimingValues ?
                        <LineChart labels={poolTimingLabels} data={poolTimingValues} tickText="sec" />
                        : <Loader />
                    }
                </div>
            </div>
            <div className="col-span-1">
                <div className="px-4 py-6 lg:px-10 lg:py-12">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Top Stake Pools</p>
                </div>
                {poolData ?
                    <div className="lg:h-[500px] overflow-y-auto">
                        <table className="table-auto w-full pb-6 lg:pb-12">
                            <TableHeader thClassName="md:px-4 lg:px-10" columns={['Pool Hash', 'Avg. Wait Time']} />
                            <tbody className="!text-xs lg:!text-sm !font-normal">
                                {poolData.map((pool: any) => (
                                    <tr key={pool.pool_id} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        <td className="py-5 px-4 lg:px-10 text-start">
                                            <GradientTypography>
                                                <Link href={`/transactions/test`}>{toMidDottedStr(pool.pool_id, 5)}</Link>
                                            </GradientTypography>
                                        </td>
                                        <td className="py-5 px-4 lg:px-10 text-start">
                                            <span className="text-white">{pool.avg_wait_time}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    : <Loader />
                }
            </div>
        </div>
    );
}
