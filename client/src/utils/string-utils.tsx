import Link from "next/link";
import {
    AddressTransactionType, BlockDetailsType,
    MempoolTransactionListType
} from "@app/types/transaction-details-response/socket-response-type";
import React from "react";

export const toMidDottedStr = (str: string, leadingVisible = 12, firstIndex = 0) => {
    if (str === undefined || str.length < 12) return str;
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};

export const Heading = (props: any) => {
    return (
        <div className={'flex justify-between items-center'} style={{justifyContent: 'space-between'}}>
            <h1 className={'font-semibold text-lg mb-2'}>{props.title}</h1>
            {props.children}
        </div>
    );
};

export const createLinkElementsForTransactionHash = (arr: Array<AddressTransactionType>) => {
    return arr.map((obj) => {
        return {
            ...obj,
            tx_hash: <Link target={"_blank"} className={"text-blue-500 mb-2"}
                           href={`/transactions/${obj.tx_hash}`}>{obj.tx_hash}</Link>
        }
    });
}

function convertArrayToReactElement(arr: Array<string>) {
    if (!Array.isArray(arr)) return (
        <Link key={arr} target={"_blank"} className={"text-blue-500 mb-[2px]"} href={`/${arr}`}>
            {toMidDottedStr(arr)}
        </Link>
    )
    return (
        <>
            {arr?.map(el => (
                <Link key={el} target={"_blank"} className={"text-blue-500 mb-[2px]"} href={`/${el}`}>
                    {toMidDottedStr(el)}
                </Link>
            ))}
        </>
    )
}

export const createLinkElementsForCurrentMempoolTransactions = (obj: MempoolTransactionListType) => {
    const inputs = obj.inputs as Array<string>;
    const outputs = obj.outputs as Array<string>;
    return {
        ...obj,
        inputs: <div className={"flex flex-col gap-2"}>{convertArrayToReactElement(inputs)}</div>,
        outputs: <div className={"flex flex-col gap-2"}>{convertArrayToReactElement(outputs)}</div>
    }
}

export const createLinkElementForBlockDetails = (arr: Array<BlockDetailsType>) => {
    return arr.map(obj => {
        return {
            ...obj,
            Stake_pool: <Link target={"_blank"} className={"text-blue-500 mb-[2px]"}
                              href={`/${obj.Stake_pool}`}>{obj.Stake_pool}</Link>
        }
    })
}
