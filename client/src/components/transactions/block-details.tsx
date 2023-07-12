import TableLayout from '@app/shared/table-layout';
import {Heading} from '@app/utils/string-utils';

export default function BlockDetails() {
    const transactionData = [
        {
            block: '89650',
            'epoch/slot': '420/359124',
            Transactions: '12',
            Timestamp: '2022/12/30',
            Stake_pool: 'pool1tay8z4sq4a4gmyhnygyt0t5j84z8epwjra06wq28jnnmschkkuu',
            Output: 1200
        },
        {
            block: '89649',
            'epoch/slot': '420/359124',
            Transactions: '12',
            Timestamp: '2022/12/30',
            Stake_pool: 'pool1tay8z4sq4a4gmyhnygyt0t5j84z8epwjra06wq28jnnmschkkuu',
            Output: 200
        },
        {
            block: '89648',
            'epoch/slot': '420/359124',
            Transactions: '12',
            Timestamp: '2022/12/30',
            Stake_pool: 'pool1tay8z4sq4a4gmyhnygyt0t5j84z8epwjra06wq28jnnmschkkuu',
            Output: 100
        },
        {
            block: '89650',
            'epoch/slot': '420/359124',
            Transactions: '12',
            Timestamp: '2022/12/30',
            Stake_pool: 'pool1tay8z4sq4a4gmyhnygyt0t5j84z8epwjra06wq28jnnmschkkuu',
            Output: 20
        }
    ];

    return (
        <div className={'h-full mb-1 p-4 bg-white border-2 '}>
            <Heading title={'Block Details'} />
            <TableLayout data={transactionData} />
        </div>
    );
}
