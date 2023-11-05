import DashboardBanner from '@app/molecules/DashboardBanner';
import DashboardMempoolBanner from '@app/molecules/DashboardMempoolBanner';
import Navbar from '@app/molecules/Navbar';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <DashboardBanner />
            <DashboardMempoolBanner />
        </main>
    );
}
