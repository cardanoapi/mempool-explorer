import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Layout from '@app/shared/layout';
import TableLayout from '@app/shared/table-layout';
import { MempoolTransactionListType, SocketEventResponseType } from '@app/types/transaction-details-response/socket-response-type';
import {createLinkElementsForCurrentMempoolTransactions, Heading} from '@app/utils/string-utils';

interface PropType {
    event: SocketEventResponseType;
}

export enum EventActionEnum {
    Remove = 'remove',
    Add = 'add',
    Reject = 'reject'
}

export default function MempoolTransactionsList(props: PropType) {
    const event = props.event;

    const [currentMempoolTransactions, setCurrentMempoolTransactions] = useState<Array<MempoolTransactionListType>>([]);



    const addTransactionToMempoolState = (event: SocketEventResponseType) => {
        const { action, fee, ...filteredObject } = event;
        const transformedClientSideObject = createLinkElementsForCurrentMempoolTransactions(filteredObject);
        setCurrentMempoolTransactions([...currentMempoolTransactions, transformedClientSideObject]);
    };

    const removeTransactionFromMempoolState = (hash: string) => {
        const updatedArray = currentMempoolTransactions.filter((item) => item.hash !== hash);
        setCurrentMempoolTransactions(updatedArray);
    };

    function mutateCurrentMempoolStateBasedOnEvent(event: SocketEventResponseType) {
        switch (event.action) {
            case EventActionEnum.Remove:
                removeTransactionFromMempoolState(event.hash);
                break;
            case EventActionEnum.Add:
                addTransactionToMempoolState(event);
                break;
            default:
                return;
        }
    }

    useEffect(() => {
        if (!event) return;
        mutateCurrentMempoolStateBasedOnEvent(event);
    }, [event]);

    return (
        <div className={' w-full h-full p-4 bg-white border-2 overflow-auto '}>
            <Heading title={'Mempool Transactions'} />
            <TableLayout data={currentMempoolTransactions} />
        </div>
    );
}
