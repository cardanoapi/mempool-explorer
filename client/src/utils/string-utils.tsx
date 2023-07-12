export const toMidDottedStr = (str: string, leadingVisible = 12, firstIndex = 0) => {
    if (str === undefined || str.length < 12) return str;
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};

export const Heading = (props: any) => {
    return (
        <div className={'flex justify-between items-center'} style={{justifyContent: 'space-between'}}>
            <h1 className={'font-semibold text-lg mb-2'}>{props.title}</h1>
            {props.children}
        </div>
    );
};
