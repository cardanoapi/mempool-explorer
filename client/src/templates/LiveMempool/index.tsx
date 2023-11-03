'use client';

import { useEffect, useState } from 'react';

import PlayIcon from '@app/atoms/Icon/Play';
import { MempoolEventType, MempoolLiveViewTableHeaderEnum } from '@app/constants/constants';
import BannerStatCard from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import Navbar from '@app/molecules/Navbar';
import LatestBlockList from '@app/organisms/LatestBlockList';
import LiveMempoolList from '@app/organisms/LiveMempoolList';
import MempoolTransactionList from '@app/organisms/MempoolTransactionList';
import { AddRejectTxClientSideType, MempoolTransactionResponseType, RemoveMintedTransactions, RemoveTxClientSideType } from '@app/types/clientside/dashboard';
import { getRelativeTime } from '@app/utils/cardano-utils';
import { createLinkElementsForCurrentMempoolTransactions } from '@app/utils/string-utils';

interface ILiveMempoolProps {
    mempoolEvent?: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions;
}
export default function LiveMempool({ mempoolEvent }: ILiveMempoolProps) {
    const [eventLogList, setEventLogList] = useState<Array<typeof mempoolEvent>>([]);
    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<MempoolTransactionResponseType>>([]);

    const mempoolAddRemoveType = mempoolEvent as AddRejectTxClientSideType | RemoveTxClientSideType;

    const mempoolSize = (mempoolAddRemoveType?.mempoolSize || 0) / 1000 + ' Kb';
    const mempoolTxCount = mempoolAddRemoveType?.mempoolTxCount || 0;

    useEffect(() => {
        if (!mempoolEvent) return;

        setEventLogList([mempoolEvent, ...eventLogList]);
    }, [mempoolEvent]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMempoolTransactions((prevState) => {
                return prevState.map((obj) => {
                    return {
                        ...obj,
                        received_time: getRelativeTime(new Date(obj.arrival_time))
                    };
                });
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [mempoolEvent]);

    useEffect(() => {
        if (!mempoolEvent) return;
        const nonEmptyEvent = mempoolEvent as AddRejectTxClientSideType | RemoveTxClientSideType;
        mutateCurrentMempoolStateBasedOnEvent(nonEmptyEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mempoolEvent]);

    const addTransactionToMempoolState = (event: AddRejectTxClientSideType) => {
        const clientSideObject: MempoolTransactionResponseType = {
            hash: event.hash,
            inputs: event.tx.transaction.inputs,
            outputs: event.tx.transaction.outputs,
            arrival_time: event?.arrivalTime ? event.arrivalTime.toString() : '',
            received_time: event?.arrivalTime ? getRelativeTime(new Date(event.arrivalTime)) : getRelativeTime(new Date())
        };
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(clientSideObject);
        setCurrentMempoolTransactions([transformedClientSideObject, ...currentMempoolTransactions]);
    };

    const removeTransactionFromMempoolState = (hashes: Array<string>) => {
        let updatedArray = [...currentMempoolTransactions];
        for (const hash of hashes) {
            updatedArray = updatedArray.filter((item: any) => item.hash.key.toLowerCase() !== hash.toLowerCase());
        }
        setCurrentMempoolTransactions(updatedArray);
    };

    function mutateCurrentMempoolStateBasedOnEvent(event: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions) {
        switch (event.action) {
            case MempoolEventType.Remove:
                const removeEvent = event as RemoveTxClientSideType;
                removeTransactionFromMempoolState(removeEvent.txHashes);
                break;
            case MempoolEventType.Add:
                const addEvent = event as AddRejectTxClientSideType;
                addTransactionToMempoolState(addEvent);
                break;
            case MempoolEventType.Mint:
                removeTransactionFromMempoolState((event as RemoveMintedTransactions).txHashes);
                break;
            default:
                //TODO: logic on reject event
                return;
        }
    }

    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <BannerTitle Icon={PlayIcon} breadCrumbText="Live Mempool" title="Live Mempool">
                <div className="mt-10 h-[1px]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <BannerStatCard title="Remote Mempool Size" value={mempoolSize} />
                    <BannerStatCard title="Tx Count" value={mempoolTxCount} />
                    <BannerStatCard title="Browser Tx Count" value={currentMempoolTransactions.length} />
                </div>
            </BannerTitle>
            <div className="min-h-screen">
                <div className="grid grid-cols-1 xl:grid-cols-2">
                    <LiveMempoolList tableTitle="Events" eventLogList={eventLogList} />
                    <MempoolTransactionList
                        tableTitle="Mempool Transactions"
                        data={currentMempoolTransactions.map((item) => ({
                            [MempoolLiveViewTableHeaderEnum.hash]: item.hash,
                            [MempoolLiveViewTableHeaderEnum.inputs]: item.inputs,
                            [MempoolLiveViewTableHeaderEnum.outputs]: item.outputs,
                            [MempoolLiveViewTableHeaderEnum.received_time]: item.received_time
                        }))}
                    />
                </div>
                <LatestBlockList
                    tableTitle="Latest Blocks"
                    data={currentMempoolTransactions.map((item) => ({
                        [MempoolLiveViewTableHeaderEnum.hash]: item.hash,
                        [MempoolLiveViewTableHeaderEnum.inputs]: item.inputs,
                        [MempoolLiveViewTableHeaderEnum.outputs]: item.outputs,
                        [MempoolLiveViewTableHeaderEnum.received_time]: item.received_time
                    }))}
                />
            </div>
        </main>
    );
}
