interface ITableHeaderProps {
    columns: Array<string>;
    thClassName?: string;
}

export default function TableHeader({ columns, thClassName = '' }: ITableHeaderProps) {
    return (
        <thead className="!text-[#B9B9B9] !text-xs md:!text-sm !font-normal">
            <tr className="border-b-[1px] border-b-[#303030]">
                {columns.map((column, index) => (
                    <th key={index} className={`py-5 px-4 md:px-10 text-start ${thClassName}`}>
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}
