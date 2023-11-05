'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import _ from 'lodash';

import GradientButton from '@app/atoms/Button/GradientButton';
import GradientTypography from '@app/atoms/GradientTypography';
import TableHeader from '@app/atoms/TableHeader';
import { toMidDottedStr } from '@app/utils/string-utils';

export default function DashboardMempoolBanner() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Transactions Time</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                    </div>
                    <div className="flex gap-12 lg:gap-[72px]">
                        <div>
                            <p className="text-sm font-normal text-[#E6E6E6]">Global</p>
                            <p className="text-2xl font-medium text-[#E6E6E6]">2.00 sec</p>
                        </div>
                        <div>
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">This Epoch</p>
                            </div>
                            <p className="text-2xl font-medium text-[#E6E6E6]">2.80 sec</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 min-h-[355px]">{/* Add chartjs here */}</div>
            </div>
            <div className="col-span-1">
                <div className="px-4 py-6 lg:px-10 lg:py-12">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Current Epoch</p>
                </div>
                <table className="table-auto w-full">
                    <TableHeader thClassName="md:px-4 lg:px-10" columns={['Tx Hash', 'Arrival Time']} />

                    <tbody className="!text-xs lg:!text-sm !font-normal">
                        {_.range(5).map((_) => (
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
                <div className="p-4 lg:p-10">
                    <GradientButton size="large" fullWidth onClick={() => router.push('/mempool')}>
                        Show Live Data
                    </GradientButton>
                </div>
            </div>
        </div>
    );
}
