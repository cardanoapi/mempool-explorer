import Link from "next/link";
import {
    AddressTransactionType, BlockDetailsType,
    MempoolTransactionResponseType,
    TransactionInputResponseType,
    TransactionOutputResponseType
} from "@app/types/transaction-details-response/socket-response-type";
import React from "react";

export const toMidDottedStr = (str: string, leadingVisible = 5, firstIndex = 0) => {
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

function convertInputArrayToReactElement(arr: Array<TransactionInputResponseType>) {
        let endLength = 0;
    if(arr.length <= 5) {
      endLength = arr.length;  
    } else {
        endLength = 5;
    }
    return (
        <>
           {arr.slice(0,endLength)?.map(el => {
            const appendedInputs = `${el.hash}#${el.index}`;
                return <Link key={appendedInputs} target={"_blank"} className={"text-blue-500 mb-[2px]"} href={`/transactions/${el.hash}`}>
                    {toMidDottedStr(appendedInputs)}
                </Link>
            })}
             <p>{arr.length > 5 && `and ${arr.length - 5} more...`}</p>
        </>
    )
}

function convertToADA(lovelace: number) {
    return lovelace / 1000000 + " ADA";
}


function convertOutputArrayToReactElement(arr: Array<TransactionOutputResponseType>) {
    let endLength = 0;
    if(arr.length <= 5) {
      endLength = arr.length;  
    } else {
        endLength = 5;
    }
        return (
        <>
           {arr.slice(0,endLength).map(el => {
                return (
                <div className="flex gap-2 items-center">
                <Link key={el.address} target={"_blank"} className={"text-blue-500"} href={`/${el.address}`}>
                    {toMidDottedStr(el.address)}
                </Link>
                <p className="text-sm font-bold">{convertToADA(el.amount[0].lovelace)}</p>
                </div>
                )
            })}
            <p>{arr.length > 5 && `and ${arr.length - 5} more...`}</p>
        </>
    )
}

export const createLinkElementsForCurrentMempoolTransactions = (obj: MempoolTransactionResponseType) => {
    const inputs:any = obj.inputs;
    const outputs:any = obj.outputs;
    console.log("outputs: ", obj.outputs);
    return {
        ...obj,
        hash: <Link key={obj.hash} target={"_blank"} className={"text-blue-500 mb-[2px]"}
                    href={`/transactions/${obj.hash}`}>
            {toMidDottedStr(obj.hash)}
        </Link>,
        inputs: <div className={"flex flex-col gap-2"}>{convertInputArrayToReactElement(inputs)}</div>,
        outputs: <div className={"flex flex-col gap-2"}>{convertOutputArrayToReactElement(outputs)}</div>
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
