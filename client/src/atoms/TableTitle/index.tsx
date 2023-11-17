interface ITableTitleProps {
    readonly title: string;
    readonly className?: string;
}

export default function TableTitle({ title, className = '' }: ITableTitleProps) {
    return <p className={`sticky top-0 w-full backdrop-blur-3xl px-4 pt-4 md:px-10 md:pt-12 md:pb-[60px] text-xl md:text-2xl font-medium ${className}`}>{title}</p>;
}
