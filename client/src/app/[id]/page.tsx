'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import _ from 'lodash';

import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
import { decode } from 'cbor-x';

import GradientButton from '@app/atoms/Button/GradientButton';
import GradientTypography from '@app/atoms/GradientTypography';
import CopyIcon from '@app/atoms/Icon/Copy';
import LinkIcon from '@app/atoms/Icon/Link';
import WalletIcon from '@app/atoms/Icon/Wallet';
import TableEmptyElement from '@app/atoms/TableEmptyElement';
import TableHeader from '@app/atoms/TableHeader';
import TableTitle from '@app/atoms/TableTitle';
import { checkForErrorResponse } from '@app/components/loader/error';
import useLoader from '@app/components/loader/useLoader';
import { useGenerateCardanoScanLink } from '@app/lib/hooks/useGenerateCardanoScanLink';
import BannerStatCard from '@app/molecules/BannerStatCard';
import BannerTitle from '@app/molecules/BannerTitle';
import { AddressTransactionType } from '@app/types/transaction-details-response/socket-response-type';
import { copyToClipboard } from '@app/utils/utils';

export default function AddressPage() {
    const router = useParams();

    const [stats, setStats] = useState<Array<any>>([]);
    const { isLoading, hideLoader, error, setError } = useLoader();
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState<Array<AddressTransactionType>>([]);
    const cardanoScanLink = useGenerateCardanoScanLink(setError);

    const getStatsFromDatabase = async () => {
        const response = await fetch(`/api/v1/tx/stats?query=${router?.id}`);
        const data = await response.json();
        return data;
    };

    const getDataFromDatabase = async (pageNumber: number) => {
        const response = await fetch(`/api/v1/tx?query=${router?.id}&pageNumber=${pageNumber}`);
        const data = await response.json();
        return data;
    };

    useEffect(() => {
        getStatsFromDatabase()
            .then((d) => setStats(d))
            .catch((e: any) =>
                setError({
                    message: e.message,
                    status: e.code
                })
            )
            .finally(() => hideLoader());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getDataFromDatabase(currentPage)
            .then((d) => {
                setTransactions([...transactions, ...d]);
            })
            .catch((e: any) =>
                setError({
                    message: e.message,
                    status: e.code
                })
            )
            .finally(() => hideLoader());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <>
            <BannerTitle Icon={WalletIcon} breadCrumbText="Address" title="Address" bannerClassName="!pb-2 md:!pb-2">
                <div className="px-4 md:px-10 flex gap-2 items-center">
                    <button className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(router?.id.toString() || '', 'Address')}>
                        <p className="text-base font-normal text-[#B9B9B9] text-start break-all">{router?.id}</p>
                        <CopyIcon />
                    </button>
                    <Link href={cardanoScanLink} prefetch={false}>
                        <LinkIcon />
                    </Link>
                </div>
                <div className="mt-10 h-[1px]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {isLoading || error.status !== -1 || !stats || stats.length === 0
                        ? _.range(0, 12).map((n) => <BannerStatCard key={n} title="Loading" value="-" />)
                        : stats.map((stat, index) => {
                              const titleMapping: any = {
                                  epoch: 'Epoch',
                                  avg_wait_time: 'Avg Wait Time',
                                  median_wait_time: 'Median Wait Time',
                                  tx_count: 'Transaction'
                              };

                              return (
                                  <React.Fragment key={index}>
                                      {Object.entries(stat).map(([key, value]) => {
                                          if (titleMapping[key]) {
                                              const statObj: any = {
                                                  title: titleMapping[key],
                                                  value: key === 'avg_wait_time' || key === 'median_wait_time' ? `${value} sec` : value
                                              };
                                              return <BannerStatCard key={key} title={statObj.title} value={statObj.value} />;
                                          }
                                          return null;
                                      })}
                                  </React.Fragment>
                              );
                          })}
                </div>
            </BannerTitle>
            <div className={`w-full md:border-r-[1px] md:border-r-[#B9B9B9] overflow-auto`}>
                <TableTitle title="Transactions" />
                <table className="table-auto w-full overflow-auto">
                    <TableHeader columns={['Transaction Hash', 'Wait Time', 'Epoch', 'Block Hash', 'Slot No.', 'Block No.', 'Confirmation Time']} />

                    <tbody className="!text-xs md:!text-base !font-medium">
                        {transactions.length > 0 ? (
                            transactions.map((tx, idx) => (
                                <tr key={idx} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                    {Object.keys(tx).map((rowKey: string, index: number) => {
                                        let content = <span className="break-all">{tx[rowKey as keyof AddressTransactionType]}</span>;
                                        if (rowKey === 'tx_hash') {
                                            content = (
                                                <GradientTypography>
                                                    <Link href={`/transactions/${tx[rowKey as keyof AddressTransactionType]}`} prefetch={false}>{content}</Link>
                                                </GradientTypography>
                                            );
                                        }
                                        return (
                                            <td key={index} className="py-5 px-4 md:px-10 text-start">
                                                {content}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <TableEmptyElement />
                        )}
                    </tbody>
                </table>
                {transactions.length >= 100 && (
                    <div className="px-4 pt-4 md:px-10 md:py-10 pb-[60px]">
                        <GradientButton size="large" onClick={() => setCurrentPage(currentPage + 1)}>
                            Show More
                        </GradientButton>
                    </div>
                )}
            </div>
        </>
    );
}
