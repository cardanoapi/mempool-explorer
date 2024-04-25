'use client';

import Image from 'next/image';
import Link from 'next/link';

import ArrowIcon from '@app/assets/svgs/arrow-icon';

import GradientButton from '../Button/GradientButton';

export default function Banner({ scrollToCurrentEpochInfo }: { scrollToCurrentEpochInfo: () => void }) {
    const bannerContent = {
        title: 'Real-Time Transaction Status & Network Insights',
        description: 'Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more.',
        features: ['Instant Transaction Updates', 'Network Performance Insights', 'Network Health Metrics']
    };

    return (
        <div className="w-full min-h-calc-68 bg-[#0D0D0D] text-[#E6E6E6] flex flex-col md:flex-row justify-center items-center md:justify-between gap-10 md:gap-[176px] px-10 md:px-[104px]">
            <div className="flex flex-col w-full">
                <h1 className="text-4xl md:text-5xl mb-10 font-medium">{bannerContent.title}</h1>
                {bannerContent.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 pb-4">
                        <ArrowIcon />
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
