"use client";

import {Navbar} from "@app/components/navbar";
import {useParams} from "next/navigation";
import {Heading} from "@app/utils/string-utils";
import BlockDetails from "@app/components/transactions/block-details";

export default function AddressPage() {
    const data = {
        "stat 1": "value 1",
        "stat 2": "value 2",
        "stat 3": "value 3"
    }
    const router = useParams()
    return (
        <>
            <Navbar/>
            <div className={"p-4"}>
                <Heading title={router.id}/>
                <BlockDetails>
                    <div className={"flex gap-2"}>
                        {Object.entries(data).map(([key, value]: any) => (
                            <div key={key} className="border-solid rounded-lg border-2 bg-gray-100 px-2 border-gray-400 ">
                                <h4 className={"text-sm text-gray-500"}>{key}:{value}</h4>
                            </div>
                        ))}
                    </div>
                </BlockDetails>
            </div>
        </>
    )
}