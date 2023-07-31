'use client';

import {useEffect, useState} from 'react';

import BlockDetails from '@app/components/transactions/block-details';
import {
    AddRejectTxClientSideType,
    RemoveMintedTransactions,
    RemoveTxClientSideType
} from '@app/types/transaction-details-response/socket-response-type';

import MempoolTransactionsList from './transaction-details';
import TransactionEventList from './transaction-hash-list';


import CardanoWebSocketImpl, {AddTxMessage, MintMessage, RejectTxMessage, RemoveTxMessage} from "@app/lib/websocket";
import {MempoolEventType} from '@app/constants/constants';
import environments from "@app/configs/environments";

export default function TransactionsContainer() {

    const [mempoolEvent, setMempoolEvent] = useState<AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions>();

    const [mintEvent, setMintEvent] = useState<MintMessage>();

    useEffect(() => {
        const sock = CardanoWebSocketImpl.createConnection(environments.WS_URL);
        sock.on("mint", (msg: MintMessage) => {
            console.log("mint", msg.slotNumber, msg.headerHash, msg.txHashes);
            const mintActionAddedTransaction: RemoveMintedTransactions = {
                ...msg,
                action: MempoolEventType.Mint
            }
            // setMempoolEvent(mintActionAddedTransaction)
            setMintEvent(msg);
        });
        sock.on("addTx", (msg: AddTxMessage) => {
            // console.log(msg.hash, msg.tx.transaction.inputs, msg.tx.transaction.outputs, msg.tx.transaction.isMint, msg.tx.transaction.mintTokens, msg.mempoolSize, msg.mempoolTxCount  );
            const addActionAddedTransaction: AddRejectTxClientSideType = {
                ...msg,
                action: MempoolEventType.Add
            }
            setMempoolEvent(addActionAddedTransaction);

        });
        sock.on("removeTx", (msg: RemoveTxMessage) => {
            const removeActionAddedTransaction: RemoveTxClientSideType = {
                ...msg,
                action: MempoolEventType.Remove
            }
            setMempoolEvent(removeActionAddedTransaction)
        });
        sock.on("rejectTx", (msg: RejectTxMessage) => {
            const rejectActionAddedTransaction: AddRejectTxClientSideType = {
                ...msg,
                action: MempoolEventType.Reject
            }
            setMempoolEvent(rejectActionAddedTransaction)
        })
    }, []);


    return (
        <div className="overflow-y-auto">
            <div className="flex calc-h-68 px-5 flex-1 gap-2">
                <div className={"min-h-full max-h-full"}>
                    <TransactionEventList event={mempoolEvent}/>
                </div>
                <div className="flex gap-2 flex-col flex-1">
                    <MempoolTransactionsList event={mempoolEvent}/>
                    <BlockDetails event={mintEvent as MintMessage}/>
                </div>
            </div>
        </div>
    );
}
