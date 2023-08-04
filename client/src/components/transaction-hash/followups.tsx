import Layout from "@app/shared/layout";
import {Heading, toMidDottedStr} from "@app/utils/string-utils";
import {useEffect, useState} from "react";
import {convertFollowupsToClientSide} from "@app/utils/transaction-details-utils";
import {useParams} from "next/navigation";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {ErrorType} from "@app/components/transaction-hash/transaction-input-output";
import {Buffer} from "buffer";
import {checkForErrorResponse} from "@app/components/loader/error";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";

interface FollowupPropType {
    followups: any;
    isLoading: Boolean;
    error: ErrorType;
}

export default function Followups(props: FollowupPropType) {
    const router = useParams();

    const [followups, setFollowups] = useState<Array<any>>([]);

    const {setError, showLoader, hideLoader} = useLoader();

    const getConfirmation = async (queryString: string) => {
        const response = await fetch(`/api/v1/tx/confirmation?${queryString}`);
        await checkForErrorResponse(response)
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    }

    function addConfirmationStatusToIncomingApiResponse(apiResponse: any, confirmationResponse: any) {
        return apiResponse.map((tx: any) => {
            let confirmation_status = false;
            // iterate through each confirmation response and check the tx hash tallying
            for (let i = 0; i < confirmationResponse.length; i++) {
                const txHash = Buffer.from(tx.hash).toString('hex');
                const confirmationHash = Buffer.from(confirmationResponse[i].tx_hash).toString('hex')
                if (txHash === confirmationHash) {
                    confirmation_status = true;
                    break;
                }
            }
            return {
                ...tx,
                confirmation_status: confirmation_status
            }
        })
    }

    async function getTransactionHashesOfEachFollowups() {
        const hashes = props?.followups.map((tx: any) => "hash=" + Buffer.from(tx.hash).toString('hex'))
        const confirmationQueryString = hashes.join("&");
        try {
            const confirmationResponse = await getConfirmation(confirmationQueryString);
            const responseWithConfirmationStatus = addConfirmationStatusToIncomingApiResponse(props.followups, confirmationResponse)
            hideLoader();
            return responseWithConfirmationStatus
        } catch (e: any) {
            setError({
                message: e.message,
                status: e.code
            })
        }
    }

    useEffect(() => {
        if (!Array.isArray(props.followups)) return;
        showLoader();
        getTransactionHashesOfEachFollowups().then(data => {
            const followupsTemp = convertFollowupsToClientSide(data, router.id.toLowerCase());
            setFollowups(followupsTemp);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, router.id])

    if (props.isLoading) {
        return (
            <Layout>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold text-2xl mb-2'}>Followups</h1>
                    <EmptyPageIcon message={"Fetching followups.."}/>
                </div>
            </Layout>
        )
    }

    function ItemCard(props: any) {
        const dataObj = props.transaction;
        return (
            <Layout>
                {Object.keys(dataObj).map(key => (
                    <div key={key} className={'flex flex-col'}>
                        <div className={'flex items-center mt-1 text-sm gap-1'}>
                            <p className={'text-gray-600 mr-1'}>{key}</p>
                            <p className={'text-gray-500 font-xs font-bold'}>{key === "hash" ? toMidDottedStr(dataObj[key]) : dataObj[key]}</p>
                        </div>
                    </div>
                ))}
            </Layout>
        )
    }


    return (
        <Layout className={"!overflow-y-scroll"}>
            <Heading title={'Followups'}/>
            {!followups?.length ? <EmptyPageIcon message={"No followups available!"}/> :
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {followups.map((tx) => (
                        <ItemCard key={tx.hash} transaction={tx}/>
                    ))}
                </div>
            }
        </Layout>
    );
}