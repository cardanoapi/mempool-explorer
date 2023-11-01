'use client';

import PlayIcon from '@app/atoms/Icon/Play';
import TransactionsContainer from '@app/components/transactions';
import BannerStatCard from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import Navbar from '@app/molecules/Navbar';

export default function LiveMempool() {
    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <BannerTitle Icon={PlayIcon} breadCrumbText="Live Mempool" title="Live Mempool">
                <div className="mt-10 h-[1px] bg-[#303030]" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <BannerStatCard title="Remote Mempool Size" value="10.52 Kb" />
                    <BannerStatCard title="Tx Count" value="18" />
                    <BannerStatCard title="Browser Tx Count" value="21" />
                </div>
            </BannerTitle>
            <TransactionsContainer />
        </main>
    );
}
