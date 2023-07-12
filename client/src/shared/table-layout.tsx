import { useRouter } from 'next/navigation';

import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import { toMidDottedStr } from '@app/utils/string-utils';

enum LinkEnum {
    PoolID = 'pool_id',
    TransactionHash = 'transaction_hash',
    Address = 'Address'
}

export default function TableLayout(props: any) {
    const { data } = props;

    const router = useRouter();

    if (!!data && data.length === 0) return <EmptyPageIcon />;

    const createHTMLNodeElementsFromText = (element: string) => {
        if (!element.length) return element;
        if (element.startsWith('pool') || element.startsWith('addr')) {
            return (
                <div key={element} className="flex flex-col text-blue-500 mb-2 cursor-pointer" onClick={() => router.push(`/${element}`)}>
                    {toMidDottedStr(element.toString())}
                </div>
            );
        } else {
            return <>{element.toString()}</>;
        }
    };

    function checkIfElementIsAnArray(data: string | Array<string>) {
        return Array.isArray(data);
    }

    function renderArrayElements(data: Array<string>) {
        return <>{data.map((d) => createHTMLNodeElementsFromText(d))}</>;
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-gray-500 dark:text-gray-400">
                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {!!data &&
                            Object.keys(data[0]).map((r: string) => (
                                <th key={r} scope="col" className="py-3">
                                    {r}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row: Array<any>) => {
                        return (
                            <tr key={row.toString()} className="bg-white dark:bg-gray-900 dark:border-gray-700">
                                {Object.values(row).map((d: any, index) => (
                                    <td key={d.toString()}>{checkIfElementIsAnArray(d) ? renderArrayElements(d) : createHTMLNodeElementsFromText(d)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
