"use client";

import {Navbar} from "@app/components/navbar";
import {useParams} from "next/navigation";
import {Heading} from "@app/utils/string-utils";
import BlockDetails from "@app/components/transactions/block-details";
import {useEffect, useState} from "react";
import {decode} from "cbor-x";
import {getLatestEpoch} from "@app/utils/cardano-utils";
import AddressTransactionHistory from "@app/components/transactions/transaction-history";

import 'react-toastify/dist/ReactToastify.css';

type StatsEnumType = {
    [key: string]: string;
};

const StatsEnum: StatsEnumType = {
    tx_count: "Transaction",
    avg_wait_time: "Average wait time",
    min_wait_time: "Minimum wait time",
    median_wait_time: "Median wait time",
    best_5_percent: "Best 5 percent",
    worst_5_percent: "Worst 5 percent",
    max_wait_time: "Maximum wait time"
}

export default function AddressPage() {

    const router = useParams();

    const [transactions, setTransactions] = useState([]);

    const [stats, setStats] = useState([]);

    const getDataFromDatabase = async (pageNumber: number) => {
        const response = await fetch(`/api/db?id=${router.id}&pageNumber=${pageNumber}`);
        const arrayBuffer = await response.arrayBuffer();
        let data = decode(new Uint8Array(arrayBuffer));
        setTransactions(data)
    }

    const getStatsFromDatabase = async () => {
        const response = await fetch(`/api/db/block?id=${router.id}`);
        const arrayBuffer = await response.arrayBuffer();
        let data = decode(new Uint8Array(arrayBuffer));
        setStats(data);
    }

    useEffect(() => {
        getDataFromDatabase(1).then()
        getStatsFromDatabase().then()
    }, [router.id])

    return (
        <>
            <Navbar/>
            <div className={"p-4"}>
                <Heading title={router.id}/>
                <BlockDetails>
                    {stats.length > 0 &&
                        <div className={"flex flex-col gap-2"}>
                            {stats.map((stat, idx) => (
                                <div key={idx}
                                     className={"flex flex-col gap-2 border-b-[1px] items-start justify-center border-b-gray-300 last:border-none py-3 first:pt-0 last:pb-0"}>
                                    <div className={`flex gap-2`}>
                                        <div className={'flex flex-col gap-2'}>
                                            <p className={'text-lg uppercase tracking-widest'}>EPOCH</p>
                                            <p className={'text-lg font-bold uppercase tracking-widest'}>{stat['epoch']}</p>
                                        </div>
                                        <div className={`flex gap-2`}>
                                            {Object.entries(stat).map(([key, value]: any) => key !== 'epoch' && (
                                                <div key={key}
                                                     className={`${key === 'epoch' ? '' : 'border-solid border-[1px] bg-blue-50 px-3 py-1 border-blue-800'}`}>
                                                    <p className={`${key === 'epoch' ? 'uppercase tracking-widest' : 'text-gray-500'}`}>{StatsEnum[key]}</p>
                                                    <p className={"font-bold text-lg"}> {value} </p>
                                                </div>
                                            ))}
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>
                    }
                </BlockDetails>
                <AddressTransactionHistory transactions={transactions} getDataFromDatabase={getDataFromDatabase}/>
            </div>
        </>
    )
}
