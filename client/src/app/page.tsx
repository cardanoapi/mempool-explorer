import React, { useEffect } from 'react';

import CurrentEpochInfo from '@app/molecules/DashboardCurrentEpochInfo';
import MempoolInfo from '@app/molecules/DashboardMempooIInfo';
import ContributersInfo from '@app/organisms/ContributersInfo';
import StakePoolsInfo from '@app/organisms/PoolDistributionGroup';

export default async function Home() {
    const getContributorsData = async () => {
        const res = await fetch(`${process.env.CONTRIBUTERS_JSON_URL}`);
        return await res.json();
    };

    const contributorsData = process.env.CONTRIBUTERS_JSON_URL ? await getContributorsData() : [];

    return (
        <main className="w-full min-h-screen">
            <CurrentEpochInfo />
            <MempoolInfo />
            <StakePoolsInfo />
            <ContributersInfo contributorsData={contributorsData} />
        </main>
    );
}
