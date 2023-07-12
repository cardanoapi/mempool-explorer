export interface SocketEventResponseType {
    hash: string;
    action: string;
    amount: string;
    inputs: Array<string> | string;
    outputs: Array<string> | string;
    fee: string;
    arrival_time: string;
}

export interface MempoolTransactionListType {
    hash: string;
    inputs: Array<string> | string;
    amount: string;
    outputs: Array<string> | string;
    arrival_time: string;
}
