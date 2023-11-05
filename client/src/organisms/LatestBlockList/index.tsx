import { useEffect, useState } from 'react';

import Link from 'next/link';

import _ from 'lodash';

import GradientTypography from '@app/atoms/GradientTypography';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { BlockDetailsInputType } from '@app/components/transactions/block-details';
import { BlockDetailsTableInputType } from '@app/constants/constants';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import { MintMessage } from '@app/lib/websocket';
import { toMidDottedStr } from '@app/utils/string-utils';

interface ILatestBlockListProps {
    readonly tableTitle?: string;
    readonly mintEvent?: MintMessage;
    readonly className?: string;
}

export default function LatestBlockList({ tableTitle, mintEvent, className = '' }: ILatestBlockListProps) {
    const isMobile = useIsMobile();

    const [mintDetails, setMintDetails] = useState<Array<BlockDetailsInputType>>([]);

    const tableColumns = ['Height', 'Block Hash', 'Minted On', 'No. of Transactions', 'Miner', 'Avg Tx Wait Time'];

    useEffect(() => {
        if (!mintEvent) return;
        const mintObj: any = {
            [BlockDetailsTableInputType.slotNo]: mintEvent.slotNumber,
            [BlockDetailsTableInputType.blockNo]: '-',
            [BlockDetailsTableInputType.time]: '-',
            [BlockDetailsTableInputType.minerPool]: '-',
            [BlockDetailsTableInputType.avg_tx_wait_time]: '-',
            [BlockDetailsTableInputType.headerHash]: mintEvent.headerHash,
            [BlockDetailsTableInputType.txHashes]: mintEvent.txHashes
        };
        setMintDetails([mintObj, ...mintDetails]);
    }, [mintEvent]);

    return (
        <div className={`w-full md:border-r-[1px] md:border-r-[#B9B9B9] overflow-auto ${className}`}>
            {tableTitle && <TableTitle title={tableTitle} />}
            <table className="table-auto w-full">
                <TableHeader columns={tableColumns} />

                <tbody className="!text-xs md:!text-sm !font-medium">
                    {_.range(0, 10).map((_) => (
                        <tr key={_} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                            <td className="py-5 px-4 md:px-10 text-start">
                                <span>4,213</span>
                            </td>
                            <td className="py-5 px-4 md:px-10 text-start">
                                <GradientTypography>
                                    <Link href={'/'}>{toMidDottedStr('0aef12bc1def4599aed', 5)}</Link>
                                </GradientTypography>
                            </td>
                            <td className="py-5 px-4 md:px-10 text-start">
                                <span>08:03:03 AM</span>
                            </td>
                            <td className="py-5 px-4 md:px-10 text-start">
                                <GradientTypography>
                                    <Link href={'/'}>3</Link>
                                </GradientTypography>
                            </td>
                            <td className="py-5 px-4 md:px-10 text-start">
                                <GradientTypography>
                                    <Link href={'/'}>{toMidDottedStr('0aef12bc1def4599aed', 5)}</Link>
                                </GradientTypography>
                            </td>
                            <td className="py-5 px-4 md:px-10 text-start">
                                <span>5.00 sec</span>
                            </td>
                        </tr>
                        // <TableEmptyElement />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
