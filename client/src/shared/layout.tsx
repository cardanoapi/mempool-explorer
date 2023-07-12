export default function Layout(props: any) {
    const {className, ...otherProps} = props;
    return (
        <div {...otherProps}
             className={'border-solid bg-white border-[1px] border-[#cecece] p-4 rounded-md ' + (className || '')}>
            {props.children}
        </div>
    );
}
