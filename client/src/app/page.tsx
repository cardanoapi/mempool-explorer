import CurrentEpochInfo from '@app/molecules/DashboardCurrentEpochInfo';
import MempoolInfo from '@app/molecules/DashboardMempooIInfo';
import StakePoolsInfo from '@app/organisms/PoolDistributionGroup';

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <CurrentEpochInfo />
            <MempoolInfo />
            <StakePoolsInfo />
        </main>
    );
}