import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import { MempoolEventType } from '@app/constants/constants';
import Layout from '@app/shared/layout';
import { AddRejectTxClientSideType, RemoveTxClientSideType } from '@app/types/transaction-details-response/socket-response-type';
import { updateTimeSinceArrival } from '@app/utils/cardano-utils';
import {Heading, toMidDottedStr} from '@app/utils/string-utils';
import { useEffect, useState } from 'react';


export interface PropType {
    event: AddRejectTxClientSideType | RemoveTxClientSideType | undefined ;
}

export default function TransactionEventList(props: PropType) {

    const [eventLogList,setEventLogList] = useState<Array<typeof props.event>>([]);

    useEffect(() => {
        if(!props.event) return;
        setEventLogList([props.event,...eventLogList])
    },[props.event])

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

    function AddRejectEvent(props: {event: AddRejectTxClientSideType}) {
        const event = props.event;
        const currentDateTime = new Date(Date.now()).toISOString();
        return (
            <Layout>
                <div className={'flex gap-4 justify-between items-center'}>
                    <>{renderBatchPill(event.action)}</>
                    <div className={'flex flex-col'}>
                        <p className="text-sm">
                            Hash <span className="text-md text-blue-500">{toMidDottedStr(event.hash, 4)}</span>
                        </p>
                        <p className="text-sm text-gray-400">{currentDateTime}</p>
                    </div>
                    {/* <div className={'flex flex-col'}>
                        <p className="font-bold">{event.amount} ADA</p>
                    </div> */}
                </div>
            </Layout>
        )
    }

    function RemoveEvent(props: {event: RemoveTxClientSideType}) {
        const event = props.event;
        return (
            <>
            {event.txHashes.map((e) => {
               return( 
               <Layout className={"mb-2"}>
                <div className={'flex gap-4 justify-between items-center'}>
                    <>{renderBatchPill(event.action)}</>
                    <div className={'flex flex-col'}>
                        <p className="text-sm">
                            Hash <span className="text-md text-blue-500">{toMidDottedStr(e, 4)}</span>
                        </p>
                        <p className="text-sm text-gray-400">{new Date(Date.now()).toISOString()}</p>
                    </div>
                    {/* <div className={'flex flex-col'}>
                        <p className="font-bold">{event.amount} ADA</p>
                    </div> */}
                </div>
            </Layout>
               )
            })}
            </>
        )
    }


    function TransactionItems(props: PropType) {
        const event = props.event as AddRejectTxClientSideType|RemoveTxClientSideType;
        if(event.action === MempoolEventType.Add || event.action === MempoolEventType.Reject) {
            const addRejectEvent = props.event as AddRejectTxClientSideType;
            return <AddRejectEvent event={addRejectEvent}/>
        } else if (event.action === MempoolEventType.Remove) {
            const removeEvent = props.event as RemoveTxClientSideType;
            return <RemoveEvent event={removeEvent} />
        }
    }

    return (
        <div className="min-h-full max-h-full overflow-auto bg-white border-[2px] !min-w-[400px] p-2 border-solid ">
            <Heading title={'Transaction Events'}/>
            <div className={"h-full"}>
                {!!eventLogList && eventLogList.length ? (
                    <>
                        {eventLogList.map((tx, index) => (
                            <div key={index} className={'mx-1 py-2 cursor-pointer block-list'}>
                                <TransactionItems event={tx}/>
                            </div>
                        ))}
                    </>
                ) : (
                    <EmptyPageIcon/>
                )}
            </div>
        </div>
    );
}
