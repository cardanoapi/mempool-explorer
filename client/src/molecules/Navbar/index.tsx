'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Box, InputAdornment, TextField } from '@mui/material';

import GradientButton from '@app/atoms/Button/GradientButton';
import BrandIcon from '@app/atoms/Icon/Brand';
import SearchIcon from '@app/atoms/Icon/Search';
import WalletIcon from '@app/atoms/Icon/Wallet';

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="flex items-center justify-between gap-2 h-22 px-10">
            <Link href="/" tabIndex={-1} className="flex items-center gap-2 font-semibold text-xl text-white">
                <BrandIcon />
                <p>Mempool</p>
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
                            fontSize: '16px',
                            caretColor: '#E6E6E6',
                            '&:focus-within fieldset, &:focus-visible fieldset': {
                                border: '1px solid #E6E6E6 !important'
                            }
                        }
                    }}
                    fullWidth
                    className="flex items-center !font-ibm"
                    onKeyDown={(e) => {
                        // @ts-ignore
                        if (e.key === 'Enter' && !!e.target.value) {
                            // @ts-ignore
                            router.push(`/${e.target.value}`);
                        }
                    }}
                />
            </Box>
            <GradientButton size="large" startIcon={<WalletIcon />} onClick={() => {}}>
                Connect Wallet
            </GradientButton>
        </nav>
    );
}
