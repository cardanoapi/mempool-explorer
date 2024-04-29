'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import _ from 'lodash';

import { MenuItem, Select, Tooltip } from '@mui/material';

import BarChart from '@app/atoms/BarChart';
import GradientTypography from '@app/atoms/GradientTypography';
import TableHeader from '@app/atoms/TableHeader';
import { PoolDistribution } from '@app/types/poolDistribution';
import { toMidDottedStr } from '@app/utils/string-utils';

interface IDashboardStakePoolsBannerProps {
    totalWaitTime?: string;
    poolData?: PoolDistribution[];
}

export default function StakePoolTiming({ totalWaitTime, poolData }: IDashboardStakePoolsBannerProps) {
    const [selectedFilter, setSelectedFilter] = useState<string>('secs');

    const [poolTimingLabelsHrs, setPoolTimingLabelsHrs] = useState<string[]>([]);
    const [poolTimingLabelsMins, setPoolTimingLabelsMins] = useState<string[]>([]);
    const [poolTimingLabelsSecs, setPoolTimingLabelsSecs] = useState<string[]>([]);

    const [poolTimingLabels, setPoolTimingLabels] = useState<Array<string>>();
    const [selectedPoolTimingLabels, setSelectedPoolTimingLabels] = useState<Array<string>>([]);

    const [poolTimingValues, setPoolTimingValues] = useState<number[]>();

    const getPoolTiming = async () => {
        const response = await fetch('/api/v1/pool/timing');
        return await response.json();
    };

    const parseIntervalRangeToHoursOrMinutes = (intervalRange: string, rangeDivideValue = 60) => {
        const [min, max] = intervalRange.split('-').map((i) => parseInt(i));
        const formattedMin = (min / rangeDivideValue).toLocaleString('en-US', { maximumFractionDigits: 2 });
        const formattedMax = max ? (max / rangeDivideValue).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
        const unit = rangeDivideValue === 3600 ? 'hrs' : rangeDivideValue === 60 ? 'mins' : 'secs';

        if (max) return `${formattedMin} - ${formattedMax} ${unit}`;
        return `${formattedMin}+ ${unit}`;
    };

    useEffect(() => {
        getPoolTiming()
            .then((res) => {
                const labels: string[] = [];
                const values: number[] = [];
                res.forEach((result: any) => {
                    if (result.pool_count === 0) return;
                    if (result.interval_range) labels.push(result.interval_range + ' sec');

                    if (result.pool_count) values.push(parseInt(result.pool_count.toLocaleString('en-US')));
                });
                setPoolTimingLabels(labels);
                setSelectedPoolTimingLabels(labels);

                setPoolTimingValues(values);
            })
            .catch((e: any) => {
                console.log('Error occured while fetching pool distribution');
                console.error(e);
            });
    }, []);

    useEffect(() => {
        if (poolTimingLabels && poolTimingValues) {
            const dataLabels: Array<{ hrs: string; mins: string; secs: string }> = [];

            poolTimingLabels.forEach((label: string) => {
                const hrs = parseIntervalRangeToHoursOrMinutes(label, 3600);
                const mins = parseIntervalRangeToHoursOrMinutes(label, 60);
                const secs = parseIntervalRangeToHoursOrMinutes(label, 1);
                dataLabels.push({ hrs, mins, secs });
            });
            setPoolTimingLabelsHrs(dataLabels.map((label) => label.hrs));
            setPoolTimingLabelsMins(dataLabels.map((label) => label.mins));
            setPoolTimingLabelsSecs(dataLabels.map((label) => label.secs));
        }

        if (selectedFilter === 'hrs') {
            setSelectedPoolTimingLabels(poolTimingLabelsHrs);
        } else if (selectedFilter === 'mins') {
            setSelectedPoolTimingLabels(poolTimingLabelsMins);
        } else {
            setSelectedPoolTimingLabels(poolTimingLabelsSecs);
        }
    }, [selectedFilter, poolTimingLabels, poolTimingValues]);

    return (
        <div className="flex flex-col min-h-[566px] mb-2">
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-12 lg:flex-row lg:justify-between">
                    <div>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Average Transaction Waiting Time Distribution</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 5 Epochs</p>
                    </div>
                    {/* <div>
                        <p className="text-sm font-normal text-[#E6E6E6]">Filter</p>
                        <Select
                            value={selectedFilter}
                            onChange={(e) => {
                                setSelectedFilter(e.target.value);
                            }}
                        >
                            <MenuItem value="hrs">Hours</MenuItem>
                            <MenuItem value="mins">Minutes</MenuItem>
                            <MenuItem value="secs">Seconds</MenuItem>
                        </Select>
                    </div> */}
                </div>
                <p className="px-4 lg:px-10">This bar graph displays the number of stake pools over the past five epochs, categorized by their average transaction wait times.</p>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    {poolTimingLabels && poolTimingValues ? (
                        <BarChart labels={poolTimingLabelsSecs} data={poolTimingValues} tickText="" hoverTextPrefix="pools" stepSize={50} />
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
                    <p className="text-2xl font-medium text-[#E6E6E6]">Top 10 Stake Pools</p>
                    <p className="mt-4 text-sm font-normal text-[#E6E6E6]">The table below ranks pools based on the highest collective wait times of transactions they processed, which were pending in the Mempool awaiting confirmation on the chain.</p>
                </div>

                <div className="lg:h-[100%] overflow-y-auto">
                    <table className="table-auto w-full pb-6 lg:pb-12">
                        <TableHeader thClassName="md:px-4 lg:px-10" columns={['Rank', 'Ticker Name', 'Name', 'Pool Hash', 'Total Wait Time', 'Avg. Wait Time', 'URL', 'Transaction Count']} />
                        <tbody className="!text-xs lg:!text-sm !font-normal">
                            {poolData && poolData.length > 0
                                ? poolData.map((pool: PoolDistribution, idx: number) => {
                                      if (idx >= 10) return null;
                                      const totalWaitTime = parseFloat(pool.total_wait_time);
                                      const avgWaitTime = totalWaitTime / parseInt(pool.tx_count);
                                      return (
                                          <tr key={pool.pool_id} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      <Link href={`/pool/${pool.pool_id}`}>#{idx + 1}</Link>
                                                  </GradientTypography>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      <Link href={`/pool/${pool.pool_id}`}>{pool?.ticker_name ?? '-'}</Link>
                                                  </GradientTypography>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      <Link href={`/pool/${pool.pool_id}`}>{pool?.name ?? '-'}</Link>
                                                  </GradientTypography>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      <Link href={`/pool/${pool.pool_id}`}>{toMidDottedStr(pool.pool_id, 5)}</Link>
                                                  </GradientTypography>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <Tooltip
                                                      className="cursor-pointer"
                                                      title={`Approx. ${totalWaitTime.toLocaleString('en-US', { maximumFractionDigits: 2 })} sec. or ${(totalWaitTime / 60).toLocaleString('en-US', {
                                                          maximumFractionDigits: 2
                                                      })} mins.`}
                                                  >
                                                      <span className="text-white">{(totalWaitTime / 3600).toLocaleString('en-US', { maximumFractionDigits: 2 })} hrs.</span>
                                                  </Tooltip>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <Tooltip
                                                      className="cursor-pointer"
                                                      title={`Approx. ${(avgWaitTime / 3600).toLocaleString('en-US', { maximumFractionDigits: 2 })} hrs. or ${(avgWaitTime / 60).toLocaleString('en-US', {
                                                          maximumFractionDigits: 2
                                                      })} mins.`}
                                                  >
                                                      <span className="text-white">{avgWaitTime.toLocaleString('en-US', { maximumFractionDigits: 2 })} sec.</span>
                                                  </Tooltip>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      {pool?.url ? (
                                                          <Link href={pool.url} target="_blank">
                                                              {pool.url}
                                                          </Link>
                                                      ) : (
                                                          <span>-</span>
                                                      )}
                                                  </GradientTypography>
                                              </td>
                                              <td className="py-5 px-4 lg:px-10 text-start">
                                                  <GradientTypography>
                                                      <Link href={`/pool/${pool.pool_id}`}>{parseInt(pool.tx_count).toLocaleString('en-US')}</Link>
                                                  </GradientTypography>
                                              </td>
                                          </tr>
                                      );
                                  })
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
