import React from 'react';

interface IGradientTypographyProps {
    Tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    children?: React.ReactNode;
    className?: string;
}

export default function GradientTypography({ Tag = 'p', className = '', children }: IGradientTypographyProps) {
    return <Tag className={`bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium ${className}`}>{children}</Tag>;
}
