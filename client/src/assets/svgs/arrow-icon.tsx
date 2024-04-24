import React from 'react';

export default function ArrowIcon({ className = '', stroke = '#E6E6E6', ...props }: { className?: string; stroke?: string; props?: any }) {
    return (
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" className={className} {...props}>
            <path d="M16.6666 10.5L3.33325 10.5M16.6666 10.5L11.6666 15.5M16.6666 10.5L11.6666 5.5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
