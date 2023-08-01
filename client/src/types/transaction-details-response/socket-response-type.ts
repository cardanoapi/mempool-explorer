import {AddTxMessage, RejectTxMessage, RemoveTxMessage, MintMessage} from "@app/lib/websocket";
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

export interface AmountType {
    lovelace: number;
}

export interface TransactionOutputResponseType {
    address: string;
    amount: Array<AmountType>;
}

export interface TransactionInputResponseType {
    hash: string;
    index: number;
}

export interface AddressTransactionType {
    block_hash: string;
    block_no: string;
    confirmation_time: string;
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
