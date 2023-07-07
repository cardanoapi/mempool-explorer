"use client";

import {Navbar} from "@app/components/navbar";
import {toMidDottedStr} from "@app/utils/string-utils";
import {useParams} from "next/navigation";

export default function TransactionDetails() {

    const router = useParams();

    const txs = [
        {
            hash_id: "1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28785",
            fee: "45",
            arrival_time: "2023-05-02"
        },
        {
            hash_id: "02023c57608d1966ca9035941c62b07b80393c96e0efca1e299b007bce7e2b81",
            fee: "30",
            arrival_time: "2022-02-01"
        },
        {
            hash_id: "2f7e42982dcdde9ac46f0ced2f6ff0815ad8a26c70c8cb552ff381d2facaec79",
            fee: "7.9999",
            arrival_time: "2023-03-02"
        },
        {
            hash_id: "1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28785",
            fee: "12",
            arrival_time: "2023-05-02"
        },
        {
            hash_id: "d4ab872e0d2bf36bef994f8457236d3c7dce4371c3bf95238c8f3fd61216df7e",
            fee: "3.4523",
            arrival_time: "2022-02-01"
        },
    ]

    function Layout(props: any) {
        return (
            <div
                className={"border-solid bg-white mt-4 border-[1px] border-[#bfbfbf] p-4 rounded-md"}>{props.children}</div>
        )
    }

    function ItemCard(props: any) {
        const tx = props.transaction;
        return (
            <Layout>
                <div className={"flex flex-col"}>
                    <div className={"flex items-center mt-1 text-sm"}>
                        <p className={"text-gray-700 mr-1 font-semibold"}>Hash ID </p>
                        <p className={"text-gray-500 font-xs"}>{toMidDottedStr(tx.hash_id)}</p>
                    </div>
                    <div className={"flex items-center mt-1 text-sm"}>
                        <p className={"text-gray-700 mr-1 font-semibold"}>Fee</p>
                        <p className={"font-bold"}>{tx.fee}</p>
                    </div>
                    <div className={"flex items-center mt-1 text-sm"}>
                        <p className={"text-gray-700 mr-1 font-semibold"}>Arrival time</p>
                        <p className={"font-bold"}>{tx.arrival_time}</p>
                    </div>
                </div>

            </Layout>
        )
    }

    function TransactionInputOutput() {
        return (
            <Layout>
                <div className={"flex flex-col mb-4"}>
                    <h1 className={"font-semibold text-2xl mb-2"}>Cardano Transaction</h1>
                    <p className={"mr-1 font-semibold"}>Hash ID </p>
                    <p className={"text-gray-500 font-sm"}>{router.id}</p>
                </div>

                <div className={"flex justify-between items-start"}>
                    <div className={"mr-40"}>
                        <h1 className={"font-semibold mb-2"}>Inputs</h1>
                        <div className={"flex items-center"}>
                            <p className={"font-semibold mr-2"}>1.</p>
                            <div className={"flex flex-col text-sm"}>
                                <p className={"text-blue-500"}>{toMidDottedStr("addr1q83k8k7s662gdds8a9vcf5r63fevkdpzl5uap5upc8l6atfeydmqle3s0wvtynktx0adawc88wq57m5qhday5rr6y00s4e8adc")}</p>
                                <p className={"font-bold"}>46.884724</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className={"font-semibold mb-2"}>Outputs</h1>
                        <div className={"flex flex-col gap-6"}>
                            <div className={"flex items-center"}>
                                <p className={"font-semibold mr-2"}>1.</p>
                                <div className={"flex flex-col text-sm"}>
                                    <p className={"text-blue-500"}>{toMidDottedStr("addr1q83k8k7s662gdds8a9vcf5r63fevkdpzl5uap5upc8l6atfeydmqle3s0wvtynktx0adawc88wq57m5qhday5rr6y00s4e8adc")}</p>
                                    <div className={"flex justify-between items-center"}>
                                        <p className={"font-semibold"}>46.884724</p>
                                        <p className={"p-1 text-xs border-solid border-[1px] bg-amber-50 border-amber-400 rounded-lg"}>a2vv.dene</p>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex items-center"}>
                                <p className={"font-semibold mr-2"}>2.</p>
                                <div className={"flex flex-col text-sm"}>
                                    <p className={"text-blue-500"}>{toMidDottedStr("addr1q83k8k7s662gdds8a9vcf5r63fevkdpzl5uap5upc8l6atfeydmqle3s0wvtynktx0adawc88wq57m5qhday5rr6y00s4e8adc")}</p>
                                    <p className={"font-bold"}>46.884724</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    function Heading(props: any) {
        const title = props.title;
        return (
            <h1 className={"font-semibold text-lg mb-2 border-gray-300 border-b-[1px] border-solid"}>{title}</h1>
        )
    }

    function Competitors() {
        return (
            <Layout>
                <Heading title={"Competitors"}/>
                <div className={"grid grid-cols-2 gap-4 max-h-[300px] overflow-y-scroll"}>
                    {txs.map(tx => (
                        <ItemCard key={tx.hash_id} transaction={tx}/>
                    ))}
                </div>
            </Layout>
        )
    }

    function Followups() {
        return (
            <Layout>
                <Heading title={"Followups"}/>
                <div className={"grid grid-cols-2 gap-4 max-h-[300px] overflow-y-scroll"}>
                    {txs.map(tx => (
                        <ItemCard key={tx.hash_id} transaction={tx}/>
                    ))}
                </div>
            </Layout>
        )
    }


    return (
        <>
            <Navbar/>
            <div className={"flex flex-col items-center"}>
                <div className={"flex justify-between gap-6 items-start"}>
                    <TransactionInputOutput/>
                    <div className={"flex flex-col items-center"}>
                        <Competitors/>
                        <Followups/>
                    </div>
                </div>
            </div>


        </>
    )
}