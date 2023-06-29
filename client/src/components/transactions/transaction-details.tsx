import {Heading} from "@app/utils/string-utils";
import {useRouter} from "next/navigation";

export default function TransactionDetails() {

    const router = useRouter();

    const transactionData = {
        "hash": "388572ed586359186f938173ec94bb80b0ba56f5b125c76691f224e278839763",
        "block": "89650",
        "epoch/slot": "420/359124",
        "Total fees": "12",
        "Certificates": "0",
        "stake": "stake1uyxuvcgktaycmpmtja372zxaj3tjrvxxr7vl6d2qfjk4ecsrsvfyt"
    }

    const TransactionCard = ({transactionData}: any) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(transactionData).map(([key, value]: any) => (
                    <div key={key} className="border-solid border-2 border-gray-200 p-2">
                        <h4 className={"text-sm text-gray-500"}>{key}</h4>
                        {key === "stake" ?
                            <p className={"overflow-x-hidden text-lg cursor-pointer"}
                               onClick={() => router.push(`/${value}`)}>{value}</p>
                            :
                            <p className={"overflow-x-hidden text-lg"}>{value}</p>
                        }
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className={" w-full h-full p-4 bg-white border-2 "}>
            <Heading title={"Transaction Details"}/>
            <TransactionCard transactionData={transactionData}/>
        </div>
    )
}