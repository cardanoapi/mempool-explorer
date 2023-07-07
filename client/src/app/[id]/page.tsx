"use client";

import {Navbar} from "@app/components/navbar";
import {Heading} from "@app/utils/string-utils";
import BlockDetails from "@app/components/transactions/block-details";
import React from "react";


import 'react-toastify/dist/ReactToastify.css';

import StatsSummary from "@app/components/details-page/stats-summary";
import TransactionHistory from "@app/components/transactions/transaction-history";
import AddressTitle from "@app/components/details-page/address-title";


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

    return (
        <>
            <Navbar/>
            <div>
                <div className={"flex items-center justify-center"}>
                    <AddressTitle/>
                </div>
                <BlockDetails>
                    <StatsSummary/>
                </BlockDetails>
                <Heading title={"Transaction History"}/>
                <TransactionHistory/>
            </div>
        </>
    )
}
