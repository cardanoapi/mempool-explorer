'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import cn from 'classnames';

import ArrowIcon from '@app/assets/svgs/arrow-icon';

import GradientButton from '../Button/GradientButton';

export default function Banner({ scrollToCurrentEpochInfo }: { scrollToCurrentEpochInfo: () => void }) {
    enum TABS {
        ADA_HOLDERS = 'ADA Holders',
        STAKE_POOL_OPERATORS = 'Stake Pool Operators'
    }

    const [activeTab, setActiveTab] = useState(TABS.ADA_HOLDERS);

    const bannerContent = {
        title: 'Cardano Mempool Explorer',
        subtitle: 'Real-Time Transaction Status & Network Insights',
        description: 'Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more.',
        features: {
            [TABS.ADA_HOLDERS]: [
                'Watch your transactions confirm in real-time in the Cardano Mempool.',
                'Are you concerned about delays? Compare your transaction time to the average.',
                "Do you feel like you're being overlooked or unfairly treated?",
                'Explore further by searching your transaction hash on the search bar to unveil crucial insights.'
            ],
            [TABS.STAKE_POOL_OPERATORS]: [
                'Is your stake pool fairly selecting transactions?',
                'Curious about your global ranking?',
                'Discover the total waiting time of the transactions your pool has processed by looking at how long they waited in the Mempool. The more hours you save, the higher your ranking.',
                'Dive deeper into these metrics by searching your Pool Hash on the search bar to unveil comprehensive insights.'
            ]
        }
    };

    const handleTabChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const tab = event.currentTarget.innerText as TABS;
        setActiveTab(tab);
    };

    return (
        <div
            style={{ background: "url('/banner-bg.png')", backgroundSize: 'cover' }}
            className="w-full min-h-calc-68 bg-[#0D0D0D] text-[#E6E6E6] flex flex-col md:flex-row justify-center items-center md:justify-between gap-10 md:gap-[176px] px-10 md:px-[104px] py-10"
        >
            <div className="flex flex-col w-full">
                <h1 className="text-4xl md:text-5xl mb-10 font-medium">{bannerContent.title}</h1>
                <h2 className="text-xl md:text-2xl mb-10 font-medium">{bannerContent.subtitle}</h2>
                {/* Tabs */}
                <div className="flex gap-4 mb-8 rounded-full overflow-hidden bg-slate-700 w-full">
                    <button onClick={handleTabChange} className={cn(`px-5 py-2 text-lg font-medium w-1/2`, activeTab === TABS.ADA_HOLDERS ? 'text-[#E6E6E6] bg-orange-700' : 'text-[#7C7C7C]')}>
                        {TABS.ADA_HOLDERS}
                    </button>
                    <button onClick={handleTabChange} className={`px-5 py-2 text-lg font-medium w-1/2 ${activeTab === TABS.STAKE_POOL_OPERATORS ? 'text-[#E6E6E6] bg-orange-700' : 'text-[#7C7C7C]'}`}>
                        {TABS.STAKE_POOL_OPERATORS}
                    </button>
                </div>
                {bannerContent.features[activeTab].map((feature, index) => (
                    <div key={index} className="flex gap-2 pb-4">
                        <div className="!w-5 !h-5">
                            <ArrowIcon />
                        </div>
                        <p>{feature}</p>
                    </div>
                ))}
                <p className="mt-[88px] text-lg font-medium mb-12">{bannerContent.description}</p>
                <div className="flex gap-4">
                    <GradientButton size="large" startIcon={<ArrowIcon stroke="#0D0D0D" className="transform rotate-90" />} onClick={scrollToCurrentEpochInfo} fullWidth={false} className="w-fit">
                        <span>Explore</span>
                    </GradientButton>
                    <Link href="/mempool">
                        <GradientButton size="large" fullWidth={false} onClick={() => {}}>
                            Show Live Data
                        </GradientButton>
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <div style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <Image src="/banner-transaction.png" width={557} height={243} alt="Cardano Mempool Explorer" />
                </div>
            </div>
        </div>
    );
}
