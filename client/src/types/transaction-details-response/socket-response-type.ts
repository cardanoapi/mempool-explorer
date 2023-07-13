import { AddTxMessage, RejectTxMessage, RemoveTxMessage } from "@app/lib/websocket";
import React from "react";

export interface SocketEventResponseType {
    hash: string;
    action: string;
    amount: string;
    inputs: Array<string>;
    outputs: Array<string>;
    fee: string;
    arrival_time: string;
}

interface ActionType {
    action: string;
}

export type AddRejectTxClientSideType = (AddTxMessage | RejectTxMessage) & ActionType;

export type RemoveTxClientSideType = RemoveTxMessage & ActionType;

export type MempoolEventType = AddRejectTxClientSideType | RemoveTxClientSideType;

export interface MempoolTransactionResponseType {
    hash: string ;
    inputs: Array<string> ;
    outputs: Array<string> ;
    arrival_time: string;
}

export interface AmountType {
    lovelace: number;
}

export interface TransactionOutputResponseType {
    address: string;
    amount: Array <AmountType>;
}

export interface TransactionInputResponseType {
    hash: string;
    index: number;
}

export interface MempoolTransactionListType {
    hash: string | React.ReactElement;
    inputs: Array<string> | React.ReactElement ;
    outputs: Array<string> | React.ReactElement ;
    arrival_time: string;
}

export interface AddressTransactionType {
    block_hash: string;
    block_no: string;
    confirmation_time:string;
    epoch: number;
    slot_no: string;
    tx_hash: React.ReactElement;
    wait_time: string;
}

export interface BlockDetailsType {
    "slot": string;
    Transactions: string;
    Timestamp: string;
    Output: number;
}
