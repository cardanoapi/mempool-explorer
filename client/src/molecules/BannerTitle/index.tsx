import React from 'react';

import Breadcrumbs from '@app/atoms/Breadcrumbs';
import GradientBanner from '@app/atoms/GradientBanner';

interface IBannerTitleProps {
    Icon: any;
    breadCrumbText: string;
    title: string;
    children: React.ReactNode | React.ReactNode[];
    className?: string;
}

export default function BannerTitle({ Icon, breadCrumbText, title, children, className = '' }: IBannerTitleProps) {
    return (
        <GradientBanner>
            <div className="p-10">
                <Breadcrumbs text={breadCrumbText} />
                <div className="mt-6 mb-4 h-9 w-9 rounded bg-gradient-to-r from-[#FF9141] to-[#FFC296] flex items-center justify-center">
                    <Icon />
                </div>
                <p className="text-2xl font-medium">{title}</p>
            </div>
            <div className={className}>{children}</div>
        </GradientBanner>
    );
}
