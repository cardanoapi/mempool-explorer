'use client';

import PlayIcon from '@app/atoms/Icon/Play';
import TransactionsContainer from '@app/components/transactions';
import BannerTitle from '@app/molecules/BannerTitle';
import Navbar from '@app/molecules/Navbar';

export default function LiveMempool() {
    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <BannerTitle Icon={PlayIcon} breadCrumbText="Live Mempool" title="Live Mempool">
                <div className="h-[1px] bg-[#303030]" />
                <div className="flex justify-between items-center">
                    <div className="p-10 w-full flex flex-col justify-center border-r-[1px] border-r-[#303030]">
                        <p className="!text-[#B9B9B9] !text-base !font-medium">Remote Mempool Size</p>
                        <p className="text-white text-[40px] font-medium">10.52 Kb</p>
                    </div>
                    <div className="p-10 w-full flex flex-col justify-center border-r-[1px] border-r-[#303030]">
                        <p className="!text-[#B9B9B9] !text-base !font-medium">Tx Count</p>
                        <p className="text-white text-[40px] font-medium">18</p>
                    </div>
                    <div className="p-10 w-full flex flex-col justify-center">
                        <p className="!text-[#B9B9B9] !text-base !font-medium">Browser Tx Count</p>
                        <p className="text-white text-[40px] font-medium">21</p>
                    </div>
                </div>
            </BannerTitle>
            <TransactionsContainer />
        </main>
    );
}
