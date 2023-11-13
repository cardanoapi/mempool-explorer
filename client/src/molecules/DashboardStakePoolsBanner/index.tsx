'use client';

import Link from 'next/link';

import _ from 'lodash';

import GradientTypography from '@app/atoms/GradientTypography';
import LineChart from '@app/atoms/LineChart';
import TableHeader from '@app/atoms/TableHeader';
import { toMidDottedStr } from '@app/utils/string-utils';

export default function DashboardStakePoolsBanner() {
    return (
        <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Stake Pools</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Average Wait Time</p>
                        <p className="text-2xl font-medium text-[#E6E6E6]">2.00 sec</p>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    <LineChart labels={['10m', '9m', '8m', '7m', '6m', '5m', '4m', '3m', '2m', '1m']} data={[1.6, 2.8, 1.3, 3.5, 2.4, 1.9, 2.2, 3.3, 2.1, 1.9]} tickText="sec" />
                </div>
            </div>
            <div className="col-span-1">
                <div className="px-4 py-6 lg:px-10 lg:py-12">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Top Stake Pools</p>
                </div>
                <table className="table-auto w-full pb-6 lg:pb-12">
                    <TableHeader thClassName="md:px-4 lg:px-10" columns={['Pool Hash', 'Avg. Wait Time']} />

                    <tbody className="!text-xs lg:!text-sm !font-normal">
                        {_.range(9).map((_) => (
                            <tr key={_} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                <td className="py-5 px-4 lg:px-10 text-start">
                                    <GradientTypography>
                                        <Link href={`/transactions/test`}>{toMidDottedStr('0ae12b111115f99aed', 5)}</Link>
                                    </GradientTypography>
                                </td>
                                <td className="py-5 px-4 lg:px-10 text-start">
                                    <span className="text-white">10 sec ago</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}