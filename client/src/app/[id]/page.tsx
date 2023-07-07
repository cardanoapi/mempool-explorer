"use client";

import {Navbar} from "@app/components/navbar";
import {useParams} from "next/navigation";
import {Heading} from "@app/utils/string-utils";
import BlockDetails from "@app/components/transactions/block-details";
import React, {useEffect} from "react";


import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from "@app/assets/svgs/copy-to-clipboard";

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

    const router = useParams();


    const linkBuilder = () => {
        // const addr = Address.from_bech32(router.id);
        // const addr = Address.from_bech32("pool17kew7rtakc7g6qzydntann5umw08xq3ll2j7spk7en4kvff69fa");
        // const hex = Buffer.from(addr.to_bytes()).toString('hex');
        // console.log(hex)

        // const addr = Address.from_bech32('addr1qxy657awttf5avs2629f4hs6k5ulhw8f27akv30yws622dudj86zwkwhv3yjky5ntrmhcln5yxc05rcq0lhs8l78vd3qhc5eak');
        // const hex = Buffer.from(addr.to_bytes()).toString('hex');
        // const baseUrl = "https://cardanoscan.io/"
        // if (router.id.startsWith("pool")) {
        //     return baseUrl + "pool" + `/${hex}`
        // } else if (router.id.startsWith("addr")) {
        //     return baseUrl + "address" + `/${hex}`
        // } else {
        //     return ""
        // }
    }

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
