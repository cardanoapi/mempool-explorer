import Link from 'next/link';

import GradientTypography from '@app/atoms/GradientTypography';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { MempoolEventType } from '@app/constants/constants';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import { AddRejectTxClientSideType, RemoveMintedTransactions, RemoveTxClientSideType } from '@app/types/clientside/dashboard';
import { parseDateStrToDate, toHourMinStr, toMonthDateYearStr } from '@app/utils/date-utils';
import { toMidDottedStr } from '@app/utils/string-utils';

interface ILiveMempoolListProps {
    tableTitle?: string;
    eventLogList: Array<AddRejectTxClientSideType | RemoveTxClientSideType | RemoveMintedTransactions | undefined>;
    className?: string;
}

export default function LiveMempoolList({ tableTitle, eventLogList, className = '' }: ILiveMempoolListProps) {
    const isMobile = useIsMobile();

    const tableColumns = ['Hash', 'Status'];

    return (
        <div className={`w-full md:border-r-[1px] md:border-r-[#B9B9B9] xl:scrollable-table overflow-auto ${className}`}>
            {tableTitle && <TableTitle title={tableTitle} />}
            <table className="table-auto w-full">
                <TableHeader columns={tableColumns} />

                <tbody className="!text-xs md:!text-sm !font-normal">
                    {!eventLogList?.length && <TableEmptyElement />}
                    {!!eventLogList?.length &&
                        eventLogList.map((event, index) => {
                            const action = event?.action === MempoolEventType.Add ? 'Added to Mempool' : 'Removed';
                            const actionColor = event?.action === MempoolEventType.Add ? 'added' : 'removed';

                            if (event?.action === MempoolEventType.Add || event?.action === MempoolEventType.Reject) {
                                const addRejectEvent = event as AddRejectTxClientSideType;
                                const arrivalTime: string = addRejectEvent?.arrivalTime ? `${toMonthDateYearStr(parseDateStrToDate(addRejectEvent.arrivalTime))} ${toHourMinStr(parseDateStrToDate(addRejectEvent.arrivalTime))}` : 'N/A';
                                return (
                                    <tr key={index} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                        <td className="py-5 px-4 md:px-10 text-start">
                                            <GradientTypography>
                                                <Link href={`/transactions/${addRejectEvent.hash}`} prefetch={false}>{toMidDottedStr(addRejectEvent.hash, isMobile ? 3 : 5)}</Link>
                                            </GradientTypography>
                                            <span className="text-white">{arrivalTime}</span>
                                        </td>
                                        <td className="py-5 px-4 md:px-10 text-start">
                                            <span className={actionColor}>{action}</span>
                                        </td>
                                    </tr>
                                );
                            } else if (event?.action === MempoolEventType.Remove) {
                                const removeEvent = event as RemoveTxClientSideType;
                                return (
                                    <tr key={index} className="border-b-[1px] border-b-[#666666] hover:bg-[#292929]">
                                        <td className="py-5 px-4 md:px-10 text-start">
                                            {removeEvent.txHashes.map((e, index) => (
                                                <GradientTypography key={index}>
                                                    <Link href={`/transactions/${e}`} prefetch={false}>{toMidDottedStr(e, 5)}</Link>
                                                </GradientTypography>
                                            ))}
                                        </td>
                                        <td className="py-5 px-4 md:px-10 text-start">
                                            <span className={`text-[${actionColor}]`}>{action}</span>
                                        </td>
                                    </tr>
                                );
                            }
                            return <TableEmptyElement key={index} />;
                        })}
                </tbody>
            </table>
        </div>
    );
}
