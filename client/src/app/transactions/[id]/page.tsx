'use client';

import {useEffect, useState} from 'react';

import {useParams} from 'next/navigation';

import {decode} from 'cbor-x';

import {checkForErrorResponse} from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import {Navbar} from '@app/components/navbar';
import TransactionInputOutput from '@app/components/transaction-hash/transaction-input-output';
import Layout from '@app/shared/layout';
import {Heading, toMidDottedStr} from '@app/utils/string-utils';
import {
    convertFollowupsToClientSide,
    convertToClientSideInputOutputObject
} from '@app/utils/transaction-details-utils';
import {TxDetail, txs} from "@app/assets/mock-data/mock-data";
import Followups from "@app/components/transaction-hash/followups";

type TransactionDetailsInterface = {
    tx: any;
    competing: Array<any>;
    followups: Array<any>;
    arrivalTime: Date;
};

export default function TransactionDetails() {
    const router = useParams();

    const {isLoading, hideLoader, error, setError} = useLoader();

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsInterface | null>(null);

    const getTransactionDetails = async () => {
        const response = await fetch(`/api/db/transaction?hash=${router.id}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    useEffect(() => {
        getTransactionDetails()
            .then((d) => {
                console.log("transaction details: ", d)
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

    function TransactionBlockInfo(props: any) {
        const dataObj = props.transaction;
        return (
            <>
                {Object.keys(dataObj).map(key => (
                    <Layout key={key}>
                        <p className={'text-gray-700 mr-1 font-semibold'}>{key}</p>
                        <p className={'text-gray-500 font-xs'}>{toMidDottedStr(dataObj[key])}</p>
                    </Layout>
                ))}
            </>
        )
    }

    function Competitors() {
        return (
            <Layout className={"!overflow-y-scroll"}>
                <Heading title={'Competitors'}/>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {txs.map((tx) => (
                        <ItemCard key={tx.hash_id} transaction={tx}/>
                    ))}
                </div>
            </Layout>
        );
    }

    function Miners() {
        return (
            <Layout className={"!max-h-full !overflow-y-scroll"}>
                <Heading title={"Miner"}/>
                <div className={'grid grid-cols-1 md:grid-cols-2'}>
                    {TxDetail.map((tx) => (
                        <TransactionBlockInfo key={tx.block_hash} transaction={tx}/>
                    ))}
                </div>
            </Layout>
        )
    }

    return (
        <>
            <Navbar/>
            <div className={'calc-h-68'}>
                <div className={'grid mx-4 grid-cols-1 md:grid-cols-2 gap-4 '}>
                    <TransactionInputOutput txInputOutputs={transactionDetails?.tx}/>
                    <Miners/>
                    <Competitors/>
                    <Followups followups={transactionDetails?.followups} arrival_time={transactionDetails?.arrivalTime}/>
                </div>
            </div>
        </>
    );
}
