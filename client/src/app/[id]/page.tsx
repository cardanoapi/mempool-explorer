"use client";

import {Navbar} from "@app/components/navbar";
import {useParams} from "next/navigation";
import {Heading} from "@app/utils/string-utils";
import BlockDetails from "@app/components/transactions/block-details";
import {useEffect, useState} from "react";
import {decode} from "cbor-x";
import {getLatestEpoch} from "@app/utils/cardano-utils";
import AddressTransactionHistory from "@app/components/transactions/transaction-history";

import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddressPage() {

    const router = useParams();

    const [transactions, setTransactions] = useState([]);

    const data = {
        "stat 1": "value 1",
        "stat 2": "value 2",
        "stat 3": "value 3"
    }
    const getDataFromDatabase = async (pageNumber: number) => {
        const latestEpoch = getLatestEpoch();
        const response = await fetch(`/api/db?id=${router.id}&pageNumber=${pageNumber}`);
        console.log(response)
        const arrayBuffer = await response.arrayBuffer();
        console.log("Array buffer:", arrayBuffer)
        let data = decode(new Uint8Array(arrayBuffer));
        setTransactions(data)
    }

    useEffect(() => {
        getDataFromDatabase(1).then()
    }, [router.id])
    return (
        <>
            <Navbar/>
            <div className={"p-4"}>
                <Heading title={router.id}/>
                <BlockDetails>
                    <div className={"flex gap-2"}>
                        {Object.entries(data).map(([key, value]: any) => (
                            <div key={key}
                                 className="border-solid rounded-lg border-2 bg-gray-100 px-2 border-gray-400 ">
                                <h4 className={"text-sm text-gray-500"}>{key}:{value}</h4>
                            </div>
                        ))}
                    </div>
                </BlockDetails>
                <AddressTransactionHistory transactions={transactions} getDataFromDatabase={getDataFromDatabase}/>
            </div>
        </>
    )
}
