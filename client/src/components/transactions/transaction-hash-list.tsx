import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import Layout from '@app/shared/layout';
import { SocketEventResponseType } from '@app/types/transaction-details-response/socket-response-type';
import { Heading, toMidDottedStr } from '@app/utils/string-utils';

interface PropType {
    transactions: Array<SocketEventResponseType>;
}

export default function TransactionEventList(props: PropType) {
    const transactionHashes = props.transactions;

    function renderBatchPill(action: string) {
        const batchPillBaseStyle = 'text-xs rounded-md p-1 border-solid border-[1px]';
        switch (action) {
            case 'add':
                return <div className={`${batchPillBaseStyle} bg-green-100 border-green-400`}>{action}</div>;
            case 'remove':
                return <div className={` ${batchPillBaseStyle} bg-red-100 border-red-400 `}>{action}</div>;
            case 'reject':
                return <div className={` ${batchPillBaseStyle} bg-yellow-100 border-yellow-400`}>{action}</div>;
        }
    }

    function TransactionItems(props: any) {
        const transaction = props.transaction;
        return (
            <Layout>
                <div className={'flex gap-4 justify-between items-center'}>
                    <>{renderBatchPill(transaction.action)}</>
                    <div className={'flex flex-col'}>
                        <p className="text-sm">
                            Hash <span className="text-md text-blue-500">{toMidDottedStr(transaction.hash, 4)}</span>
                        </p>
                        <p className="text-sm text-gray-400">{new Date(1689128824593).toISOString()}</p>
                    </div>
                    <div className={'flex flex-col'}>
                        <p className="font-bold">{transaction.amount} ADA</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <div className="calc-h-68 bg-white border-[2px] !min-w-[400px] p-2 border-solid ">
            <Heading title={'Transaction Events'} />
            {!!transactionHashes && transactionHashes.length ? (
                <div className="overflow-y-auto">
                    {transactionHashes.map((tx, index) => (
                        <div key={index} className={'mx-1 py-2 cursor-pointer block-list'}>
                            <TransactionItems transaction={tx} />
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyPageIcon />
            )}
        </div>
    );
}
