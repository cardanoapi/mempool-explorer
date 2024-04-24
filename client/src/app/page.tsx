'use client';

import React, { useRef } from 'react';

import Banner from '@app/atoms/Banner';
import CurrentEpochInfo from '@app/molecules/DashboardCurrentEpochInfo';
import MempoolInfo from '@app/molecules/DashboardMempooIInfo';
import ContributersInfo from '@app/organisms/ContributersInfo';
import StakePoolsInfo from '@app/organisms/PoolDistributionGroup';

export default async function Home() {
    const currentEpochInfoRef = useRef<HTMLDivElement>(null);

    const scrollToCurrentEpochInfo = () => {
        if (currentEpochInfoRef.current) {
            currentEpochInfoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getContributorsData = async () => {
        const res = await fetch(`${process.env.CONTRIBUTERS_JSON_URL}`);
        return await res.json();
    };

    const contributorsData = process.env.CONTRIBUTERS_JSON_URL ? await getContributorsData() : [];

    return (
        <main className="w-full min-h-screen">
            <Banner scrollToCurrentEpochInfo={scrollToCurrentEpochInfo} />
            <CurrentEpochInfo ref={currentEpochInfoRef} />
            <MempoolInfo />
            <StakePoolsInfo />
            {contributorsData && contributorsData.length > 0 && <ContributersInfo contributorsData={contributorsData} />}
        </main>
    );
}
