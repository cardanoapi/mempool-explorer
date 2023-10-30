import { Navbar } from '@app/components/navbar';
import TransactionsContainer from '@app/components/transactions';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <TransactionsContainer />
        </main>
    );
}
