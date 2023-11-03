interface ITableTitleProps {
    title: string;
}

export default function TableTitle({ title }: ITableTitleProps) {
    return <p className="px-4 pt-4 md:px-10 md:pt-12 md:pb-[60px] text-xl md:text-2xl font-medium">{title}</p>;
}
