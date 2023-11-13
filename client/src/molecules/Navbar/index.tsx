'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Box, InputAdornment, TextField } from '@mui/material';

import GradientButton from '@app/atoms/Button/GradientButton';
import BrandIcon from '@app/atoms/Icon/Brand';
import SearchIcon from '@app/atoms/Icon/Search';
import WalletIcon from '@app/atoms/Icon/Wallet';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';

export default function Navbar() {
    const router = useRouter();
    const isMobile = useIsMobile();

    return (
        <nav className="flex items-center z-10 bg-[#0D0D0D] !backdrop-blur-3xl justify-between gap-2 h-[68px] px-4 md:h-22 md:px-10 border-b-[1px] border-[#4A4A4A]">
            <Link href="/" tabIndex={-1} className="flex items-center gap-2 font-semibold text-xl text-white">
                <BrandIcon />
                <p className="hidden md:block">Mempool</p>
            </Link>
            <Box sx={{ flexGrow: 1 }}>
                <TextField
                    placeholder="Search Tx, Address, Pools"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            height: '48px',
                            background: '#292929',
                            borderWidth: '1px',
                            borderColor: 'transparent',
                            borderRadius: '48px',
                            maxWidth: '438px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#E6E6E6',
                            paddingX: '16px',
                            paddingY: '12px',
                            fontFamily: 'IBM Plex Mono',
                            fontWeight: 500,
                            fontSize: '14px',
                            caretColor: '#E6E6E6',
                            '&:focus-within fieldset, &:focus-visible fieldset': {
                                border: '1px solid #E6E6E6 !important'
                            }
                        }
                    }}
                    fullWidth
                    className="flex items-center !font-ibm !text-sm md:text-base"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !!(e.target as HTMLInputElement).value) {
                            if ((e.target as HTMLInputElement).value.startsWith('addr')) {
                                router.push(`/${(e.target as HTMLInputElement).value}`);
                            } else if ((e.target as HTMLInputElement).value.startsWith('pool')) {
                                router.push(`/pool/${(e.target as HTMLInputElement).value}`);
                            } else {
                                router.push(`/transactions/${(e.target as HTMLInputElement).value}`);
                            }
                        }
                    }}
                />
            </Box>
            <GradientButton size="large" startIcon={<WalletIcon />} onClick={() => {}}>
                <span className="hidden md:block">Connect Wallet</span>
            </GradientButton>
        </nav>
    );
}
