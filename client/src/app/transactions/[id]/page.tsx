'use client';

import {useEffect, useState} from 'react';

import {useParams} from 'next/navigation';

import {decode} from 'cbor-x';

import {checkForErrorResponse} from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import {Navbar} from '@app/components/navbar';
import TransactionInputOutput from '@app/components/transaction-hash/transaction-input-output';
import Layout from '@app/shared/layout';
import {toMidDottedStr} from '@app/utils/string-utils';
import Followups from "@app/components/transaction-hash/followups";
import Miner from "@app/components/transaction-hash/Miner";
import Competitors from "@app/components/transaction-hash/competitors";

type TransactionDetailsInterface = {
    tx: any;
    competing: Array<any>;
    followups: Array<any>;
};

export default function TransactionDetails() {
    const router = useParams();

    const {isLoading, showLoader, hideLoader, error, setError} = useLoader();

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsInterface | null>(null);

    const getTransactionDetails = async () => {
        const response = await fetch(`/api/db/transaction?hash=${router.id}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    useEffect(() => {
        showLoader();
        getTransactionDetails()
            .then((d) => {
                setTransactionDetails(d);
            })
            .catch((e: any) => {
                console.error(e);
                setError({
                    message: e?.message ?? '',
                    status: e?.code
                });
            })
            .finally(() => hideLoader());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.id]);

    function ItemCard(props: any) {
        const dataObj = props.transaction;
        return (
            <Layout>
                {Object.keys(dataObj).map(key => (
                    <div key={key} className={'flex flex-col'}>
                        <div className={'flex items-center mt-1 text-sm'}>
                            <p className={'text-gray-700 mr-1 font-semibold'}>{key}</p>
                            <p className={'text-gray-500 font-xs'}>{toMidDottedStr(dataObj[key])}</p>
                        </div>
                    </div>
                ))}
            </Layout>
        )
    }

    return (
        <>
            <Navbar/>
            <div className={'calc-h-68'}>
                <div className={'grid mx-4 grid-cols-1 md:grid-cols-2 gap-4 '}>
                    <TransactionInputOutput isLoading={isLoading} error={error}
                                            txInputOutputs={transactionDetails?.tx}/>
                    <Miner/>
                    <Competitors isLoading={isLoading} error={error} competing={transactionDetails?.competing}/>
                    <Followups isLoading={isLoading} error={error} followups={transactionDetails?.followups}/>
                </div>
            </div>
        </>
    );
}
