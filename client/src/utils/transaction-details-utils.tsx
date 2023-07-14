import {Transaction} from '@emurgo/cardano-serialization-lib-asmjs';
import {Buffer} from 'buffer';
import {toMidDottedStr} from "@app/utils/string-utils";

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

    try {
        const txBodyObject:Transaction = Transaction.from_bytes(response.tx.txbody);
        const transactionJson = JSON.parse(txBodyObject.to_json());
        txBodyObject.free();

        const inputs = [];
        for (let i=0; i< transactionJson.body.inputs.length; i++) {
            const input = transactionJson.body.inputs[i];
            const format = {address: `${input.transaction_id}#${input.index}`}
            inputs.push(format)
        }
        inputOutputsObj = {...inputOutputsObj, inputs: inputs}

        const outputs = [];
        for(let i=0; i< transactionJson.body.outputs.length;i++) {
            const output = transactionJson.body.outputs[i];
            const address = output.address;
            const amount = output.amount.coin;
            let multiasset:any = [];
            if(typeof output.amount.multiasset === "object") {
                const transformedObj:any = {};
                const obj =  output.amount.multiasset;
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        for (const nestedKey in value) {
                            transformedObj[`${toMidDottedStr(key)}.${toMidDottedStr(nestedKey)}`] = value[nestedKey];
                        }
                    }
                }
                multiasset = [...multiasset, transformedObj];
            } else {
                multiasset = output?.amount?.multiasset.map((obj: any) => {
                    const transformedObj: any = {};
                    for (const key in obj) {
                        const value = obj[key];
                        if (typeof value === 'object' && !Array.isArray(value)) {
                            for (const nestedKey in value) {
                                transformedObj[`${key}.${nestedKey}`] = value[nestedKey];
                            }
                        }
                    }
                })
            }

            const outputObj = {
                address: address,
                amount: amount,
                multiasset: multiasset
            }
            outputs.push(outputObj)
        }

        inputOutputsObj = {...inputOutputsObj, outputs: outputs};


        // console.log("inputs:",t.body.outputs)

        // // for inputs
        // const inputs = [];
        // for (let i = 0; i < txBodyObject.body().inputs().len(); i++) {
        //     const input = txBodyObject.body().inputs().get(i);
        //     const format = {address: `${input.transaction_id().to_hex()}#${input.index().toString()}`};
        //     inputs.push(format);
        // }
        //
        // inputOutputsObj = {...inputOutputsObj, inputs: inputs};
        //
        // // for outputs
        // const outputs = [];
        // for (let i = 0; i < txBodyObject.body().outputs().len(); i++) {
        //     const output = txBodyObject.body().outputs().get(i);
        //     const address = output.address().to_hex();
        //     const amount = output.amount().coin().to_str();
        //     const outputObj = {
        //         address: address,
        //         amount: amount
        //     };
        //     outputs.push(outputObj);
        // }
        // inputOutputsObj = {...inputOutputsObj, outputs: outputs};
        // txBodyObject.free();

        return inputOutputsObj;
    } catch (e) {
        console.error("serialization err: ", e);
    }
}

export function convertFollowupsToClientSide(response: any, id: string) {
    const followups = response.followups as Array<{ hash: Uint8Array; body: Uint8Array }>;
    let allFollowups = [];

    for (let i = 0; i < followups.length; i++) {
        let followupObj = {};
        const hash = Buffer.from(followups[i].hash).toString('hex');
        followupObj = {...followupObj, hash: hash};
        const txObject = Transaction.from_bytes(followups[i].body);
        const txBodyObject = txObject.body();
        followupObj = {...followupObj, fee: txBodyObject.fee().to_js_value()};

        let consumes = 0;

        for (let i = 0; i < txBodyObject.inputs().len(); i++) {
            console.log(txBodyObject.inputs().get(i).transaction_id());
            const input = txBodyObject.inputs().get(i).transaction_id().to_hex();
            if (input === id) consumes++;
        }

        followupObj = {...followupObj, consumes: consumes};
        txObject.free();
        allFollowups.push(followupObj);
    }

    return allFollowups;
}
