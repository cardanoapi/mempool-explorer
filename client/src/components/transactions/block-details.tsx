export default function BlockDetails(props: any) {
    return (
        <div className={"w-full h-full mb-4 p-4 bg-white border-2 "}>
            {props.children}
        </div>
    )
}