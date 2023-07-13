import { toMidDottedStr } from '@app/utils/string-utils';

export default function TransactionInputOutput(props: any) {
    const txInputOutputs:any= []

    function Layout(props: any) {
        return <div className={'border-solid bg-white border-[1px] border-[#bfbfbf] p-4 rounded-md'}>{props.children}</div>;
    }

    function Outputs() {
        return (
            <>
                <h1 className={'font-semibold'}>Outputs</h1>
                <div className={'flex flex-col'}>
                    {txInputOutputs?.outputs?.map((tx: any, idx: number) => (
                        <div key={tx.address} className={'flex mb-4 items-center'}>
                            <p className={'font-semibold mr-2'}>{idx}.</p>
                            <div className={'flex flex-col text-sm'}>
                                <p className={'text-blue-500'}>{toMidDottedStr("dwknowfknoiwfnfwonwfeoifew")}</p>
                                <div className={'flex justify-between items-center'}>
                                    <p className={'font-semibold'}>{tx.amount}</p>
                                    <p className={'p-1 text-xs border-solid border-[1px] bg-amber-50 border-amber-400 rounded-lg'}>a2vv.dene</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    function Inputs() {
        return (
            <div className={'mr-40'}>
                <h1 className={'font-semibold mb-2'}>Inputs</h1>
                {txInputOutputs?.inputs?.map((tx: any, idx: number) => (
                    <div key={tx.address} className={'flex mb-4 items-center'}>
                        <p className={'font-semibold mr-2'}>{idx + 1}.</p>
                        <div className={'flex flex-col text-sm'}>
                            <p className={'text-blue-500'}>{toMidDottedStr(tx.address)}</p>
                            {/*<p className={"font-bold"}>46.884724</p>*/}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Layout>
            <div className={'flex flex-col'}>
                <h1 className={'font-semibold text-2xl mb-2'}>Cardano Transaction</h1>
                <p className={'mr-1 font-semibold'}>Hash ID </p>
                <p className={'text-gray-500 font-xs'}>5425783c08f95d16995676eeb4bc5c029add137f403936eaec72d0caa4080471</p>
            </div>

            <div className={'flex justify-between items-start'}>
                <Inputs />
                <Outputs />
            </div>
        </Layout>
    );
}
