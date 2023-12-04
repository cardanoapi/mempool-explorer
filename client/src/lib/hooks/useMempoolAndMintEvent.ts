import { useEffect, useState } from 'react';

import environments from '@app/configs/environments';
import { MempoolEventType } from '@app/constants/constants';
import { AddRejectTxClientSideType, RemoveMintedTransactions, RemoveTxClientSideType } from '@app/types/clientside/dashboard';

import CardanoWebSocketImpl, { AddTxMessage, MintMessage, RejectTxMessage, RemoveTxMessage } from '../websocket';

export default function useMempoolAndMintEvent() {
    const [mempoolEvent, setMempoolEvent] = useState<AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions>();
    const [mintEvent, setMintEvent] = useState<MintMessage>();

    useEffect(() => {
        const sock = CardanoWebSocketImpl.createConnection(environments.NEXT_PUBLIC_WS_URL);
        sock.on('mint', (msg: MintMessage) => {
            setMintEvent(msg);
        });
        sock.on('addTx', (msg: AddTxMessage) => {
            const addActionAddedTransaction: AddRejectTxClientSideType = {
                ...msg,
                action: MempoolEventType.Add
            };
            setMempoolEvent(addActionAddedTransaction);
        });
        sock.on('removeTx', (msg: RemoveTxMessage) => {
            const removeActionAddedTransaction: RemoveTxClientSideType = {
                ...msg,
                action: MempoolEventType.Remove
            };
            setMempoolEvent(removeActionAddedTransaction);
        });
        sock.on('rejectTx', (msg: RejectTxMessage) => {
            const rejectActionAddedTransaction: AddRejectTxClientSideType = {
                ...msg,
                action: MempoolEventType.Reject
            };
            setMempoolEvent(rejectActionAddedTransaction);
        });

        return () => {
            console.log('Closing socket!');
            sock.close();
        };
    }, []);

    return { mempoolEvent, mintEvent };
}
