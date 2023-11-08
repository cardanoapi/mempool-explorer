'use client';

import React, { useEffect, useState } from 'react';

import GradientBanner from '@app/atoms/GradientBanner';
import LineChart from '@app/atoms/LineChart';

interface IDashboardBannerProps {
    readonly className?: string;
}

export default function DashboardBanner({ className = '' }: IDashboardBannerProps) {
    const [data, setData] = useState<Array<number>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev: Array<number>) => {
                if (prev.length === 7) {
                    prev.shift();
                }
                return [...prev, (Math.random() * 3).toFixed(2) as unknown as number];
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [data]);

    return (
        <GradientBanner minHeight="566px">
            <div className="grid grid-cols-1 min-h-[566px] md:grid-cols-3">
                <div className="col-span-1 border-r-0 border-b-[1px] border-b-[#666666] md:border-r-[1px] md:border-r-[#666666] md:border-b-0">
                    <div className="px-4 py-6 md:px-10 md:py-5 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-2xl font-medium text-[#E6E6E6]">Current Epoch</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Total Transactions</p>
                        <p className="text-base md:text-2xl font-medium text-[#E6E6E6]">35,000</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Average Confirmation Time</p>
                        <p className="text-base md:text-2xl font-medium text-[#E6E6E6]">5.3 sec</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Total Blocks</p>
                        <p className="text-base md:text-2xl font-medium text-[#E6E6E6]">4,235</p>
                    </div>
                    <div className="px-4 py-4 md:px-10 md:py-8 border-b-[1px] border-b-[#303030] last:border-b-0">
                        <p className="text-base font-medium text-[#B9B9B9]">Avg Transaction Per Block</p>
                        <p className="text-base md:text-2xl font-medium text-[#E6E6E6]">4,235</p>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-10 lg:flex-row lg:justify-between">
                        <div>
                            <p className="text-2xl font-medium text-[#E6E6E6]">Transactions Time</p>
                            <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                        </div>
                        <div className="flex gap-12 md:gap-[72px]">
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
                    <div className="md:min-h-[355px] px-4 py-4 md:px-10 md:py-8">
                        <LineChart labels={['Oct 30', 'Oct 31', 'Nov 01', 'Nov 02', 'Nov 03', 'Nov 04', 'Nov 05']} data={data} tickText="sec" />
                    </div>
                </div>
            </div>
        </GradientBanner>
    );
}
