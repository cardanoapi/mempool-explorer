import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Layout from '@app/shared/layout';
import TableLayout from '@app/shared/table-layout';
import { AddRejectTxClientSideType, MempoolTransactionListType, MempoolTransactionResponseType, RemoveTxClientSideType, SocketEventResponseType } from '@app/types/transaction-details-response/socket-response-type';
import {createLinkElementsForCurrentMempoolTransactions, Heading} from '@app/utils/string-utils';
import { MempoolEventType } from '@app/constants/constants';

interface PropType {
    event: AddRejectTxClientSideType | RemoveTxClientSideType | undefined;
}

export default function MempoolTransactionsList(props: PropType) {
    const event = props.event;

    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<MempoolTransactionListType>>([]);


    const addTransactionToMempoolState = (event: AddRejectTxClientSideType) => {
        console.log("add reject event: ", event)
        // const { action, fee, ...filteredObject } = event;
        // const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(filteredObject);
        // setCurrentMempoolTransactions([...currentMempoolTransactions, transformedClientSideObject]);
        const clientSideObject:MempoolTransactionResponseType = {
            hash: event.hash,
            inputs:  event.tx.transaction.inputs,
            outputs: event.tx.transaction.outputs,
            arrival_time: new Date(Date.now()).toISOString()
        }
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(clientSideObject);
        setCurrentMempoolTransactions([...currentMempoolTransactions, transformedClientSideObject]);
    };

    const removeTransactionFromMempoolState = (hashes: Array<string>) => {
        let updatedArray = [] as Array<MempoolTransactionListType>;
        for(let i=0 ; i < hashes.length; i++) {
            const hash = hashes[i];
            updatedArray = currentMempoolTransactions.filter((item) => item.hash !== hash);
        }
        setCurrentMempoolTransactions(updatedArray);
    };

    function mutateCurrentMempoolStateBasedOnEvent(event: AddRejectTxClientSideType | RemoveTxClientSideType) {
        switch (event.action) {
            case MempoolEventType.Remove:
                const removeEvent = event as RemoveTxClientSideType;
                removeTransactionFromMempoolState(removeEvent.txHashes);
                break;
            case MempoolEventType.Add:
                const addEvent = event as AddRejectTxClientSideType;
                addTransactionToMempoolState(addEvent);
                break;
            default:
                //TODO: what to do when reject event
                return;
        }
    }

    console.log("current mempool transactions:", currentMempoolTransactions);

    useEffect(() => {
        if (!event) return;
        const nonEmptyEvent  = props.event as AddRejectTxClientSideType | RemoveTxClientSideType
        mutateCurrentMempoolStateBasedOnEvent(nonEmptyEvent);
    }, [event]);

    return (
        <div className={' w-full h-full p-4 bg-white border-2 overflow-auto '}>
            <Heading title={'Mempool Transactions'} />
            <TableLayout data={currentMempoolTransactions} />
        </div>
    );
}
