import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {decode} from "cbor-x";
import useLoader from "@app/components/loader/useLoader";
import Loader from "@app/components/loader";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {checkForErrorResponse, ErrorPage} from "@app/components/loader/error";

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

export default function StatsSummary() {
    const [stats, setStats] = useState([]);
    const {isLoading, hideLoader, error, setError} = useLoader();

    const router = useParams();

    const getStatsFromDatabase = async () => {
        const response = await fetch(`/api/v1/tx/stats?query=${router.id}`);
        await checkForErrorResponse(response)
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    }

    useEffect(() => {
        getStatsFromDatabase().then(d => setStats(d))
            .catch((e: any) =>
                setError({
                    message: e.message,
                    status: e.code
                })).finally(() => hideLoader())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.id])

    if (isLoading) return <Loader/>

    if (error.status !== -1) return <ErrorPage errObj={error}/>;
    if (!stats || stats.length === 0) return <EmptyPageIcon message={""}/>;

    return (
        <div className={"flex flex-col items-center gap-2"}>
            {stats?.map((stat, idx) => (
                <div key={idx}
                     className={"flex flex-col gap-2 border-b-[1px] items-start justify-center border-b-gray-300 last:border-none py-3 first:pt-0 last:pb-0"}>
                    <div className={`flex gap-2`}>
                        <div className={'flex flex-col gap-2'}>
                            <p className={'text-lg uppercase tracking-widest'}>EPOCH</p>
                            <p className={'text-lg font-bold uppercase tracking-widest'}>{stat['epoch']}</p>
                        </div>
                        <div className={`flex gap-2`}>
                            {Object.entries(stat).map(([key, value]: any) => key !== 'epoch' && (
                                <div key={key}
                                     className={`${key === 'epoch' ? '' : 'border-solid border-[1px] bg-blue-50 px-3 py-1 border-blue-800'}`}>
                                    <p className={`${key === 'epoch' ? 'uppercase tracking-widest' : 'text-gray-500'}`}>{StatsEnum[key]}</p>
                                    <p className={"font-bold text-lg"}> {value} </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}