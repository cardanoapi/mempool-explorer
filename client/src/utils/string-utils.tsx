import React from 'react';

import Link from 'next/link';

import { BlockDetailsInputType } from '@app/components/transactions/block-details';
import { BlockDetailsTableInputType, TransactionListMaxDisplayCount } from '@app/constants/constants';
import { MempoolTransactionResponseType } from '@app/types/clientside/dashboard';
import { AddressTransactionType, TransactionInputResponseType, TransactionOutputResponseType } from '@app/types/transaction-details-response/socket-response-type';

export const toMidDottedStr = (str: string, leadingVisible = 12, firstIndex = 0) => {
    if (str === undefined || str.length < 15) return str;
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};

export const toEndDottedStr = (str: string | number, leadingVisible = 12, firstIndex = 0) => {
    if (str === undefined) return str;
    if (str.toString().length <= leadingVisible) return str.toString();
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    return `${leadingStr}...`;
};

export const Heading = (props: any) => {
    return (
        <div className={'flex justify-between items-center'} style={{ justifyContent: 'space-between' }}>
            <h1 className={'font-semibold text-lg mb-2'}>{props.title}</h1>
            {props.children}
        </div>
    );
};

export const createLinkElementsForTransactionHash = (arr: Array<AddressTransactionType>) => {
    return arr.map((obj) => {
        return {
            ...obj,
            tx_hash: (
                <Link prefetch={false} target={'_blank'} className={'text-blue-500 mb-2'} href={`/transactions/${obj.tx_hash}`}>
                    {obj.tx_hash}
                </Link>
            )
        };
    });
};

function convertInputArrayToReactElement(arr: Array<TransactionInputResponseType>) {
    const displayLimit = getTheLimitForTransactionListDisplay(arr.length);
    return (
        <>
            {arr.slice(0, displayLimit)?.map((el) => {
                const appendedInputs = `${el.hash}#${el.index}`;
                return (
                    <Link prefetch={false} key={appendedInputs} target={'_blank'} className={'text-blue-500 mb-[2px]'} href={`/transactions/${el.hash}`}>
                        {toMidDottedStr(appendedInputs)}
                    </Link>
                );
            })}
            <p>{getNumberOfHiddenTransactionList(arr.length, displayLimit)}</p>
        </>
    );
}

export function convertToADA(lovelace: number) {
    return lovelace / 1000000 + ' ADA';
}

export function getTheLimitForTransactionListDisplay(arrLength: number, maxDisplayCount?: number) {
    const maxCount = !maxDisplayCount ? TransactionListMaxDisplayCount : maxDisplayCount;
    if (arrLength <= maxCount) {
        return arrLength;
    } else {
        return maxCount;
    }
}

export function getNumberOfHiddenTransactionList(arrLength: number, displayLimit: number) {
    if (arrLength > displayLimit) {
        return `and ${arrLength - displayLimit} more...`;
    }
    return '';
}

function convertOutputArrayToReactElement(arr: Array<TransactionOutputResponseType>) {
    const displayLimit = getTheLimitForTransactionListDisplay(arr.length);
    return (
        <>
            {arr.slice(0, displayLimit).map((el) => {
                return (
                    <div key={el.address} className="flex gap-2 items-center">
                        <Link prefetch={false} key={el.address} target={'_blank'} className={'text-blue-500'} href={`/${el.address}`}>
                            {toMidDottedStr(el.address)}
                        </Link>
                        <p className="text-sm font-bold">{convertToADA(el.amount[0].lovelace)}</p>
                    </div>
                );
            })}
            <p>{getNumberOfHiddenTransactionList(arr.length, displayLimit)}</p>
        </>
    );
}

export const createLinkElementsForCurrentMempoolTransactions = (obj: MempoolTransactionResponseType) => {
    const inputs: any = obj.inputs;
    const outputs: any = obj.outputs;
    const hash = obj.hash as string;
    return {
        ...obj,
        hash: (
            <Link prefetch={false} key={hash} target={'_blank'} className={'text-blue-500 mb-[2px]'} href={`/transactions/${hash}`}>
                {toMidDottedStr(hash)}
            </Link>
        ),
        inputs: <div className={'flex flex-col gap-2'}>{convertInputArrayToReactElement(inputs)}</div>,
        outputs: <div className={'flex flex-col gap-2'}>{convertOutputArrayToReactElement(outputs)}</div>
    };
};

function createLinkFromTransactionHashesArray(arr: Array<string>) {
    const displayLimit = getTheLimitForTransactionListDisplay(arr.length);
    return (
        <>
            {arr.slice(0, displayLimit).map((e) => (
                <>
                    <Link prefetch={false} key={e} target={'_blank'} className={'text-blue-500'} href={`/transactions/${e}`}>
                        {toMidDottedStr(e)}
                    </Link>
                </>
            ))}
            <p>{getNumberOfHiddenTransactionList(arr.length, displayLimit)}</p>
        </>
    );
}

export const createLinkElementForBlockDetails = (arr: Array<BlockDetailsInputType>) => {
    return arr.map((obj) => {
        return {
            ...obj,
            [BlockDetailsTableInputType.headerHash]: toMidDottedStr(obj[BlockDetailsTableInputType.headerHash]),
            [BlockDetailsTableInputType.txHashes]: <div className={'flex flex-col gap-2'}>{createLinkFromTransactionHashesArray(obj[BlockDetailsTableInputType.txHashes])}</div>
        };
    });
};

export function getTimeString(dateObj: Date) {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    let parsedHours = hours > 12 ? hours - 12 : hours;

    return `${parsedHours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
}