'use client';

import {useEffect, useState} from 'react';

import {useParams} from 'next/navigation';

import {decode} from 'cbor-x';

import {checkForErrorResponse} from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import {Navbar} from '@app/components/navbar';
import TransactionInputOutput from '@app/components/transaction-hash/transaction-input-output';
import Followups from "@app/components/transaction-hash/followups";
import Miner from "@app/components/transaction-hash/Miner";
import Competitors from "@app/components/transaction-hash/competitors";
import {ToastContainer} from "react-toastify";
import EmptyPageIcon from "@app/assets/svgs/empty-page-icon";
import {copyToClipboard} from "@app/utils/utils";
import CopyToClipboard from "@app/assets/svgs/copy-to-clipboard";

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
        const response = await fetch(`/api/v1/tx/${router.id}`);
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

    function Contents() {
        return (
            <>
                <div className={'grid calc-h-68 mx-4 grid-cols-1 md:grid-cols-2 gap-4 '}>
                    <TransactionInputOutput isLoading={isLoading} error={error}
                                            txInputOutputs={transactionDetails?.tx}/>
                    <Miner hash={router.id}/>
                    <Competitors isLoading={isLoading} error={error} competing={transactionDetails?.competing}/>
                    <Followups isLoading={isLoading} error={error} followups={transactionDetails?.followups}/>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar/>
            <div className={'calc-h-68 w-screen'}>
                <ToastContainer position={'bottom-right'} autoClose={2000}/>
                <Contents/>
            </div>
        </>
    );
}
