import React from 'react';

interface IBannerStatCardProps {
    title: string;
    value: string | number;
}

export default function BannerStatCard({ title, value }: IBannerStatCardProps) {
    return (
        <div className="p-4 md:p-10 w-full flex flex-col gap-2 justify-center border-b-[1px] border-b-[#303030] border-r-none md:border-b-0 md:border-r-[1px] md:border-r-[#303030]">
            <p className="!text-[#B9B9B9] text-sm md:!text-base !font-medium">{title}</p>
            <p className="text-white text-base md:text-[40px] font-medium">{value}</p>
        </div>
    );
}
