import CardanoIcon from "@app/assets/svgs/cardano-icon";
import {useParams} from "next/navigation";
import CopyToClipboard from "@app/assets/svgs/copy-to-clipboard";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Address, BaseAddress, PoolMetadata, PoolMetadataHash} from "@emurgo/cardano-serialization-lib-asmjs";
import LinkIcon from "@app/assets/svgs/link-icon";

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

    function generateCardanoScanLink() {
        const baseUrl = "https://cardanoscan.io/"
        if (router.id.startsWith("addr")) {
            const addr = Address.from_bech32(router.id);
            const hex = Buffer.from(addr.to_bytes()).toString('hex');
            return baseUrl + "address" + `/${hex}`
        } else if (router.id.startsWith("pool")) {
            return baseUrl + "pool/" + router.id
        }
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
                            <div className={"cursor-pointer mr-2"} onClick={() => copyToClipboard()}>
                                <CopyToClipboard/>
                            </div>
                            <a target={"_blank"} className={"cursor-pointer"} href={generateCardanoScanLink()}>
                                <LinkIcon/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}