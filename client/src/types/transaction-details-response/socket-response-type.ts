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

export interface MempoolTransactionListType {
    hash: string;
    inputs: Array<string> | React.ReactElement ;
    amount: string;
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
    block: string;
    "epoch/slot": string;
    Transactions: string;
    Timestamp: string;
    Stake_pool: string;
    Output: number;
}
