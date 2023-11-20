'use client';

import { useState } from 'react';
import { decode } from 'cbor-x';
import CopyIcon from '@app/atoms/Icon/Copy';
import TxIcon from '@app/atoms/Icon/Tx';
import TableTitle from '@app/atoms/TableTitle';
import { checkForErrorResponse } from '@app/components/loader/error';
import BannerStatCard from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import { copyToClipboard } from '@app/utils/utils';
import GradientHealthBar from '@app/atoms/GradientHealthBar';
import LineChart from '@app/atoms/LineChart';
import TableHeader from '@app/atoms/TableHeader';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import GradientTypography from '@app/atoms/GradientTypography';


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

export default function UserProfile() {

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsInterface | null>(null);
    const [waitTime, setWaitTime] = useState<number>(); // wait time in seconds
    const [arrivalTime, setArrivalTime] = useState<string>();
    const [confirmationTime, setConfirmationTime] = useState<string>();
    const [miner, setMiner] = useState<any>(null);

    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.pending);

    const getTransactionDetails = async (hash: string | string[]) => {
        const response = await fetch(`/api/v1/tx/${hash}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    const getMinerDetails = async (hash: string | string[]) => {
        const response = await fetch(`/api/v1/tx/confirmation?hash=${hash}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    const tableColumns = ['Transaction Hash', 'Amount', 'Wait Time', 'Competing Tx', 'Fee', 'Status'];

    const [transactions, setTransactions] = useState<any[]>([]);

    return (
        <>
            <BannerTitle Icon={TxIcon} breadCrumbText="My Profile" title="Stake Address" bannerClassName="!pb-2 md:!pb-2">
                <div className="px-4 md:px-10">
                    <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard('', 'Transaction hash')}>
                        < p className="text-base font-normal text-[#B9B9B9] break-all" > { }</p>
                        <CopyIcon />
                    </button>
                </div >
                <div>
                    <div className="mt-10 h-[1px]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        <BannerStatCard title="Total Transactions" value={arrivalTime ?? ''} valueClassName='md:text-lg' />
                        <BannerStatCard title="Confirmed Transactions" value={waitTime ? `${waitTime} sec` : 'Loading...'} />
                        <BannerStatCard title="Rejected Transactions" value={transactionDetails ? `${transactionDetails.fee / 1000000} Ada` : ''} />
                        <BannerStatCard title="Average Wait Time" value={miner ? "Confirmed" : "Pending"} />
                    </div>
                </div>
            </BannerTitle >

            <div className="grid grid-cols-1 min-h-[566px] lg:grid-cols-3 mb-2">

                <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                    <div className="px-4 py-6 flex flex-col gap-8 w-full lg:px-10 lg:py-10 lg:flex-row lg:justify-between">
                        <div>
                            <p className="text-2xl font-medium text-[#E6E6E6]">Transactions Time</p>
                            <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                        </div>
                        <div className="flex gap-12 md:gap-[72px]">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <div className="h-2 w-6 rounded bg-[#BD00FF]" />
                                    <p className="text-sm font-normal text-[#E6E6E6]">Last 5 Epoch</p>
                                </div>
                                <p className="text-2xl font-medium text-[#E6E6E6]">.. sec</p>
                            </div>
                            <div>
                                <div className="flex gap-2 items-center">
                                    <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                                    <p className="text-sm font-normal text-[#E6E6E6]">This Epoch</p>
                                </div>
                                <p className="text-2xl font-medium text-[#E6E6E6]">16 sec</p>
                            </div>
                        </div>
                    </div>
                    <LineChart labels={["1", "2", "3"]} data={[1, 2]} secondData={[2, 4]} tickText="sec" />
                </div>
                <div className="col-span-1 px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    <div className='mb-24'>
                        <p className="text-2xl font-medium text-[#E6E6E6]">Transactions Time</p>
                        <p className="text-sm font-normal text-[#E6E6E6]">Last 7 days</p>
                    </div>
                    <GradientHealthBar
                        labels={[
                            {
                                text: 'Great',
                                textPosition: 'start'
                            },
                            {
                                text: 'Good',
                                textPosition: 'center'
                            },
                            {
                                text: 'Bad',
                                textPosition: 'end'
                            }
                        ]}
                        labelIndicator="good"
                    />
                    <p className='mt-24 !text-[#B9B9B9] !text-sm md:!text-base !font-normal'>Your wait time is right on par with the global average, indicating a standard and comfortable experience.</p>
                </div>
            </div>

            <TableTitle title="Transaction History" className="px-4 py-6 lg:px-10 lg:py-8" />
            <table className="table-auto w-full">
                <TableHeader columns={tableColumns} />
                <tbody className="!text-xs md:!text-sm !font-medium">
                    {transactions.length ? (
                        transactions.map((row, idx) => (
                            <tr key={idx} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                {Object.keys(row).map((rowKey: string, index: number) => {
                                    let content = <span>ok</span>;
                                    content = <GradientTypography>{1}</GradientTypography>;

                                    return (
                                        <td key={index} className="py-5 px-4 md:px-10 text-start">
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))) :
                        < TableEmptyElement />
                    }
                </tbody>
            </table>
        </>
    );
}

function formatDate(date: Date) {
    const options: any = {
        weekday: 'short', // Abbreviated day name (e.g., Fri)
        month: 'short',   // Abbreviated month name (e.g., Aug)
        day: 'numeric',   // Numeric day of the month (e.g., 4)
        year: 'numeric',  // Numeric year (e.g., 2023)
        hour: 'numeric',  // Numeric hours (e.g., 12)
        minute: 'numeric', // Numeric minutes (e.g., 40)
        second: 'numeric', // Numeric seconds (e.g., 20)
        hour12: true      // Use 12-hour clock format
    };

    return date.toLocaleString('en-US', options);
}