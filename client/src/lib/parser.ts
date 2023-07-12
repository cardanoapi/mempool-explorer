import { Transaction, hash_transaction } from "@emurgo/cardano-serialization-lib-asmjs";

export interface TransactionInput{
  transactionId: string;
  index: number;
}

export interface TransactionOutput{
  address: string;
  value: Value;
}

export interface Value{
  ada: string;
  multiassets: Record<string, Record<string, string>>|null;
}

export interface Mint{
  multiassets: Record<string, Record<string, string>>;
}

export interface ITransaction{
  hash: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: string;
  mint?: Mint;
}

export class TransactionParser{
  public static parse(tx:Transaction):ITransaction{
    let inputs:TransactionInput[] = [];
    let outputs:TransactionOutput[] = [];
    let mint:Mint|undefined = undefined;
    const hash = hash_transaction(tx.body()).to_hex();
    const fee = tx.body().fee().to_str();
    const input = tx.body().inputs();
    const inputUtxoLen = input.len();
    for(let i=0;i<inputUtxoLen;i++){
      const utxo = input.get(i);
      const ind = utxo.index();
      const id = utxo.transaction_id().to_hex();
      const txInput:TransactionInput = {transactionId:id, index:ind};
      inputs.push(txInput);
    }
    const output = tx.body().outputs();
    const outputLen = output.len();
    for(let i=0;i<outputLen;i++){
      const out = output.get(i);
      const outaddr = out.address().to_hex();
      const value = out.amount();
      const ada = value.coin().to_str();
      const mult = value.multiasset();
      const multi = value.multiasset()?.to_js_value();
      let assets:Record<string, Record<string, string>> = {}
      if(multi && mult){
        // assets = JSON.parse(JSON.stringify(multi)) as Record<string, Record<string, number>>;
        const policyIds = mult.keys();
        const length = policyIds.len();
        for(let i=0;i<length;i++){
          const policy = policyIds.get(i);
          const policyAssets = mult.get(policy);
          const assetKeys = policyAssets!.keys();
          const assetLength = assetKeys.len();
          assets[policy.to_hex()] = {};
          if(!assetKeys || !assetLength) continue;
          for(let j=0;j<assetLength;j++){
            const asset = assetKeys.get(j);
            const amount = policyAssets!.get(asset);
            if(!amount) continue;
            console.log(policy.to_hex(), Buffer.from(asset.name()).toString('hex'), amount.to_str());
            assets[policy.to_hex()][asset.name().toString()] = amount.to_str();
          }
        }
      }
      const txOutput:TransactionOutput = {address:outaddr, value:{ada:ada, multiassets:assets}};
      outputs.push(txOutput);
    }
    const mintpolicies = tx.body().mint()?.keys();
    const mintpoliciesLen = mintpolicies?.len();
    if(!mintpoliciesLen || !mintpolicies){

    }
    else{
      const mintassets:Record<string, Record<string, string>> ={};
      for(let i=0;i<mintpoliciesLen;i++){
        const policy = mintpolicies.get(i);
        const policyAssets = tx.body().mint()!.get(policy);
        const assetKeys = policyAssets!.keys();
        const assetLength = assetKeys.len();
        mintassets[policy.to_hex()] = {};
        if(!assetKeys || !assetLength) continue;
        for(let j=0;j<assetLength;j++){
          const asset = assetKeys.get(j);
          const amount = policyAssets!.get(asset);
          if(!amount) continue;
          mintassets[policy.to_hex()][asset.name().toString()] = amount.to_str();
        }
      }
      mint = {multiassets:mintassets};
    }
    

    return {hash, inputs, outputs, fee, mint};
  }
}