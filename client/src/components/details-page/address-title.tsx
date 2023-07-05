import CardanoIcon from "@app/assets/svgs/cardano-icon";
import {useParams} from "next/navigation";
import CopyToClipboard from "@app/assets/svgs/copy-to-clipboard";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddressTitle() {
    const router = useParams();

    function copyToClipboard() {
        navigator.clipboard.writeText(router.id)
            .then(() => {
                toast.info("Text copied to clipboard")
            })
            .catch((error) => {
                toast.error("Could not copy to clipboard")
            });
    }

    return (
        <>
            <ToastContainer position={"bottom-right"} autoClose={2000}/>
            <div className={"flex flex-col justify-center items-center"}>
                <div className={"flex items-center gap-2 mb-4"}>
                    <CardanoIcon/>
                    <div className={"flex flex-col items-start"}>
                        <p className={"text-gray-500 text-sm"}>Address</p>
                        <div className={"flex items-center"}>
                            <p className={"font-bold mr-1"}>{router.id}</p>
                            <div className={"cursor-pointer"} onClick={() => copyToClipboard()}>
                                <CopyToClipboard/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}