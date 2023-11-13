import DashboardBanner from '@app/molecules/DashboardBanner';
import DashboardMempoolBanner from '@app/molecules/DashboardMempoolBanner';
import DashboardStakePoolsBanner from '@app/molecules/DashboardStakePoolsBanner';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <DashboardBanner />
            <DashboardMempoolBanner />
            <DashboardBanner />
            <DashboardStakePoolsBanner />
        </main>
    );
}
