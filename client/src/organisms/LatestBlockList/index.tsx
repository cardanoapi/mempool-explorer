import { useEffect, useState } from 'react';

import GradientTypography from '@app/atoms/GradientTypography';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { BlockDetailsInputType } from '@app/components/transactions/block-details';
import { BlockDetailsTableInputType } from '@app/constants/constants';
import useScrollableTable from '@app/lib/hooks/useScrollableTable';
import { MintMessage } from '@app/lib/websocket';
import { toMidDottedStr } from '@app/utils/string-utils';

interface ILatestBlockListProps {
    readonly tableTitle?: string;
    readonly mintEvent?: MintMessage;
    readonly className?: string;
}

export default function LatestBlockList({ tableTitle, mintEvent, className = '' }: ILatestBlockListProps) {
    useScrollableTable();

    const [mintDetails, setMintDetails] = useState<Array<BlockDetailsInputType>>([]);

    const tableColumns = ['Slot No.', 'Block Hash', 'Block No.', 'Time', 'No. of Transactions', 'Miner', 'Avg Tx Wait Time'];

    useEffect(() => {
        if (!mintEvent) return;
        const mintObj: any = {
            [BlockDetailsTableInputType.slotNo]: mintEvent.slotNumber,
            [BlockDetailsTableInputType.headerHash]: mintEvent.headerHash,
            [BlockDetailsTableInputType.blockNo]: '-',
            [BlockDetailsTableInputType.time]: '-',
            [BlockDetailsTableInputType.txHashes]: mintEvent.txHashes,
            [BlockDetailsTableInputType.minerPool]: '-',
            [BlockDetailsTableInputType.avg_tx_wait_time]: '-'
        };
        setMintDetails([mintObj, ...mintDetails]);
    }, [mintEvent]);

    return (
        <div className={`w-full md:border-r-[1px] md:border-r-[#B9B9B9] xl:h-[50vh] xl:scrollable-table overflow-auto ${className}`}>
            {tableTitle && <TableTitle title={tableTitle} />}
            <table className="table-auto w-full">
                <TableHeader columns={tableColumns} />

                <tbody className="!text-xs md:!text-sm !font-medium">
                    {mintDetails.length ? (
                        mintDetails.map((row, idx) => (
                            <tr key={idx} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                {Object.keys(row).map((rowKey: string, index: number) => {
                                    let content = <span>{row[rowKey as keyof BlockDetailsInputType]}</span>;
                                    if (rowKey === BlockDetailsTableInputType.txHashes) {
                                        content = <GradientTypography>{row[rowKey].length}</GradientTypography>;
                                    } else if (rowKey === BlockDetailsTableInputType.headerHash) {
                                        // TODO: Add a link to navigate to block details page
                                        content = <GradientTypography>{toMidDottedStr(row[rowKey], 5)}</GradientTypography>;
                                    }
                                    return (
                                        <td key={index} className="py-5 px-4 md:px-10 text-start">
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <TableEmptyElement />
                    )}
                </tbody>
            </table>
        </div>
    );
}
