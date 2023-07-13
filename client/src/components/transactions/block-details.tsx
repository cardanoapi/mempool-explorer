import TableLayout from '@app/shared/table-layout';
import {createLinkElementForBlockDetails, Heading} from '@app/utils/string-utils';
import {BlockDetailsType} from "@app/types/transaction-details-response/socket-response-type";
import { MintMessage } from '@app/lib/websocket';
import { useEffect, useState } from 'react';

interface BlockType {
    event: MintMessage;
}

export default function BlockDetails(props:BlockType) {

    const [mintDetails, setMintDetails] = useState<Array<MintMessage>>([]);

    useEffect(() => {
        if(!props.event) return;
        setMintDetails([props.event,...mintDetails])
    },[props.event])

    // console.log("mint details",mintDetails)

    // const transactionData: Array<BlockDetailsType> = [
    //     {
    //         block: '89650',
    //         "epoch/slot": '420/359124',
    //         Transactions: '12',
    //         Timestamp: '2022/12/30',
    //         Stake_pool: 'pool1z5uqdk7dzdxaae5633fqfcu2eqzy3a3rgtuvy087fdld7yws0xt',
    //         Output: 1200
    //     },
    //     {
    //         block: '89649',
    //         "epoch/slot": '420/359124',
    //         Transactions: '12',
    //         Timestamp: '2022/12/30',
    //         Stake_pool: 'pool1xk3ck79lra9c9x5c684lylvg8vlexmh0eh7w90t6s0zvw6k5vn7',
    //         Output: 200
    //     },
    //     {
    //         block: '89648',
    //         'epoch/slot': '420/359124',
    //         Transactions: '12',
    //         Timestamp: '2022/12/30',
    //         Stake_pool: 'pool1zvm45jj5wz6kgfr2xfg75rx0auzxaedu4ulddhnrzk4uwuyuvpn',
    //         Output: 100
    //     },
    //     {
    //         block: '89650',
    //         'epoch/slot': '420/359124',
    //         Transactions: '12',
    //         Timestamp: '2022/12/30',
    //         Stake_pool: 'pool1qlpen2kkw8yc0pjyjjcg4zlswhrahf73f99y3ae85kjy6leqk7l',
    //         Output: 20
    //     }
    // ];

    return (
        <div className={'w-full h-full p-4 bg-white border-2 overflow-auto'}>
            <Heading title={'Block Details'}/>
            <TableLayout data={createLinkElementForBlockDetails(mintDetails)}/>
        </div>
    );
}
