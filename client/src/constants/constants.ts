export enum MempoolEventType {
    Add = "add",
    Remove = "remove",
    Reject = "reject",
    Mint = "mint"
}

export enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet"
}

export enum MempoolLiveViewTableHeaderEnum {
    hash = "Transaction hash",
    inputs = "Inputs",
    outputs = "Outputs",
    received_time = "Received Time"
}

export const TransactionListMaxDisplayCount = 2;