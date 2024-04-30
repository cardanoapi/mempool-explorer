import Link from 'next/link';

import _ from 'lodash';

import GradientTypography from '@app/atoms/GradientTypography';
import CopyIcon from '@app/atoms/Icon/Copy';
import TableHeader from '@app/atoms/TableHeader';
import { toMidDottedStr } from '@app/utils/string-utils';
import { copyToClipboard } from '@app/utils/utils';

export default function ContributersInfo({ contributorsData }: { contributorsData: any }) {
    return (
        <div>
            <div className="px-4 py-6 lg:px-10 lg:py-12">
                <p className="text-2xl font-medium text-[#E6E6E6]">Our Contributors List</p>
            </div>

            <div className="lg:h-[100%] overflow-y-auto">
                <table className="table-auto w-full pb-6 lg:pb-12">
                    <TableHeader thClassName="md:px-4 lg:px-10" columns={['Pool Hash', 'Pool Name', 'Pool URL']} />
                    <tbody className="!text-xs lg:!text-sm !font-normal">
                        {contributorsData &&
                            contributorsData.length > 0 &&
                            contributorsData.map((pool: any) => (
                                <tr key={pool.name} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <GradientTypography>
                                            <Link href={`/pool/${pool.pool}`}>{toMidDottedStr(pool.pool, 12)}</Link>
                                        </GradientTypography>
                                    </td>
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <GradientTypography>
                                            <Link href={`/pool/${pool.pool}`}>{pool.name}</Link>
                                        </GradientTypography>
                                    </td>
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <GradientTypography>
                                            <Link href={pool.url} target="_blank" prefetch={false}>
                                                {pool.url}
                                            </Link>
                                        </GradientTypography>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-6 md:px-10 md:py-10">
                <p className="mb-4 text-2xl font-medium text-[#E6E6E6]">Want To Make A Difference?</p>
                <p className="mb-8">
                    If you&apos;re a stake pool operator interested in contributing to the Cardano Mempool Explorer to help make more transactions available within the Cardano ecosystem, consider adding our relay to your peer list on one of your
                    pool&apos;s relays. Once you&apos;ve made the addition, please let us know by emailing us at{' '}
                    <Link href={`mailto:info@kuberide.com`} target="_blank" className="bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent hover:underline">
                        info@kuberide.com
                    </Link>
                    .
                </p>
                <p className="mb-4 text-lg font-bold text-[#E6E6E6]">Add Our Relay Details</p>
                <blockquote className="p-4 my-4 border-l-4 border-gray-500 bg-gray-800 w-fit">
                    <p className="text-xl font-medium leading-relaxed text-white w-fit">
                        <span className="flex gap-4 justify-between">
                            <span className="">
                                <span>HOST:</span>
                                <span className="ml-10">relay.cardanoapi.io</span>
                            </span>
                            <button className="bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium hover:underline" onClick={() => copyToClipboard('relay.cardanoapi.io', 'Relay Host')}>
                                <CopyIcon />
                            </button>
                        </span>
                        <span className="flex gap-4 justify-between">
                            <span>
                                <span>PORT:</span>
                                <span className="ml-10">3001</span>
                            </span>
                            <button className="bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium hover:underline" onClick={() => copyToClipboard('3001', 'Relay Port')}>
                                <CopyIcon />
                            </button>
                        </span>
                    </p>
                </blockquote>
            </div>

            {process.env.CONTACT_US_URL && (
                <>
                    <hr />
                    <div className="px-4 py-6 md:px-10 md:py-10">
                        <p>Help us to include more information on cardano mempool.</p>
                        <p>
                            Submit your pool information
                            <Link className={`ml-2 bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium hover:underline`} href={`${process.env.CONTACT_US_URL}`} target="_blank">
                                here
                            </Link>
                        </p>
                    </div>
                </>
            )}
            <hr />
            <footer className="px-4 py-6 md:px-10">
                <div className="flex justify-center items-center py-4">
                    <p className="text-xs text-[#E6E6E6]">&copy; {new Date().getFullYear()} Kuberide Team. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
