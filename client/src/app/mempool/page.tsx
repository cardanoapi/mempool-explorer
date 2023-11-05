'use client';

import React from 'react';

import useMempoolAndMintEvent from '@app/lib/hooks/useMempoolAndMintEvent';
import LiveMempool from '@app/templates/LiveMempool';

function Home() {
    const { mempoolEvent, mintEvent } = useMempoolAndMintEvent();

    return <LiveMempool mempoolEvent={mempoolEvent} mintEvent={mintEvent} />;
}

export default React.memo(Home);
