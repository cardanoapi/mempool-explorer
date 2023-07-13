import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';


export default function TableLayout(props: any) {
    const {data} = props;

    if (!!data && data.length === 0) return <EmptyPageIcon/>;

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
                {data?.map((row: Array<any>, idx:number) => {
                    return (
                        <tr key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-700">
                            {Object.values(row).map((d: any, index) => (
                                <td key={d.toString()}>{d}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
