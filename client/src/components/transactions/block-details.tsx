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

    return (
        <div className={'w-full h-full p-4 bg-white border-2 overflow-auto'}>
            <Heading title={'Block Details'}/>
            <TableLayout data={createLinkElementForBlockDetails(mintDetails)}/>
        </div>
    );
}
