import { getLatestEpoch } from './cardanoUtils';
import {
    getAddressDetails,
    getArrivalTime,
    getPoolDetails,
    getTheLatestTransactionEpochOfAddress
} from '../queries';
import { discoveryDbClient } from '../queries/prisma';
import { Prisma } from '@prisma/client';

export async function getTransactionHistoryOfPool(
    id: string,
    pageNumber: number
) {
    const latestEpoch = await getTheLatestTransactionEpochOfAddress(id);
    if (latestEpoch != null)
        return await getPoolDetails(id, latestEpoch, pageNumber);
}

export async function getTransactionHistoryOfAddress(
    id: string,
    pageNumber: number
) {
    const latestEpoch = getLatestEpoch();
    return await getAddressDetails(id, latestEpoch, pageNumber);
}

export async function getAddressFromTxHashAndIndex(
    inputId: string,
    index: number
) {
    const hash = Buffer.from(inputId, 'hex');
    const query = Prisma.sql`select address, value from tx_out where hash=${hash} and index=${index}`;
    return discoveryDbClient.$queryRaw(query);
}

export async function addAddressFieldsToResponse(parsedTransaction: any) {
    const transactions = parsedTransaction.getTransaction();
    let transactionToAddressObj: any = {};
    if (Array.isArray(transactions.inputs) && !!transactions.inputs.length) {
        for (const input of transactions.inputs) {
            const hash: string = input.hash;
            const index: number = input.index;
            const key = `${hash}#${index}`;
            const value: any = await getAddressFromTxHashAndIndex(hash, index);
            transactionToAddressObj[key] = !!value ? value[0] : '';
        }
    }
    return transactionToAddressObj;
}

export async function fetchTheArrivalTime(arr: Array<any>) {
    return Promise.all(
        arr.map(async (item) => {
            const arrivalTime = await getArrivalTime(item.hash);
            return {
                ...item,
                arrivalTime: !!arrivalTime?.received
                    ? arrivalTime.received.toString()
                    : 'N/A'
            };
        })
    );
}
