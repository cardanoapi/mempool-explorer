import {useEffect, useState} from 'react';

import TableLayout from '@app/shared/table-layout';
import {
    AddRejectTxClientSideType,
    MempoolTransactionListType,
    MempoolTransactionResponseType,
    RemoveMintedTransactions,
    RemoveTxClientSideType
} from '@app/types/transaction-details-response/socket-response-type';
import {createLinkElementsForCurrentMempoolTransactions, Heading} from '@app/utils/string-utils';
import {MempoolEventType, MempoolLiveViewTableHeaderEnum} from '@app/constants/constants';
import {getRelativeTime} from "@app/utils/cardano-utils";

interface PropType {
    event: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions | undefined;
}

export default function MempoolTransactionsList(props: PropType) {
    const event = props.event as AddRejectTxClientSideType | RemoveTxClientSideType;
    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<any>>([]);

    const getClientSideResponse = () => {
        return currentMempoolTransactions.map(item => ({
            [MempoolLiveViewTableHeaderEnum.hash]: item.hash,
            [MempoolLiveViewTableHeaderEnum.inputs]: item.inputs,
            [MempoolLiveViewTableHeaderEnum.outputs]: item.outputs,
            [MempoolLiveViewTableHeaderEnum.received_time]: item.received_time
        }))
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMempoolTransactions(prevState => {
                return prevState.map(obj => {
                    return {
                        ...obj,
                        received_time: getRelativeTime(new Date(obj.arrival_time))
                    }
                })
            })
        }, 1000)
        return () => clearTimeout(timer);
    }, [])


    const addTransactionToMempoolState = (event: AddRejectTxClientSideType) => {
        const clientSideObject: any = {
            hash: event.hash,
            inputs: event.tx.transaction.inputs,
            outputs: event.tx.transaction.outputs,
            arrival_time: !!event?.arrivalTime ? event.arrivalTime.toString() : "",
            received_time: !!event?.arrivalTime ? getRelativeTime(new Date(event.arrivalTime)) : getRelativeTime(new Date())
        }
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(clientSideObject);
        setCurrentMempoolTransactions([transformedClientSideObject, ...currentMempoolTransactions]);
    };

    const removeTransactionFromMempoolState = (hashes: Array<string>) => {
        let updatedArray = [...currentMempoolTransactions];
        for (let i = 0; i < hashes.length; i++) {
            const hash = hashes[i];
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
                removeTransactionFromMempoolState((event as RemoveMintedTransactions).txHashes)
                break;
            default:
                //TODO: logic on reject event
                return;
        }
    }

    useEffect(() => {
        if (!event) return;
        const nonEmptyEvent = props.event as AddRejectTxClientSideType | RemoveTxClientSideType
        mutateCurrentMempoolStateBasedOnEvent(nonEmptyEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event]);

    return (
        <div className={' w-full h-full p-4 bg-white border-2 overflow-auto '}>
            <div className={"flex justify-between items-start"}>
                <Heading title={`Mempool Transactions`}/>
                <div className={"flex flex-col items-end gap-1"}>
                    <div className={"flex gap-2 items-center"}>
                        <p className={"text-sm text-gray-500"}>Remote Mempool size:&nbsp;<span
                            className={"text-black font-bold"}>{!!event?.mempoolSize ? (event.mempoolSize / 1000) + " Kb" : 0}</span>
                        </p>
                        <p className={"text-sm text-gray-500"}>Tx count:&nbsp;<span
                            className={"text-black font-bold"}>{!!event?.mempoolTxCount ? event.mempoolTxCount : 0}</span>
                        </p>
                    </div>
                    <p className={"text-sm text-gray-500"}>Local Tx count:&nbsp;<span
                        className={"text-black font-bold"}>{currentMempoolTransactions.length}</span></p>
                </div>
            </div>
            <TableLayout data={getClientSideResponse()}/>
        </div>
    );
}
