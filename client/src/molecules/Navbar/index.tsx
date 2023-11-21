'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ProfileIcon from '@mui/icons-material/AccountCircle';
import { Box, InputAdornment, Modal, TextField } from '@mui/material';

import Button from '@app/atoms/Button';
import GradientButton from '@app/atoms/Button/GradientButton';
import BrandIcon from '@app/atoms/Icon/Brand';
import SearchIcon from '@app/atoms/Icon/Search';
import WalletIcon from '@app/atoms/Icon/Wallet';
import environments from '@app/configs/environments';


declare global {
    interface Window {
        cardano: any;
    }
}

export default function Navbar() {
    const router = useRouter();

    const [wallets, setWallets] = useState<Record<string, any>>({});
    const [connectedWallet, setConnectedWallet] = useState<any>();

    console.log('wallets', wallets);

    useEffect(() => {
        const cardano_wallets: any = [];
        if (typeof window !== 'undefined' && !!window.cardano) {
            Object.keys(window.cardano).forEach((key) => {
                const wallet = window.cardano[key];
                if (wallet.enable && wallet.name) {
                    cardano_wallets[wallet.name] = wallet;
                }
            });
            setWallets(cardano_wallets);
            const storedWallet = localStorage.getItem('wallet');
            if (storedWallet) {
                const wallet = JSON.parse(storedWallet);
                setConnectedWallet(wallet);
            }
        }
    }, []);

    const onConnectWallet = async (walletKey: string) => {
        console.log('Successfully connected!');
        console.log(walletKey);

        const wallet = wallets[walletKey];
        try {
            if (await wallet.isEnabled()) {
                console.log('Wallet is enabled!');
            } else {
                await wallet.enable();
            }
            localStorage.setItem('wallet', JSON.stringify(wallet));
            setConnectedWallet(wallet);
            handleCloseModal();
        } catch (e) {
            console.log('Error enabling wallet', e);
        }
    };

    const onDisconnectWallet = () => {
        console.log('Successfully disconnected!');
        localStorage.removeItem('wallet');
        setConnectedWallet(undefined);
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

            {environments.ENABLE_CONNECT_WALLET && (
                <GradientButton size="large" startIcon={connectedWallet ? <img height={32} width={32} src={connectedWallet.icon} /> : <WalletIcon />} onClick={handleOpenModal}>
                    <span className="hidden md:block">{connectedWallet ? `${connectedWallet.name} Connected` : 'Connect Wallet'}</span>
                </GradientButton>
            )}

            {environments.ENABLE_CONNECT_WALLET && connectedWallet && (
                <Link href="/profile">
                    <GradientButton size="large" startIcon={<ProfileIcon />} onClick={() => {}}>
                        <span className="hidden md:block">My Profile</span>
                    </GradientButton>
                </Link>
            )}

            {environments.ENABLE_CONNECT_WALLET && (
                <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className="flex items-center justify-center">
                    <div className="flex flex-col">
                        {Object.keys(wallets).map((wallet, idx) => (
                            <Button
                                key={idx}
                                size="large"
                                className="pt-8 pb-8 pl-16 pr-16 mt-4 flex !gap-4 !rounded-[48px] !font-ibm !text-white !font-normal !text-base !capitalize bg-purple-600 hover:bg-gradient-to-br hover:from-[#CC3CFF] hover:to-[#BD00FF]"
                                startIcon={<img height={32} width={32} src={wallets[wallet].icon} />}
                                onClick={() => onConnectWallet(wallet)}
                            >
                                {wallet}
                            </Button>
                        ))}
                        {connectedWallet && (
                            <Button size="large" className="flex !gap-2 !rounded-[48px] !items-center !font-ibm !font-normal !text-lg !capitalize !bg-transparent !text-white hover:!bg-gray-500" onClick={onDisconnectWallet}>
                                Disconnect
                            </Button>
                        )}
                    </div>
                </Modal>
            )}
        </nav>
    );
}