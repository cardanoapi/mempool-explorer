"use client";
import TransactionHashList from "@app/components/transactions/transaction-hash-list";
import TransactionDetails from "@app/components/transactions/transaction-details";
import BlockDetails from "@app/components/transactions/block-details";
import {Heading} from "@app/utils/string-utils";

export default function TransactionsContainer() {
    return (
        <>
            <h1 className={"flex mt-8 mb-2 justify-end"}>Total transactions: 4</h1>
            <div className={"flex flex-col min-w-full mb-4 md:flex-row gap-4"}>
                <TransactionHashList/>
                <TransactionDetails/>
            </div>
            <BlockDetails>
                <Heading title={"Block Details"}/>
            </BlockDetails>
        </>
    );
}