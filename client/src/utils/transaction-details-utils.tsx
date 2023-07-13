import { Transaction } from '@emurgo/cardano-serialization-lib-asmjs';
import { Buffer } from 'buffer';

export interface InputOutputObjType {
    hash: string;
    inputs: Array<object>;
    outputs: Array<object>;
}

export function convertToClientSideInputOutputObject(response: any) {
    let inputOutputsObj: InputOutputObjType = {
        hash: '',
        inputs: [],
        outputs: []
    };

    const txBodyObject = Transaction.from_bytes(response.tx.txbody);

    // for inputs
    const inputs = [];
    for (let i = 0; i < txBodyObject.body().inputs().len(); i++) {
        const input = txBodyObject.body().inputs().get(i);
        const format = { address: `${input.transaction_id().to_hex()}#${input.index().toString()}` };
        inputs.push(format);
    }

    inputOutputsObj = { ...inputOutputsObj, inputs: inputs };

    // for outputs
    const outputs = [];
    for (let i = 0; i < txBodyObject.body().outputs().len(); i++) {
        const output = txBodyObject.body().outputs().get(i);
        const address = output.address().to_hex();
        const amount = output.amount().coin().to_str();
        const outputObj = {
            address: address,
            amount: amount
        };
        outputs.push(outputObj);
    }
    inputOutputsObj = { ...inputOutputsObj, outputs: outputs };
    txBodyObject.free();

    return inputOutputsObj;
}

export function convertFollowupsToClientSide(response: any, id: string) {
    const followups = response.followups as Array<{ hash: Uint8Array; body: Uint8Array }>;
    let allFollowups = [];

    for (let i = 0; i < followups.length; i++) {
        let followupObj = {};
        const hash = Buffer.from(followups[i].hash).toString('hex');
        followupObj = { ...followupObj, hash: hash };
        const txObject = Transaction.from_bytes(followups[i].body);
        const txBodyObject = txObject.body();
        followupObj = { ...followupObj, fee: txBodyObject.fee().to_js_value() };

        let consumes = 0;

        for (let i = 0; i < txBodyObject.inputs().len(); i++) {
            console.log(txBodyObject.inputs().get(i).transaction_id());
            const input = txBodyObject.inputs().get(i).transaction_id().to_hex();
            console.log(input);
            if (input === id) consumes++;
        }

        followupObj = { ...followupObj, consumes: consumes };
        txObject.free();
        allFollowups.push(followupObj);
    }

    return allFollowups;
}
