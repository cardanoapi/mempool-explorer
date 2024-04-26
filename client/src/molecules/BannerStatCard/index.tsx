import React from 'react';

interface IBannerStatCardProps {
    readonly title: string;
    readonly value: string | number;
    readonly isLoading?: boolean;
    readonly valueClassName?: string;
}

export default function BannerStatCard({ title, value, isLoading = false, valueClassName = '' }: IBannerStatCardProps) {
    return (
        <div className="p-4 md:p-10 w-full h-full flex flex-col gap-2 justify-start items-start border-b-[1px] border-t-[1px] border-t-[#303030] border-b-[#303030] border-r-none md:border-b-0 md:border-r-[1px] md:border-r-[#303030]">
            <p className="!text-[#B9B9B9] text-sm md:!text-base !font-medium">{title}</p>
            <p className={`text-white text-base md:text-[40px] md:leading-[52px] font-medium ${valueClassName} ${isLoading ? 'animate-pulse bg-black w-full h-10 mt-2' : ''}`}>{isLoading ? '' : value}</p>
        </div>
    );
}

export function ConfirmBannerStatCard({ title, value, valueClassName = '' }: IBannerStatCardProps) {
    return (
        <div className="p-4 md:p-10 w-full h-full flex flex-col gap-2 justify-start items-start">
            <p className="!text-[#4A4A4A] text-sm md:!text-base !font-medium">{title}</p>
            <p className={`text-black text-base md:text-[40px] md:leading-[52px] font-medium ${valueClassName}`}>{value}</p>
        </div>
    );
}
