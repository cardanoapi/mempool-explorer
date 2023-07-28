import TableLayout from '@app/shared/table-layout';
import {createLinkElementForBlockDetails, Heading} from '@app/utils/string-utils';
import {MintMessage} from '@app/lib/websocket';
import {useEffect, useState} from 'react';
import {BlockDetailsTableInputType} from "@app/constants/constants";

interface BlockType {
    event: MintMessage;
}

export interface BlockDetailsInputType {
    [BlockDetailsTableInputType.slotNo]: string;
    [BlockDetailsTableInputType.blockNo]: string;
    [BlockDetailsTableInputType.time]: string;
    [BlockDetailsTableInputType.minerPool]: string;
    [BlockDetailsTableInputType.avg_tx_wait_time]: string;
    [BlockDetailsTableInputType.txHashes]: string[];
    [BlockDetailsTableInputType.headerHash]: string;
}

export default function BlockDetails(props: BlockType) {

    const [mintDetails, setMintDetails] = useState<Array<BlockDetailsInputType>>([]);

    useEffect(() => {
        if (!props.event) return;
        const mintObj: any = {
            [BlockDetailsTableInputType.slotNo]: props.event.slotNumber,
            [BlockDetailsTableInputType.blockNo]: "-",
            [BlockDetailsTableInputType.time]: "-",
            [BlockDetailsTableInputType.minerPool]: "-",
            [BlockDetailsTableInputType.avg_tx_wait_time]: "-",
            [BlockDetailsTableInputType.headerHash]: props.event.headerHash,
            [BlockDetailsTableInputType.txHashes]: props.event.txHashes,
        }
        setMintDetails([mintObj, ...mintDetails])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.event])

    return (
        <div className={'w-full h-full p-4 bg-white border-2 overflow-auto'}>
            <Heading title={'Block Details'}/>
            <TableLayout data={createLinkElementForBlockDetails(mintDetails)}/>
        </div>
    );
}
