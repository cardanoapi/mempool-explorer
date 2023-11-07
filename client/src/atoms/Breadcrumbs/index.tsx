'use client';

import Link from 'next/link';

import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

interface IBreadcrumbsProps {
    text: string;
}

export default function Breadcrumbs({ text }: IBreadcrumbsProps) {
    return (
        <MuiBreadcrumbs separator="•" aria-label="breadcrumb" className="!text-[#B9B9B9] !text-xs md:!text-sm !font-normal">
            <Link href="/" className="!cursor-pointer hover:!text-white">
                Dashboard
            </Link>
            <p className="!text-white">{text}</p>
        </MuiBreadcrumbs>
    );
}
