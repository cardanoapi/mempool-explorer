'use client';

import { checkForErrorResponse } from '@app/components/loader/error';
import DashboardBanner from '@app/molecules/DashboardBanner';
import DashboardMempoolBanner from '@app/molecules/DashboardMempoolBanner';
import DashboardStakePoolsBanner from '@app/molecules/DashboardStakePoolsBanner';
import Navbar from '@app/molecules/Navbar';
import { useEffect, useState } from 'react';

export default function Home() {


    return (
        <main className="w-full min-h-screen">
            <Navbar />
            <DashboardBanner/>
            <DashboardMempoolBanner />
            <DashboardStakePoolsBanner />
        </main>
    );
}
