import {Heading, toMidDottedStr} from "@app/utils/string-utils";
import {useEffect} from "react";

export default function TransactionHashList() {
    const transactionHashes = ["b2257dbec4034b96b588cc0148dc0bae2e2005cb5dba58fc2501a1a2f6b618ca", "65b0b6ded8a8ee149e77fe4b91b10003efe748ca91c9c5b25886b8beeb84fead", "65b0b6ded8a8ee149e77fe4b91b10003efe748ca91c9c5b25886b8beeb84fead", "65b0b6ded8a8ee149e77fe4b91b10003efe748ca91c9c5b25886b8beeb84fead"];

    useEffect(() => {

    },[])

    return (
        <div className={"p-4 border-solid border-[2px] overflow-y-scroll bg-white"}>
            <Heading title={"Transactions"}/>
            {transactionHashes.map((hash, index) => (
                <div key={index} className={"my-2 mx-1 px-2 py-2 cursor-pointer hover:bg-amber-100"}>
                    {toMidDottedStr(hash)}
                </div>
            ))}
        </div>
    )
}