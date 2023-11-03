import { Navbar } from '@app/components/navbar';
import TransactionsContainer from '@app/components/transactions';
import environments from '@app/configs/environments';

export default function Home() {
    return (
        <main className={'flex flex-1 flex-col bg-[#f2f2f2] !text-black min-h-screen max-h-screen'}>
            <Navbar />
            <TransactionsContainer />
        </main>
    );
}
