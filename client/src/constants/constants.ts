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
    received_time = "Received Time",
    arrival_time = "Arrival Time"
}

export enum BlockDetailsTableInputType {
    slotNo = "Slot No",
    blockNo = "Block no",
    time = "Time",
    minerPool = "Miner Pool",
    avg_tx_wait_time = "Avg. Tx Wait time",
    headerHash = "Header hash",
    txHashes = "Transaction hashes"
}

export const TransactionListMaxDisplayCount = 2;