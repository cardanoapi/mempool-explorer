'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { decode } from 'cbor-x';

import CopyIcon from '@app/atoms/Icon/Copy';
import TxIcon from '@app/atoms/Icon/Tx';
import TableTitle from '@app/atoms/TableTitle';
import Loader from '@app/components/loader';
import { checkForErrorResponse } from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import Competitors from '@app/components/transaction-hash/competitors';
import Followups from '@app/components/transaction-hash/followups';
import { DateTimeCustomoptions } from '@app/constants/constants';
import BannerStatCard, { ConfirmBannerStatCard } from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import TxInputOutput from '@app/organisms/TxInputOutput';
import { copyToClipboard } from '@app/utils/utils';


enum MinerEnum {
    block_hash = 'Block Hash',
    block_no = 'Block Number',
    block_time = 'Block Time',
    epoch = 'Epoch',
    in_addrs = 'Address',
    pool_id = 'Pool Id',
    slot_no = 'Slot Number',
    tx_hash = 'Transaction Hash'
}

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

export default function TransactionDetails() {
    const router = useParams();

    const { isLoading, showLoader, hideLoader, error, setError } = useLoader();

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

    useEffect(() => {
        showLoader();
        let minerDetails: any;
        if (router?.id) {
            getMinerDetails(router.id)
                .then((d) => {
                    if (!d.length) {
                        setMiner([]);
                        setTransactionStatus(TransactionStatus.pending);
                    } else {
                        setTransactionStatus(TransactionStatus.confirmed);
                        const date = new Date(d[0]?.block_time);
                        const clientSideObj = {
                            [MinerEnum.block_no]: d[0]?.block_no.toString(),
                            [MinerEnum.epoch]: d[0]?.epoch.toString(),
                            [MinerEnum.slot_no]: parseInt(d[0]?.slot_no).toString(),
                            [MinerEnum.block_hash]: d[0]?.block_hash ? Buffer.from(d[0].block_hash).toString('hex') : '',
                            [MinerEnum.block_time]: new Intl.DateTimeFormat('en-US', DateTimeCustomoptions).format(date),
                            [MinerEnum.pool_id]: d[0]?.pool_id.toString(),
                            [MinerEnum.tx_hash]: d[0]?.tx_hash ? Buffer.from(d[0].tx_hash).toString('hex') : '',
                            confirmationTime: d[0]?.block_time
                        };
                        minerDetails = clientSideObj;
                        setMiner(clientSideObj);
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
                    getTransactionDetails(router.id)
                        .then((d) => {
                            const arrivalTime = new Date(d?.arrivalTime);
                            const arrivalTimeUtc = new Date(arrivalTime.toUTCString());
                            const currentTimeUtc = new Date(new Date().toUTCString());
                            let waitTime;
                            if (minerDetails) {
                                console.log('miner');
                                const confirmTime = new Date(minerDetails.confirmationTime);
                                const confirmTimeUtc = new Date(confirmTime.toUTCString());
                                waitTime = confirmTimeUtc.getTime() - arrivalTimeUtc.getTime();
                                setConfirmationTime(formatDate(confirmTime));
                            } else {
                                waitTime = currentTimeUtc.getTime() - arrivalTimeUtc.getTime();
                            }
                            waitTime = Math.floor(waitTime / 1000);
                            //TODO : Refactor this code to merge wait, arrival time in transaction details object
                            setWaitTime(waitTime);
                            setArrivalTime(formatDate(arrivalTime));
                            setTransactionDetails(d);
                        })
                        .catch((e: any) => {
                            console.error(e);
                            setError({
                                message: e?.message ?? '',
                                status: e?.code
                            });
                        })
                        .finally(() => hideLoader());
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router?.id]);

    const isTransactionPending = transactionStatus === TransactionStatus.pending;
    const isTransactionConfirmed = transactionStatus === TransactionStatus.confirmed;

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
                        <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(miner ? miner[MinerEnum.pool_id] : '-', 'Pool ID')}>
                            <p className="text-base font-normal text-[#B9B9B9] break-all">{isTransactionPending ? 'No Initiator available' : miner[MinerEnum.pool_id]}</p>
                            <CopyIcon />
                        </button>
                    </div>
                </div>
                {transactionDetails ? (
                    <div>
                        <div className="mt-10 h-[1px]" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                            <BannerStatCard title="Arrival Time" value={arrivalTime ?? ''} valueClassName="md:text-lg" />
                            <BannerStatCard title="Wait Time" value={waitTime ? `${waitTime} sec` : 'Loading...'} />
                            <BannerStatCard title="Fee" value={transactionDetails ? `${transactionDetails.fee / 1000000} Ada` : ''} />
                            <BannerStatCard title="Status" value={miner ? 'Confirmed' : 'Pending'} />
                        </div>
                        {isTransactionConfirmed && (
                            <>
                                <div className="mt-10 h-[1px]" />
                                <div className="pt-4 bg-green-300">
                                    <div className="ml-4 text-black text-2xl font-medium">Confirmation Details</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                        <>
                                            <ConfirmBannerStatCard title="Epoch" value={miner[MinerEnum.epoch]} />
                                            <ConfirmBannerStatCard title="Slot No." value={miner[MinerEnum.slot_no]} />
                                            <ConfirmBannerStatCard title="Block No." value={miner[MinerEnum.block_no]} />
                                            <ConfirmBannerStatCard title="Confirmation Time" value={confirmationTime ?? ''} valueClassName="md:text-lg" />
                                        </>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
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
                        <TableTitle title="Follow" className="px-4 py-6 lg:px-10 lg:py-8" />
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