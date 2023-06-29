export const toMidDottedStr = (str: string | number, leadingVisible = 12, firstIndex = 0) => {
    if (str === undefined) return str;
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};


export const Heading = ({title}:any) => {
    return <h1 className={"font-bold mb-2 px-2 text-lg"}>{title}</h1>
}
