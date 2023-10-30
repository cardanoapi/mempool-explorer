'use client';

import Link from 'next/link';

import Button from '@app/atoms/Button';
import BrandIcon from '@app/atoms/Icon/Brand';
import WalletIcon from '@app/atoms/Icon/Wallet';
import SearchBar from '@app/components/navbar/search-bar';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between gap-2 h-22 px-10">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
                <BrandIcon />
                <p>Mempool</p>
            </Link>
            <div>
                <SearchBar />
            </div>
            <Button
                size="large"
                startIcon={<WalletIcon />}
                className="flex !gap-2 !rounded-[48px] !items-center !font-ibm !text-black !font-normal !text-sm !capitalize bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] hover:bg-gradient-to-br hover:from-[#CC3CFF] hover:to-[#BD00FF]"
                onClick={() => {}}
            >
                Connect Wallet
            </Button>
        </nav>
    );
}
