'use client';

import Link from 'next/link';

import GradientButton from '@app/atoms/Button/GradientButton';
import BrandIcon from '@app/atoms/Icon/Brand';
import WalletIcon from '@app/atoms/Icon/Wallet';
import SearchBar from '@app/components/navbar/search-bar';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between gap-2 h-22 px-10">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-white">
                <BrandIcon />
                <p>Mempool</p>
            </Link>
            <div>
                <SearchBar />
            </div>
            <GradientButton size="large" startIcon={<WalletIcon />} onClick={() => {}}>
                Connect Wallet
            </GradientButton>
        </nav>
    );
}
