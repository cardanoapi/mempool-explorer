import {AddTxMessage, MintMessage, RejectTxMessage, RemoveTxMessage} from "@app/lib/websocket";

export interface MempoolTransactionResponseType {
    hash: string | JSX.Element;
    inputs: Array<string> | JSX.Element;
    outputs: Array<string> | JSX.Element
    received_time: string;
    arrival_time: string;
}

interface ActionType {
    action: string;
}

export type AddRejectTxClientSideType = (AddTxMessage | RejectTxMessage) & ActionType;

export type RemoveTxClientSideType = RemoveTxMessage & ActionType;

export type RemoveMintedTransactions = MintMessage & ActionType;
