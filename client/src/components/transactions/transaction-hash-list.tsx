import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import {MempoolEventType} from '@app/constants/constants';
import Layout from '@app/shared/layout';
import {
    AddRejectTxClientSideType,
    RemoveMintedTransactions,
    RemoveTxClientSideType
} from '@app/types/transaction-details-response/socket-response-type';
import {Heading, toMidDottedStr} from '@app/utils/string-utils';
import {useEffect, useState} from 'react';
import Link from "next/link";


export interface PropType {
    event: AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions | undefined;
    index: number;
}

export default function TransactionEventList(props: PropType) {

    const [eventLogList, setEventLogList] = useState<Array<typeof props.event>>([]);

    const [animateNewItem, setAnimateNewItem] = useState(false);

    useEffect(() => {
        if (animateNewItem) {
            const animationDuration = 1000;
            const timeout = setTimeout(() => {
                setAnimateNewItem(false);
            }, animationDuration);
            return () => clearTimeout(timeout);
        }
    }, [animateNewItem]);

    useEffect(() => {
        if (!props.event) return;
        setEventLogList([props.event, ...eventLogList])
        setAnimateNewItem(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.event])

    // function updateTimeForEveryEventLog() {
    //     eventLogList.map(event => {
    //         return {
    //             ...event,

    //         }
    //     })
    // }

    // setTimeout(updateTimeSinceArrival,1000)

    function renderBatchPill(action: string) {
        const batchPillBaseStyle = 'text-xs rounded-md p-1 border-solid border-[1px]';
        switch (action) {
            case 'add':
                return <div className={`${batchPillBaseStyle} bg-green-100 border-green-400`}>{action}</div>;
            case 'remove':
                return <div className={` ${batchPillBaseStyle} bg-red-100 border-red-400 `}>{action}</div>;
            case 'reject':
                return <div className={` ${batchPillBaseStyle} bg-yellow-100 border-yellow-400`}>{action}</div>;
        }
    }

    function ItemsCardElementLayout(props: any) {
        const {action, hash} = props;
        return (
            <Layout>
                <div className={`flex my-2 justify-between items-center`}>
                    <>{renderBatchPill(action)}</>
                    <Link className={'flex flex-col cursor-pointer text-sm text-blue-500'}
                          href={`/transactions/${hash}`}
                          target={"_blank"}>
                        {toMidDottedStr(hash, 10)}
                    </Link>
                    {/* <div className={'flex flex-col'}>
                        <p className="font-bold">{event.amount} ADA</p>
                    </div> */}
                </div>
            </Layout>
        )
    }

    function AddRejectEvent(props: { event: AddRejectTxClientSideType }) {
        const event = props.event;
        return <ItemsCardElementLayout action={event.action} hash={event.hash}/>
    }

    function RemoveEvent(props: { event: RemoveTxClientSideType, parentIndex: number }) {
        const event = props.event;
        return (
            <>
                {event.txHashes.map((e, index) => {
                    return (
                        <div key={index} className={`mx-1 py-1 ${animateNewItem && !index && !props.parentIndex ? "block-list" : ""}`}>
                            <ItemsCardElementLayout key={index} action={event.action} hash={e}/>
                        </div>
                    )
                })}
            </>
        )
    }

    function TransactionItems(props: PropType) {
        const event = props.event as AddRejectTxClientSideType | RemoveTxClientSideType;
        if (event.action === MempoolEventType.Add || event.action === MempoolEventType.Reject) {
            const addRejectEvent = props.event as AddRejectTxClientSideType;
            return (
                <div className={`mx-1 py-1 ${animateNewItem && props.index === 0 ? "block-list" : ""}`}>
                    <AddRejectEvent event={addRejectEvent}/>
                </div>
            )
        } else if (event.action === MempoolEventType.Remove) {
            const removeEvent = props.event as RemoveTxClientSideType;
            return <RemoveEvent parentIndex={props.index} event={removeEvent}/>
        }
    }

    return (
        <div className="min-h-full max-h-full overflow-auto bg-white border-[2px] !min-w-[400px] p-2 border-solid ">
            <Heading title={'Transaction Events'}/>
            <div className={"h-full"}>
                {!!eventLogList && eventLogList.length ? (
                    <>
                        {eventLogList.map((tx, index) => (
                            <TransactionItems index={index} key={index} event={tx}/>
                        ))}
                    </>
                ) : (
                    <EmptyPageIcon message={""}/>
                )}
            </div>
        </div>
    );
}
