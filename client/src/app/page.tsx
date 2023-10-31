import GradientTypography from '@app/atoms/GradientTypography';
import TransactionsContainer from '@app/components/transactions';
import Navbar from '@app/molecules/Navbar';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <GradientTypography className="!text-3xl">Dashboard</GradientTypography>
        </main>
    );
}
