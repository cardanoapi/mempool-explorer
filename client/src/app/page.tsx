import CurrentEpochInfo from '@app/molecules/DashboardCurrentEpochInfo';
import MempoolInfo from '@app/molecules/DashboardMempooIInfo';
import ContributersInfo from '@app/organisms/ContributersInfo';
import StakePoolsInfo from '@app/organisms/PoolDistributionGroup';
import { GetServerSideProps } from 'next';

export const getContributorsData = async () => {
    const res = await fetch(`${process.env.CONTRIBUTERS_JSON_URL}`)
    return await res.json()
}

export default async function Home() {

    const contributorsData = await getContributorsData();

    return (
        <main className="w-full min-h-screen">
            <CurrentEpochInfo />
            <MempoolInfo />
            <StakePoolsInfo />
            <ContributersInfo contributorsData={contributorsData} />
        </main>
    );
}