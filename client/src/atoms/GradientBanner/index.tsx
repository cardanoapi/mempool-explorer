'use client';

import React from 'react';

interface IGradientBannerProps {
    minHeight?: string;
    className?: string;
    children: React.ReactNode;
}

export default function GradientBanner({ children, minHeight = '366px', className = '' }: IGradientBannerProps) {
    return (
        <div className={`min-h-[${minHeight}] relative`}>
            <div className={`${className}`}>{children}</div>
            <div className="absolute overflow-hidden inset-0 -z-10">
                <div className="absolute top-[-9px] left-[269px] w-[350px] min-h-[366px] bg-gradient-to-r from-[#5F0080] via-[#9700CC] to-[#BD00FF] rotate-90 blur-color" />
                <div className="absolute top-[313px] right-[269px] w-[436px] min-h-[566px] bg-gradient-to-r from-[#0085FF] via-[#004380] to-[#001B33] blur-color opacity-90" />
            </div>
        </div>
    );
}
