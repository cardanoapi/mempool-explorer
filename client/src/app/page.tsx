import React from 'react';

import { Metadata } from 'next';

import DashboardPage from '@app/templates/Dashboard';

export const metadata: Metadata = {
    title: 'Mempool Explorer: Real-Time Transaction Status & Network Insights',
    description: 'Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more.',
    robots: 'index, follow',
    assets: ['/seo/og-image.png'],
    openGraph: {
        title: 'Mempool Explorer: Real-Time Transaction Status & Network Insights',
        description: 'Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more.',
        images: [{ url: '/seo/og-image.png' }],
        type: 'website',
        url: 'https://mempool.cardanoapi.io/',
        siteName: 'Mempool Explorer'
    },
    twitter: {
        card: 'summary',
        site: '@cardano',
        title: 'Mempool Explorer: Real-Time Transaction Status & Network Insights',
        description: 'Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more.',
        images: [{ url: '/seo/og-image.png' }]
    },
    applicationName: 'Mempool Explorer'
};

export default function Home() {
    return <DashboardPage />;
}
