import DashboardBanner from '@app/molecules/DashboardBanner';
import DashboardMempoolBanner from '@app/molecules/DashboardMempoolBanner';
import PoolDistributionGroup from '@app/organisms/PoolDistributionGroup';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <DashboardBanner />
            <DashboardMempoolBanner />
            <PoolDistributionGroup />
        </main>
    );
}