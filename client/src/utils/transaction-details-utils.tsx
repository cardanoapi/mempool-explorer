import { Transaction } from '@emurgo/cardano-serialization-lib-asmjs';
import { Buffer } from 'buffer';
import { toMidDottedStr } from "@app/utils/string-utils";
import { DateTimeCustomoptions } from "@app/constants/constants";
import { CborTransactionParser } from "@app/lib/cborparser";

export interface InputOutputObjType {
    hash: string;
    inputs: Array<string>;
    outputs: Array<object>;
}

export function convertToClientSideInputOutputObject(tx: any) {

    let inputOutputsObj: InputOutputObjType = {
        hash: '',
        inputs: [],
        outputs: []
    };

    const parserObj = new CborTransactionParser(tx.txbody);
    const response = parserObj.getTransaction();

    let inputs: Array<string> = [];
    for (let i = 0; i < response.inputs.length; i++) {
        const item = response.inputs[i];
        const format: any = { address: `${item.hash}#${item.index}` }
        inputs.push(format)
    }
    inputOutputsObj = { ...inputOutputsObj, inputs: inputs }

    const outputs = [];
    for (let i = 0; i < response.outputs.length; i++) {
        const output = response.outputs[i];
        const address = output.address;
        const amount = output.amount[0].lovelace;
        let multiasset: any = [];

        if (output.amount.length === 2) {
            const policyId = output.amount[1].currSymbol;
            if (Array.isArray(output?.amount[1]?.numberOfAsset)) {
                const assetsList = output.amount[1].numberOfAsset;
                for (let i = 0; i < assetsList.length; i++) {
                    let transformedObj: any = {};
                    const assetItem = assetsList[i];
                    const key: string = `${toMidDottedStr(policyId)}.${toMidDottedStr(assetItem.assetIdHex)}`
                    transformedObj[key] = assetItem.amount;
                    multiasset = [...multiasset, transformedObj]
                }
            }
        }

        const outputObj = {
            address: address,
            amount: amount,
            multiasset: multiasset
        }
        outputs.push(outputObj)
    }

    inputOutputsObj = { ...inputOutputsObj, outputs: outputs }

    return inputOutputsObj;
}

export function convertFollowupsToClientSide(response: any, id: string) {
    if (!Array.isArray(response)) {
        return [];
    }
    const followups = response as Array<{
        hash: string;
        body: any,
        confirmation_status: Boolean,
        confirmation_time: string,
        arrivalTime: string
    }>;
    let allFollowups = [];

    for (let i = 0; i < followups.length; i++) {
        let followupObj = {};
        const hash = followups[i].hash;
        followupObj = {
            ...followupObj,
            hash: hash,
            arrivalTime: followups[i].arrivalTime !== 'N/A' ? new Intl.DateTimeFormat("en-US", DateTimeCustomoptions).format(new Date(followups[i].arrivalTime)) : followups[i].arrivalTime
        };
        const parserObj = new CborTransactionParser(followups[i].body);
        const tx = parserObj.getTransaction();

        followupObj = { ...followupObj, fee: parserObj.getFee() };

        let consumes = 0;

        for (let i = 0; i < tx.inputs.length; i++) {
            const input = tx.inputs[i].hash;
            if (input === id) consumes++;
        }

        followupObj = {
            hash: followups[i].hash,
            consumes: `#${consumes}`,
            ...followupObj,
            confirmation_status: followups[i].confirmation_status ? "Confirmed" : "Not confirmed",
            confirmation_time: followups[i].confirmation_time
        };
        allFollowups.push(followupObj);
    }

    return allFollowups;
}
