import React, {useEffect, useState} from "react";

import "../table/table.css";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {decode} from "cbor-x";
import {useParams} from "next/navigation";
import useLoader from "@app/components/loader/useLoader";
import Loader from "@app/components/loader";
import {checkForErrorResponse, ErrorPage} from "@app/components/loader/error";
import {toMidDottedStr} from "@app/utils/string-utils";

export default function TransactionHistory() {

    const router = useParams();

    const [currentPage, setCurrentPage] = useState(1);

    const {isLoading, hideLoader, error, setError} = useLoader();


    const [transactions, setTransactions] = useState([]);

    const getDataFromDatabase = async (pageNumber: number) => {
        const response = await fetch(`/api/db?id=${router.id}&pageNumber=${pageNumber}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    }

    useEffect(() => {
        getDataFromDatabase(currentPage)
            .then(d => setTransactions(d))
            .catch((e: any) => setError({
                message: e.message,
                status: e.code
            })).finally(() => hideLoader())
    }, [currentPage])

    if (isLoading) return <Loader/>;

    if (error.status) return <ErrorPage errObj={error}/>;

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

    const TableRenderer = () => {
        if (transactions.length === 0) return <EmptyPageIcon/>;

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
                        {Object?.keys(item).map((k, idx) => {
                            if (k === "tx_hash") {
                                return (
                                    <a
                                        className={"cursor-pointer hover:text-blue-500"}
                                        key={item[k]}
                                        target={"_blank"}
                                        href={`/transactions/${item[k]}`}>{toMidDottedStr(item[k])}</a>
                                )
                            } else {
                                return <td key={idx}>{item[k]}</td>
                            }
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }

    return (
        <>
            <PageRenderer/>
            {transactions.length === 0 ? <EmptyPageIcon/> : <TableRenderer/>}
        </>
    );
}