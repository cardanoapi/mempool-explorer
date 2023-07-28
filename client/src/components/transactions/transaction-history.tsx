import React, {useEffect, useState} from 'react';

import {useParams} from 'next/navigation';

import {decode} from 'cbor-x';

import EmptyPageIcon from '@app/assets/svgs/empty-page-icon';
import Loader from '@app/components/loader';
import {ErrorPage, checkForErrorResponse} from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import TableLayout from '@app/shared/table-layout';
import {createLinkElementsForTransactionHash} from "@app/utils/string-utils";
import {AddressTransactionType} from "@app/types/transaction-details-response/socket-response-type";

export default function TransactionHistory() {
    const router = useParams();

    const [currentPage, setCurrentPage] = useState(1);

    const {isLoading, hideLoader, error, setError} = useLoader();

    const [transactions, setTransactions] = useState<Array<AddressTransactionType>>([]);

    const getDataFromDatabase = async (pageNumber: number) => {
        const response = await fetch(`/api/db?id=${router.id}&pageNumber=${pageNumber}`);
        await checkForErrorResponse(response);
        const arrayBuffer = await response.arrayBuffer();
        return decode(new Uint8Array(arrayBuffer));
    };

    useEffect(() => {
        getDataFromDatabase(currentPage)
            .then((d) => setTransactions(createLinkElementsForTransactionHash(d)))
            .catch((e: any) =>
                setError({
                    message: e.message,
                    status: e.code
                })
            )
            .finally(() => hideLoader());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    if (error.status !== -1) return <ErrorPage errObj={error}/>;
    if (isLoading) return <Loader/>;

    const PageRenderer = () => {
        return (
            <div className={'flex justify-end items-center mb-2'}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                    }}
                    className={'mr-2 border-solid border-2 p-2'}
                >
                    Previous
                </button>

                <span>Page {currentPage}</span>

                <button disabled={!!transactions && transactions.length < 100}
                        onClick={() => setCurrentPage(currentPage + 1)} className={'ml-2 border-solid border-2 p-2'}>
                    Next
                </button>
            </div>
        );
    };

    return (
        <>
            <PageRenderer/>
            {!transactions ? <EmptyPageIcon message={""}/> : <TableLayout data={transactions}/>}
        </>
    );
}
