import Link from 'next/link';

import _ from 'lodash';

import GradientTypography from '@app/atoms/GradientTypography';
import TableHeader from '@app/atoms/TableHeader';

export default function ContributersInfo({ contributorsData }: { contributorsData: any }) {
    return (
        <div>
            <div className="px-4 py-6 lg:px-10 lg:py-12">
                <p className="text-2xl font-medium text-[#E6E6E6]">Our Contributors List</p>
            </div>

            <div className="lg:h-[100%] overflow-y-auto">
                <table className="table-auto w-full pb-6 lg:pb-12">
                    <TableHeader thClassName="md:px-4 lg:px-10" columns={['Pool Name']} />
                    <tbody className="!text-xs lg:!text-sm !font-normal">
                        {contributorsData && contributorsData.length > 0
                            && contributorsData.map((pool: any) => (
                                  <tr key={pool.name} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                      <td className="py-5 px-4 lg:px-10 text-start">
                                          <GradientTypography>
                                              <Link href={pool.url}>{pool.name}</Link>
                                          </GradientTypography>
                                      </td>
                                  </tr>
                              ))
                              }
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-6 md:px-10 md:py-10">
                <p>Help us to include more information on cardano mempool.</p>
                <p>
                    Submit your pool information
                    <Link className={`ml-2 bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium hover:underline`} href={`${process.env.CONTACT_US_URL}`} target="_blank">
                        here
                    </Link>
                </p>
            </div>
        </div>
    );
}
