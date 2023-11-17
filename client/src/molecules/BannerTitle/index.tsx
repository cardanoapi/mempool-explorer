import React from 'react';

import Breadcrumbs from '@app/atoms/Breadcrumbs';
import GradientBanner from '@app/atoms/GradientBanner';

interface IBannerTitleProps {
    Icon: any;
    breadCrumbText: string;
    title: string;
    children: React.ReactNode | React.ReactNode[];
    className?: string;
    bannerClassName?: string;
}

export default function BannerTitle({ Icon, breadCrumbText, title, children, className = '', bannerClassName = '' }: IBannerTitleProps) {
    return (
        <GradientBanner>
            <div className={`px-4 py-6 md:px-10 md:py-10 ${bannerClassName}`}>
                <Breadcrumbs text={breadCrumbText} />
                <div className="mt-6 mb-4 h-9 w-9 rounded bg-gradient-to-r from-[#FF9141] to-[#FFC296] flex items-center justify-center">
                    <Icon />
                </div>
                <p className="text-xl md:text-2xl font-medium">{title}</p>
            </div>
            <div className={className}>{children}</div>
        </GradientBanner>
    );
}
