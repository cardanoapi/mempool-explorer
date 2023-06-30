import React, {useEffect, useState} from "react";

import "../table/table.css";
import {Heading} from "@app/utils/string-utils";

export default function AddressTransactionHistory(props: any) {
    const transactions = props.transactions;

    const [currentPage, setCurrentPage] = useState(1);

    const PageRenderer = () => {
        return (
            <div className={"flex justify-end items-center mb-2"}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => {
                        setCurrentPage(currentPage - 1)
                    }}
                    className={"mr-2 border-solid border-2 p-2"}
                >
                    Previous
                </button>

                <span>Page {currentPage}</span>

                <button
                    disabled={transactions.length < 100}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={"ml-2 border-solid border-2 p-2"}
                >
                    Next
                </button>
            </div>
        )
    }

    useEffect(() => {
        props.getDataFromDatabase(currentPage)
    }, [currentPage])

    const TableRenderer = () => {
        if (transactions.length === 0) return <></>;
        // @ts-ignore
        return (
            <table>
                <thead>
                <tr>
                    {Object.keys(transactions[0]).map((k, idx) => (
                        <th key={idx}>{k}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {transactions?.map((item: any) => (
                    <tr key={item.tx_hash}>
                        {Object?.keys(item).map((k, idx) => (
                            <td key={idx}>{item[k]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }

    return (
        <>
            <Heading title={"Transaction History"}>
                <PageRenderer/>
            </Heading>
            <TableRenderer/>
        </>
    );
}