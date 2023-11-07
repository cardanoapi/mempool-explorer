import Link from 'next/link';

import GradientTypography from '@app/atoms/GradientTypography';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import { toMidDottedStr } from '@app/utils/string-utils';

interface IMempoolTransactionListProps {
    tableTitle?: string;
    data: {
        'Transaction hash': string | JSX.Element;
        Inputs: JSX.Element | string[];
        Outputs: JSX.Element | string[];
        'Received Time': string;
    }[];
    className?: string;
}

export default function MempoolTransactionList({ tableTitle, data, className = '' }: IMempoolTransactionListProps) {
    const isMobile = useIsMobile();

    const tableColumns = ['Hash', 'Inputs', 'Outputs', 'Received Time'];

    return (
        <div className={`w-full md:border-r-[1px] md:border-r-[#B9B9B9] overflow-auto ${className}`}>
            {tableTitle && <TableTitle title={tableTitle} />}
            <table className="table-auto w-full">
                <TableHeader columns={tableColumns} />

                <tbody className="!text-xs md:!text-sm !font-normal">
                    {!data.length && <TableEmptyElement />}
                    {!!data?.length &&
                        data.map((row, index) => (
                            <tr key={index} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                {Object.values(row).map((d, idx) => {
                                    let item: any = d;
                                    let content;
                                    if (typeof item === 'object' && item?.type !== 'div') {
                                        content = (
                                            <GradientTypography>
                                                <Link href={item?.props?.href}>{toMidDottedStr(item?.key, isMobile ? 3 : 5)}</Link>
                                            </GradientTypography>
                                        );
                                    } else if (typeof item === 'object' && item?.type === 'div' && Array.isArray(item?.props?.children?.props?.children) && item?.props?.children?.props?.children?.length > 0) {
                                        content = <GradientTypography>{item?.props?.children?.props?.children[0]?.length}</GradientTypography>;
                                    } else {
                                        content = toMidDottedStr(item, isMobile ? 3 : 5);
                                    }

                                    return (
                                        <td key={idx} className="py-5 px-4 md:px-10 text-start">
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
