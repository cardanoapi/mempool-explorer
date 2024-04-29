'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import api from '@app/api/axios';
import CopyIcon from '@app/atoms/Icon/Copy';
import TxIcon from '@app/atoms/Icon/Tx';
import TableTitle from '@app/atoms/TableTitle';
import Loader from '@app/components/loader';
import useLoader from '@app/components/loader/useLoader';
import Competitors from '@app/components/transaction-hash/competitors';
import Followups from '@app/components/transaction-hash/followups';
import BannerStatCard, { ConfirmBannerStatCard } from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import TxInputOutput from '@app/organisms/TxInputOutput';
import { copyToClipboard } from '@app/utils/utils';

type ConfirmationDetails = {
    block_hash: string;
    block_no: number;
    slot_no: number;
    block_time: string;
    epoch: number;
    pool_id: string;
};

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
    rejected = 'Rejected',
    notInOurPool = 'Not in our pool'
}

export default function TransactionDetails() {
    const router = useParams();
    const tx_hash = router.id;

    const [isLoading, setLoading] = useState<boolean>(false);

    const { error, setError } = useLoader();

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsInterface | null>(null);
    const [waitTime, setWaitTime] = useState<any>(); // wait time in seconds
    const [arrivalTime, setArrivalTime] = useState<string>();
    const [confirmationTime, setConfirmationTime] = useState<string>();
    const [miner, setMiner] = useState<ConfirmationDetails>();

    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.pending);

    const getTransactionDetails = async (hash: string | string[]) => {
        const res = await api.get(`/tx/${hash}`);
        return res.data;
    };

    const getMinerDetails = async (hash: string | string[]) => {
        const res = await api.get(`tx/confirmation?hash=${hash}`);
        return res.data;
    };

    useEffect(() => {
        let minerDetails: any;
        setLoading(true);
        getMinerDetails(tx_hash)
            .then((minerData) => {
                if (!minerData.length) {
                    setTransactionStatus(TransactionStatus.pending);
                } else {
                    setTransactionStatus(TransactionStatus.confirmed);
                    const miner = minerData[0];
                    // const date = new Date(miner?.block_time);
                    // const clientSideObj = {
                    //     [MinerEnum.block_no]: d[0]?.block_no.toString(),
                    //     [MinerEnum.epoch]: d[0]?.epoch.toString(),
                    //     [MinerEnum.slot_no]: parseInt(d[0]?.slot_no).toString(),
                    //     [MinerEnum.block_hash]: d[0]?.block_hash ? Buffer.from(d[0].block_hash).toString('hex') : '',
                    //     [MinerEnum.block_time]: new Intl.DateTimeFormat('en-US', DateTimeCustomoptions).format(date),
                    //     [MinerEnum.pool_id]: d[0]?.pool_id.toString(),
                    //     [MinerEnum.tx_hash]: d[0]?.tx_hash ? Buffer.from(d[0].tx_hash).toString('hex') : '',
                    //     confirmationTime: d[0]?.block_time
                    // };
                    minerDetails = miner;
                    setMiner(miner);
                }
            })
            .catch((e: any) => {
                console.error(e);
                setError({
                    message: e?.message ?? '',
                    status: e?.code
                });
            })
            .finally(() => {
                getTransactionDetails(tx_hash)
                    .then((d) => {
                        if (d == '') {
                            setTransactionStatus(TransactionStatus.notInOurPool);
                            return;
                        }
                        if (d?.arrivalTime !== 'N/A') {
                            const arrivalTime = new Date(d?.arrivalTime);
                            const arrivalTimeUtc = new Date(arrivalTime.toUTCString());
                            const currentTimeUtc = new Date(new Date().toUTCString());
                            let waitTime;
                            if (minerDetails) {
                                const confirmTime = new Date(minerDetails.block_time);
                                const confirmTimeUtc = new Date(confirmTime.toUTCString());
                                waitTime = confirmTimeUtc.getTime() - arrivalTimeUtc.getTime();
                                setConfirmationTime(formatDate(confirmTime));
                            } else {
                                waitTime = currentTimeUtc.getTime() - arrivalTimeUtc.getTime();
                            }
                            waitTime = Math.floor(waitTime / 1000);
                            setWaitTime(waitTime);
                            setArrivalTime(formatDate(arrivalTime));
                        } else {
                            setArrivalTime(d?.arrivalTime);
                            setWaitTime('N/A');
                            if (minerDetails) {
                                setConfirmationTime(formatDate(new Date(minerDetails.block_time)));
                            }
                        }
                        setTransactionDetails(d);
                    })
                    .catch((e: any) => {
                        console.error(e);
                        setError({
                            message: e?.message ?? '',
                            status: e?.code
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            });
    }, [tx_hash]);

    const isTransactionPending = transactionStatus === TransactionStatus.pending;
    const isTransactionConfirmed = transactionStatus === TransactionStatus.confirmed;
    const isTransactionNotInOurPool = transactionStatus === TransactionStatus.notInOurPool;

    return (
        <>
            <BannerTitle Icon={TxIcon} breadCrumbText="Transaction" title="Transaction" bannerClassName="!pb-2 md:!pb-2">
                <div className="px-4 md:px-10">
                    <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(router?.id.toString() || '', 'Transaction hash')}>
                        <p className="text-base font-normal text-[#B9B9B9] break-all">{router?.id}</p>
                        <CopyIcon />
                    </button>
                    <div className="py-4 md:py-10">
                        <p className="text-lg md:text-xl font-medium">{isTransactionPending ? 'Initiation' : 'Pool ID'}</p>
                        <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(miner ? miner.pool_id : '-', 'Pool ID')}>
                            <p className="text-base font-normal text-[#B9B9B9] break-all">{isTransactionPending ? 'No Initiator available' : miner?.pool_id}</p>
                            <CopyIcon />
                        </button>
                    </div>
                </div>
                {!isLoading ? (
                    isTransactionNotInOurPool ? (
                        miner ? (
                            <div className="text-lg font-medium mb-2">
                                <p className='text-center text-green-500'>This transaction is confirmed.</p>
                                <div
                                    className='flex flex-col items-center text-center mt-4 group'
                                >

                                    <div
                                        className='flex items-center justify-center gap-2 text-red-500 mt-2 pb-4'
                                    >
                                        <p>Transaction is not yet detected on our explorer Mempool.</p>
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>


                                    <p className='mb-2 text-gray-500 hidden opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity duration-300 pb-4'>
                                        It is possible in Cardano Blockchain Network that explorer node like this may not always receive all mempool transactions.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-lg font-medium mb-2">
                                <p className='text-red-500'>Transaction details is not available yet. Our explorer node might not have recevied this transaction yet.</p>
                            </div>
                        )

                    ) :
                        (
                            <div>
                                <div className="mt-10 h-[1px]" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                    <BannerStatCard title="Arrival Time" value={arrivalTime ?? ''} valueClassName="md:text-lg" />
                                    <BannerStatCard title="Wait Time" value={waitTime ? (waitTime !== 'N/A' ? `${waitTime} sec` : waitTime) : 'Loading...'} />
                                    <BannerStatCard title="Fee" value={transactionDetails ? `${transactionDetails.fee / 1000000} Ada` : ''} />
                                    <BannerStatCard title="Status" value={miner ? 'Confirmed' : 'Pending'} />
                                </div>
                                {isTransactionConfirmed && (
                                    <>
                                        <div className="mt-10 h-[1px]" />
                                        <div className="bg-green-300">
                                            <div className="px-4 py-10 md:px-10 text-black text-2xl font-medium">Confirmation Details</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                                <ConfirmBannerStatCard title="Epoch" value={miner?.epoch ?? ''} />
                                                <ConfirmBannerStatCard title="Slot No." value={miner?.slot_no ?? ''} />
                                                <ConfirmBannerStatCard title="Block No." value={miner?.block_no ?? ''} />
                                                <ConfirmBannerStatCard title="Confirmation Time" value={confirmationTime ?? ''} valueClassName="md:text-lg" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )

                ) : (
                    <Loader />
                )}
            </BannerTitle>
            <div className="grid grid-cols-1 min-h-screen lg:grid-cols-3 lg:h-screen lg:overflow-hidden">
                <div className="col-span-1 border-r-0 border-b-[1px] border-b-[#666666] md:scrollable-table overflow-auto md:border-r-[1px] md:border-r-[#666666] md:border-b-0 pb-8">
                    <TableTitle title="Overview" className="px-4 py-6 lg:px-10 lg:py-8" />
                    <TxInputOutput isLoading={isLoading} error={error} txInputOutputs={transactionDetails?.tx} inputResolvedAddress={transactionDetails?.inputAddress} />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                    <div className="border-b-[1px] boder-b-[#666666]">
                        <TableTitle title="Competitors" className="px-4 py-6 lg:px-10 lg:py-8" />
                        <Competitors isLoading={isLoading} error={error} competing={transactionDetails?.competing} />
                    </div>
                    <div className="border-b-[1px] boder-b-[#666666]">
                        <TableTitle title="Follow Ups" className="px-4 py-6 lg:px-10 lg:py-8" />
                        <Followups isLoading={isLoading} error={error} followups={transactionDetails?.followups} />
                    </div>
                </div>
            </div>
        </>
    );
}

function formatDate(date: Date) {
    const options: any = {
        weekday: 'short', // Abbreviated day name (e.g., Fri)
        month: 'short', // Abbreviated month name (e.g., Aug)
        day: 'numeric', // Numeric day of the month (e.g., 4)
        year: 'numeric', // Numeric year (e.g., 2023)
        hour: 'numeric', // Numeric hours (e.g., 12)
        minute: 'numeric', // Numeric minutes (e.g., 40)
        second: 'numeric', // Numeric seconds (e.g., 20)
        hour12: true // Use 12-hour clock format
    };

    return date.toLocaleString('en-US', options);
}
