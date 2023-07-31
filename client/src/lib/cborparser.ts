import * as cbor from 'cbor-web';
import {bech32} from 'bech32';
import environments from "@app/configs/environments";
import {Network} from "@app/constants/constants";

export class Transaction {
    transaction;

    constructor(cbortx: Buffer) {
        // const tx = await cbor.decodeFirst(cbortx);
        const tx = cbor.decodeFirstSync(cbortx);
        const inputs = tx[0].get(0).map((input: any) => {
            return {
                hash: input[0].toString('hex'),
                index: input[1]
            }
        });
        const outputs = this.getOutput(tx[0].get(1));
        const isMint = tx[0].has(9);
        let mintTokens = null;
        if (isMint) {
            mintTokens = this.assetMapParse(tx[0].get(9));
        }
        let metadata = null;
        if (tx[3] != null) {
            if (tx[3] instanceof cbor.Tagged) {
                metadata = tx[3].toJSON();
            } else {
                metadata = tx[3];
            }
        }
        const transaction = {
            inputs,
            outputs,
            isMint,
            mintTokens,
            metadata,
        }
        this.transaction = transaction;
    }


    getInput(tx: any) {
        return tx[0].get(0);

    }

    assetMapParse(assetMap: any) {
        return Array.from(assetMap).map((arr: any) => {
            const currSymbol = arr[0].toString('hex');
            const val: [any, any] = arr[1];
            const numberOfAsset = Array.from(val).map(([assetId, amount]) => {
                const assetIdHex = assetId.toString('hex');
                return {
                    assetIdHex,
                    amount
                };
            });
            return {
                currSymbol,
                numberOfAsset
            };
        });
    }

    multiAssetParsing(value: any) {
        if (Array.isArray(value)) {
            const multiAssets = this.assetMapParse(value[1]);
            return [{'lovelace': value[0]}, ...multiAssets];
        } else {
            return [{'lovelace': value}];
        }
    }

    getAddressPrefixAccordingToNetwork(network: string) {
        switch (network) {
            case Network.MAINNET:
                return "addr"
            case Network.TESTNET:
                return "addr_test"
            default:
                return "addr"
        }
    }

    getOutput(outputs: any) {
        return outputs.map((output: any) => {
            if (Array.isArray(output)) {
                const assets = this.multiAssetParsing(output[1]);
                let datumHash = null;
                if (output.length > 2) {
                    datumHash = output[2];
                }
                const ret = {
                    "address": bech32.encode(this.getAddressPrefixAccordingToNetwork(environments.CARDANO_NETWORK), bech32.toWords(output[0]), 150),
                    "amount": assets,
                    "datumHash": datumHash
                }
                return ret;
            } else {
                const ret = {
                    "address": bech32.encode(this.getAddressPrefixAccordingToNetwork(environments.CARDANO_NETWORK), bech32.toWords(output.get(0)), 150),
                    "amount": this.multiAssetParsing(output.get(1)),
                };
                return ret;
            }
        });

    }
}
