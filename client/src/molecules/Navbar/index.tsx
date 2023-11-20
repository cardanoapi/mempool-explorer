'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, InputAdornment, Modal, TextField } from '@mui/material';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import GradientButton from '@app/atoms/Button/GradientButton';
import BrandIcon from '@app/atoms/Icon/Brand';
import SearchIcon from '@app/atoms/Icon/Search';
import WalletIcon from '@app/atoms/Icon/Wallet';
import { useIsMobile } from '@app/lib/hooks/useBreakpoint';
import { ConnectWalletList, ConnectWalletButton, useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import Button from '@app/atoms/Button';
import dynamic from 'next/dynamic';

// const ConnectWalletList = dynamic(
//     () =>
//         import('@cardano-foundation/cardano-connect-with-wallet').then(
//             (mod) => mod.ConnectWalletList
//         ),
//     {
//         ssr: false,
//     }
// );

// const useCardano = dynamic(
//     () =>
//         import('@cardano-foundation/cardano-connect-with-wallet').then(
//             (mod) => mod.useCardano
//         ),
//     {
//         ssr: false,
//     }
// );

export default function Navbar() {
    const router = useRouter();
    const isMobile = useIsMobile();

    const {
        isEnabled,
        isConnected,
        enabledWallet,
        stakeAddress,
        signMessage,
        connect,
        disconnect
    } = useCardano();

    const onConnectWallet = () => {
        console.log('Successfully connected!');
        handleCloseModal();
    };

    const onDisconnectWallet = () => {
        console.log('Successfully disconnected!');
        disconnect();
        handleCloseModal();
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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

            <GradientButton
                size="large"
                startIcon={<WalletIcon />}
                onClick={handleOpenModal}
            >
                <span className="hidden md:block">
                    {isConnected ? `${enabledWallet} Connected` : 'Connect Wallet'}
                </span>
            </GradientButton>
            {isConnected &&
                <Link href="/profile">
                    <GradientButton
                        size="large"
                        startIcon={<ProfileIcon />}
                        onClick={() => { }}
                    >
                        <span className="hidden md:block">
                            My Profile
                        </span>
                    </GradientButton>
                </Link>
            }

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
            >
                <div className="flex flex-col">
                    <ConnectWalletList
                        borderRadius={48}
                        gap={16}
                        primaryColor="#0538AF"
                        onConnect={onConnectWallet}
                        customCSS={`
                        width: 250px;
                        border-radius: 48px !important;
                        & > span { 
                            padding: 13px 16px; 
                            font-family: 'IBM Plex Mono', 'Open Sans', 'monospace';
                            font-size: 1rem;
                            font-weight: 500;
                            text-align: center;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        `}
                    />
                    {isConnected &&
                        <Button
                            size="large"
                            className="flex !gap-2 !rounded-[48px] !items-center !font-ibm !font-normal !text-lg !capitalize !bg-transparent !text-white hover:!bg-gray-500"
                            onClick={onDisconnectWallet}>Disconnect</Button>
                    }
                </div>
            </Modal>
        </nav>
    );
}

