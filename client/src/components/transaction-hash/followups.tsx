import Layout from "@app/shared/layout";
import {getTimeString, Heading, toMidDottedStr} from "@app/utils/string-utils";
import {txs} from "@app/assets/mock-data/mock-data";
import {useEffect, useState} from "react";
import {convertFollowupsToClientSide} from "@app/utils/transaction-details-utils";
import {useParams} from "next/navigation";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";

interface FollowupPropType {
    followups: any;
    arrival_time: any;
}

interface ClientsideFollowups {
    hash: string;
    fee: string;
    consumes: number;
}

export default function Followups(props: FollowupPropType) {
    const router = useParams();

    const [followups, setFollowups] = useState<Array<any>>([])

    useEffect(() => {
        if (!props.followups) return;
        const followupsTemp = convertFollowupsToClientSide(props.followups, router.id.toLowerCase());
        setFollowups(followupsTemp);
    }, [props, router.id])

    if (!props.followups) {
        return (
            <Layout>
                <div className={'flex flex-col'}>
                    <h1 className={'font-semibold text-2xl mb-2'}>Followups</h1>
                    <EmptyPageIcon message={"Followups details not available"}/>
                </div>
            </Layout>
        )
    }

    function ItemCard(props: any) {
        const dataObj = {...props.transaction, arrival_time: getTimeString(props.arrival_time)};
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
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                {followups.map((tx) => (
                    <ItemCard key={tx.hash} transaction={tx} arrival_time={props.arrival_time}/>
                ))}
            </div>
        </Layout>
    );
}