"use client";
import TransactionHashList from "@app/components/transactions/transaction-hash-list";
import TransactionDetails from "@app/components/transactions/transaction-details";

export default function TransactionsContainer() {
    return (
        <>
            <h1 className={"flex mt-8 mb-2 justify-end"}>Total transactions: 4</h1>
            <div className={"flex flex-col md:flex-row justify-between gap-2 "}>
                <TransactionHashList/>
                <TransactionDetails/>
            </div>
        </>
    );
}