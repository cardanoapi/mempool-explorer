import {useEffect, useState} from "react";
import {checkForErrorResponse} from "@app/components/loader/error";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";
import {useParams, useRouter} from "next/navigation";
import {Transaction} from "@emurgo/cardano-serialization-lib-asmjs";
import {ErrorType} from "@app/components/transaction-hash/transaction-input-output";
import {convertFollowupsToClientSide} from "@app/utils/transaction-details-utils";
import Layout from "@app/shared/layout";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {Heading, toMidDottedStr} from "@app/utils/string-utils";

interface CompetitorPropType {
    competing: any;
    isLoading: Boolean;
    error: ErrorType;
}

export default function Competitors(props: CompetitorPropType) {
    const router = useParams();

    const [competitors, setCompetitors] = useState<Array<any>>([])

    useEffect(() => {
        if (!props.competing) return;
        const competitorsTemp = convertFollowupsToClientSide(props.competing, router.id.toLowerCase());
        setCompetitors(competitorsTemp);
    }, [props, router.id])

    if (props.isLoading) {
        return (
            <Layout>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold text-2xl mb-2'}>Followups</h1>
                    <EmptyPageIcon message={"Fetching competing.."}/>
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
                            <p className={'text-gray-500 font-xs font-bold'}>{typeof dataObj[key] === "number" ? dataObj[key] : toMidDottedStr(dataObj[key])}</p>
                        </div>
                    </div>
                ))}
            </Layout>
        )
    }


    return (
        <Layout className={"!overflow-y-scroll"}>
            <Heading title={'Followups'}/>
            {!competitors.length ? <EmptyPageIcon message={"No followups available!"}/> :
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {competitors.map((tx) => (
                        <ItemCard key={tx.hash} transaction={tx}/>
                    ))}
                </div>
            }
        </Layout>
    );
}