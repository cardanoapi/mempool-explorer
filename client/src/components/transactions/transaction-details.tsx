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
import {MempoolEventType} from '@app/constants/constants';
import {getRelativeTime} from "@app/utils/cardano-utils";

interface PropType {
    event: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions | undefined;
}

export default function MempoolTransactionsList(props: PropType) {
    const event = props.event;
    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<MempoolTransactionListType>>([]);

    const getClientSideResponse = () => {
        return currentMempoolTransactions.map(item => ({
            hash: item.hash,
            inputs: item.inputs,
            outputs: item.outputs,
            received_time: getRelativeTime(new Date(item.arrival_time))
        }))
    }


    const addTransactionToMempoolState = (event: AddRejectTxClientSideType) => {
        const clientSideObject: MempoolTransactionResponseType = {
            hash: event.hash,
            inputs: event.tx.transaction.inputs,
            outputs: event.tx.transaction.outputs,
            arrival_time: !!event?.arrivalTime ? event.arrivalTime.toString() : "",
        }
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(clientSideObject);
        setCurrentMempoolTransactions([...currentMempoolTransactions, transformedClientSideObject]);
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
            <Heading title={`Mempool Transactions (${currentMempoolTransactions.length})`}/>
            {/*{currentMempoolTransactions.length === 0 ? <EmptyPageIcon message={"Mempool is empty"}/> :*/}
            <TableLayout data={getClientSideResponse()}/>
        </div>
    );
}
