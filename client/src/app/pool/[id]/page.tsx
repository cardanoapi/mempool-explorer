'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import _ from 'lodash';

import api from '@app/api/axios';
import { getEpochDetails } from '@app/api/epoch';
import BarChart from '@app/atoms/BarChart';
import GradientButton from '@app/atoms/Button/GradientButton';
import GradientTypography from '@app/atoms/GradientTypography';
import CopyIcon from '@app/atoms/Icon/Copy';
import PoolIcon from '@app/atoms/Icon/Pool';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import BannerStatCard from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import { PoolDistribution } from '@app/types/poolDistribution';
import { parseDateStrToDate, toHourMinStr, toMonthDateYearStr } from '@app/utils/date-utils';
import { toMidDottedStr } from '@app/utils/string-utils';
import { copyToClipboard } from '@app/utils/utils';

type TransactionDetailsInterface = {
    tx: any;
    arrivalTime: string;
    competing: Array<any>;
    followups: Array<any>;
    inputAddress: any;
    fee: number;
};

// Define typescript enum for transaction status pending, confirmed, rejected
enum TransactionStatus {
    pending = 'Pending',
    confirmed = 'Confirmed',
    rejected = 'Rejected'
}

type PoolTimingInterface = {
    interval_range: string;
    transaction_count: number;
};

export default function PoolDetails() {
    const router = useParams();
    const isMobile = useIsMobile();
    const poolId = router.id as string;

    const [poolData, setPoolData] = useState<PoolDistribution[]>([]);
    const [poolInfo, setPoolInfo] = useState<any>();
    const [poolExternalLink, setPoolExternalLink] = useState<string>();

    const [poolTimingIntervalRanges, setPoolTimingIntervalRanges] = useState<string[]>([]);
    const [poolTimingTxCount, setPoolTimingTxCount] = useState<number[]>([]);
    const [epochTxCountData, setEpochTxCountData] = useState<any[]>([]);

    const [transactions, setTransactions] = useState<any[]>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);

    const [last5EpochAvgWaitTime, setLast5EpochAvgWaitTime] = useState<string>();
    const [previousEpochWaitTime, setPreviousEpochWaitTime] = useState<string>();
    const [currentEpochWaitTime, setCurrentEpochWaitTime] = useState<string>();

    const txHistoryColumns = ['Transaction Hash', 'Epoch', 'Slot No', 'Block No', 'Received Time', 'Confirmation Time', 'Wait Time (sec)'];
    const latestEpochColumns = ['Epoch', 'Transactions', 'Avg. Wait Time (sec)', 'Total Wait Time (sec)'];

    const getTransactionTimingOfPool = async (poolId: string) => {
        const response = await api.get(`/pool/${poolId}/timing`);
        return await response.data;
    };

    const getTransactionHistoryOfPool = async (poolId: string, pageNumber: number) => {
        const response = await api.get(`/pool/${poolId}/transactions`, {
            params: {
                pageNumber: pageNumber
            }
        });
        return await response.data;
    };

    const getEpochWiseInfoOfPool = async (poolId: string) => {
        const response = await api.get(`/pool/${poolId}/epoch`);
        return await response.data;
    };

    const getPoolDistribution = async () => {
        const response = await fetch('/api/v1/pool/distribution');
        return await response.json();
    };

    const getPoolExternalLink = (poolId: string) => {
        if (poolData && poolData.length > 0) {
            const poolIdx = poolData.findIndex((pool) => pool.pool_id === poolId);
            const pool: any = poolData[poolIdx];
            pool.rank = poolIdx + 1;
            setPoolInfo(pool);
            if (pool?.url) {
                return pool.url;
            }
        }
        return '';
    };

    useEffect(() => {
        getPoolDistribution()
            .then((res: PoolDistribution[]) => {
                if (res) {
                    const poolDistribution = res.slice()
                    .reverse()
                    .sort((a, b) => {
                        return parseFloat(b.total_wait_time) - parseFloat(a.total_wait_time);
                        // return parseFloat(a.total_wait_time) - parseFloat(b.total_wait_time);
                    })
                    setPoolData(poolDistribution);
                }
            })
            .catch((e: any) => {
                console.log('Error occurred while fetching pool distribution');
                console.error(e);
            });
    }, []);

    useEffect(() => {
        if (poolData) {
            const poolLink = getPoolExternalLink(poolId);
            setPoolExternalLink(poolLink);
        }
    }, [poolData]);

    useEffect(() => {
        getTransactionTimingOfPool(poolId)
            .then((timingData) => {
                const intervalRanges = timingData.map((data: PoolTimingInterface) => data.interval_range + ' sec');
                const txCount = timingData.map((data: PoolTimingInterface) => data.transaction_count);
                setPoolTimingIntervalRanges(intervalRanges);
                setPoolTimingTxCount(txCount);
            })
            .catch((e: any) => {
                console.log('Error occurred while fetching pool timing data.');
                console.error(e);
            });

        getEpochDetails()
            .then((epochDetails) => {
                const current_epoch = epochDetails.epoch_number;

                getEpochWiseInfoOfPool(poolId)
                    .then((epochWiseData) => {
                        setEpochTxCountData(
                            epochWiseData.map((epochData: any) => {
                                if (epochData?.tx_count && epochData?.avg_wait_time) {
                                    return {
                                        epoch: epochData.epoch,
                                        transactions: epochData.tx_count,
                                        avg_wait_time: parseFloat(epochData.avg_wait_time).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' sec',
                                        total_wait_time: (parseFloat(epochData.avg_wait_time) * parseInt(epochData.tx_count)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' sec'
                                    };
                                }
                                return epochData;
                            })
                        );

                        const last5EpochAvgWaitTime = _.mean(epochWiseData.map((epochData: any) => parseFloat(epochData.avg_wait_time))).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' sec';
                        setLast5EpochAvgWaitTime(last5EpochAvgWaitTime);

                        const previousEpochWaitTime = epochWiseData.find((epochData: any) => epochData.epoch === current_epoch - 1)?.avg_wait_time?.toLocaleString('en-US', { maximumFractionDigits: 2 });
                        if (previousEpochWaitTime) {
                            setPreviousEpochWaitTime(previousEpochWaitTime + ' sec');
                        } else {
                            setPreviousEpochWaitTime('N/A');
                        }

                        const currentEpochWaitTime = epochWiseData.find((epochData: any) => epochData.epoch === current_epoch)?.avg_wait_time?.toLocaleString('en-US', { maximumFractionDigits: 2 });
                        if (currentEpochWaitTime) {
                            setCurrentEpochWaitTime(currentEpochWaitTime + ' sec');
                        } else {
                            setCurrentEpochWaitTime('N/A');
                        }
                    })
                    .catch((e: any) => {
                        console.log('Error occurred while fetching epoch details for pool.');
                        console.error(e);
                    });
            })
            .catch((e: any) => {
                console.log('Error occurred while fetching current epoch details');
                console.error(e);
            });
    }, [poolId]);

    useEffect(() => {
        setIsTransactionLoading(true);
        getTransactionHistoryOfPool(poolId, pageNumber)
            .then((data) => {
                if (transactions) {
                    setTransactions(transactions.concat(data));
                } else {
                    setTransactions(data);
                }
                setIsTransactionLoading(false);
            })
            .catch((e: any) => {
                console.log('Error occurred while fetching pool transaction history.');
                console.error(e);
            });
    }, [pageNumber]);

    return (
        <div className="mb-4">
            <BannerTitle Icon={PoolIcon} breadCrumbText="Pool" title={`Pool ID ${poolInfo?.rank ? '(Rank #' + poolInfo.rank + ')' : ''}`} bannerClassName="!pb-2 md:!pb-2" minHeight="">
                <div className="px-4 md:px-10 pb-10 flex flex-col gap-4">
                    <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(poolId, 'Pool ID')}>
                        <p className="text-base font-normal text-[#B9B9B9] break-all"> {poolId}</p>
                        <CopyIcon />
                    </button>
                    <p className="text-lg font-medium text-[#E6E6E6]">
                        {poolInfo?.ticker_name && <span>[{poolInfo?.ticker_name}]</span>} {poolInfo?.name}
                    </p>
                    {poolExternalLink && (
                        <GradientButton fullWidth={false} className="flex gap-4 w-fit !h-10 items-center cursor-default" onClick={() => copyToClipboard(poolExternalLink, 'Pool Link')}>
                            <Link target="_blank" href={poolExternalLink} className="flex gap-2 items-center cursor-pointer hover:underline">
                                <p className="text-base lowercase font-normal break-all"> {poolExternalLink.toLowerCase()}</p>
                            </Link>
                            <CopyIcon stroke="#0D0D0D" className="cursor-pointer text-inherit" />
                        </GradientButton>
                    )}
                </div>
                <div>
                    <div className="mt-10 h-[1px]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        <BannerStatCard isLoading={!poolInfo?.tx_count} title="Last 5 Epoch Total Transactions" value={parseInt(poolInfo?.tx_count).toLocaleString('en-US') ?? '-'} />
                        <BannerStatCard isLoading={!last5EpochAvgWaitTime} title="Last 5 Epoch Average Transaction Wait Time" value={last5EpochAvgWaitTime ?? '-'} />
                        <BannerStatCard isLoading={!previousEpochWaitTime} title="Last Epoch Average Transaction Wait Time" value={previousEpochWaitTime ?? '-'} />
                        <BannerStatCard isLoading={!currentEpochWaitTime} title="This Epoch Average Transaction Wait Time" value={currentEpochWaitTime ?? '-'} />
                    </div>
                </div>
            </BannerTitle>

            <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3 mb-2">
                <div className="px-4 py-4 lg:px-10 lg:py-8 col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                    <div className="flex flex-col gap-8 w-full mb-10">
                        <div className="">
                            <p className="text-2xl font-medium text-[#E6E6E6]">Transaction Waiting Time Distribution</p>
                            <p className="text-sm font-normal text-[#E6E6E6]">Last 5 epochs</p>
                        </div>

                        <p>The graph shows the total number of transactions processed by this pool over the past five epochs, grouped by specific time intervals.</p>

                        {/* <div className="flex gap-12 md:gap-[72px]">
                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">This Epoch</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <div className="h-2 w-6 rounded bg-[#BD00FF]" />
                                <p className="text-sm font-normal text-[#E6E6E6]">Last Epoch</p>
                            </div>
                        </div> */}
                    </div>
                    <BarChart
                        xTitle={{ display: true, text: 'Transaction Wait Time (Seconds)' }}
                        yTitle={{ display: true, text: 'Number of transactions' }}
                        labels={poolTimingIntervalRanges}
                        data={poolTimingTxCount}
                        tickText=""
                        hoverTextPrefix="transactions"
                        stepSize={5}
                    />
                </div>

                <div className="col-span-1 lg:min-h-[355px] overflow-y-auto">
                    <TableTitle title="Latest Epochs" className="px-4 py-4 lg:px-10 lg:py-8 " />
                    <table className="table-auto w-full">
                        <TableHeader columns={latestEpochColumns} />
                        <tbody className="!text-xs md:!text-sm !font-medium">
                            {epochTxCountData.length ? (
                                epochTxCountData.map((row, idx) => (
                                    <tr key={idx} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        {Object.keys(row).map((rowKey: string, index: number) => {
                                            return (
                                                <td key={index} className="py-5 px-4 md:px-10 text-start">
                                                    <GradientTypography>{row[rowKey]}</GradientTypography>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <TableEmptyElement />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TableTitle title="Transaction History" className="px-4 py-6 lg:px-10 lg:py-8" />
            <div className="overflow-y-auto">
                <table className="table-auto w-full">
                    <TableHeader columns={txHistoryColumns} />
                    <tbody className="!text-xs md:!text-sm !font-medium">
                        {transactions?.length ? (
                            <>
                                {transactions.map((row, idx) => (
                                    <tr key={idx} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        {Object.keys(row).map((rowKey: string, index: number) => {
                                            if (rowKey === 'received_time' || rowKey === 'confirmation_time' || rowKey === 'wait_time') {
                                                if (toMonthDateYearStr(parseDateStrToDate(row[rowKey])) === 'Invalid Date') {
                                                    return (
                                                        <td key={index} className="py-5 px-4 md:px-10 text-start">
                                                            -
                                                        </td>
                                                    );
                                                }
                                            }
                                            return (
                                                <td key={index} className="py-5 px-4 md:px-10 text-start">
                                                    {rowKey === 'tx_hash' ? (
                                                        <a href={'/transactions/' + row[rowKey]}>
                                                            <GradientTypography>{toMidDottedStr(row[rowKey], isMobile ? 3 : 5)}</GradientTypography>
                                                        </a>
                                                    ) : rowKey === 'received_time' || rowKey === 'confirmation_time' ? (
                                                        <GradientTypography>
                                                            {toMonthDateYearStr(parseDateStrToDate(row[rowKey]))} {toHourMinStr(parseDateStrToDate(row[rowKey]))}
                                                        </GradientTypography>
                                                    ) : (
                                                        <GradientTypography>{row[rowKey]}</GradientTypography>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {isTransactionLoading && (
                                    <tr className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        <td colSpan={6} className="py-5 px-4 md:px-10 text-start">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ) : (
                            <TableEmptyElement />
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-6 lg:px-10 lg:py-8">
                <GradientButton
                    size="large"
                    onClick={() => {
                        setPageNumber(pageNumber + 1);
                    }}
                >
                    Show More
                </GradientButton>
            </div>
        </div>
    );
}
