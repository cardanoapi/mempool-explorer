'use client';

import React, { useEffect, useRef, useState } from 'react';

import Banner from '@app/atoms/Banner';
import CurrentEpochInfo from '@app/molecules/DashboardCurrentEpochInfo';
import MempoolInfo from '@app/molecules/DashboardMempooIInfo';
import ContributersInfo from '@app/organisms/ContributersInfo';
import StakePoolsInfo from '@app/organisms/PoolDistributionGroup';

export default function DashboardPage() {
    const currentEpochInfoRef = useRef<HTMLDivElement>(null);
    const [contributorsData, setContributorsData] = useState<any[]>([]);

    const scrollToCurrentEpochInfo = () => {
        if (currentEpochInfoRef.current) {
            currentEpochInfoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchContributorsData = async () => {
            try {
                const url = process.env.CONTRIBUTERS_JSON_URL ?? 'mempool-contributors.json';

                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error('Failed to fetch contributors data');
                }

                const data = await res.json();
                if (!data || !Array.isArray(data)) {
                    throw new Error('Invalid contributors data');
                }
                setContributorsData(data);
            } catch (error) {
                console.error('Error fetching contributors data:', error);
                setContributorsData([]);
            }
        };

        fetchContributorsData();
    }, []);

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
