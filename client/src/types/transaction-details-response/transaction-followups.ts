export interface InputTypes {
    index: number;
    transaction_id: string;
}

export interface AmountTypes {
    coin: string;
    multiasset: Map<string, Map<string, number>>;
}

export interface PlutusDataTypes {
    DataHash: string;
}

export interface OutputTypes {
    address: string;
    amount: AmountTypes;
    plutus_data: PlutusDataTypes;
    script_ref: any;
}

export interface FollowupBodyType {
    auxiliary_data_hash: string;
    certs: string | undefined;
    collateral: Array<any>;
    collateral_return: Object;
    fee: string;
    inputs: Array<InputTypes>;
    mint: Array<any>;
    network_id: string | undefined;
    outputs: Array<OutputTypes>;
    reference_inputs: Array<any> | undefined;
    required_signers: Array<any> | undefined;
    script_data_hash: string;
    total_collateral: string;
    ttl: string;
    update: undefined | boolean;
    validity_start_interval: undefined | string;
    withdrawals: any;
    is_valid: boolean;
    witness_set: any;
}

export interface TxResponse {
    hash: string;
    followps: any;
}

export interface FollowupsType {
    hash: any;
    body: FollowupBodyType;
}
