
import GradientTypography from "@app/atoms/GradientTypography";
import TableHeader from "@app/atoms/TableHeader";
import _ from "lodash";
import Link from "next/link";


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
                            ? contributorsData.map((pool: any) => (
                                <tr key={pool.name} className="border-b-[1px] border-b-[#303030] hover:bg-[#292929]">
                                    <td className="py-5 px-4 lg:px-10 text-start">
                                        <GradientTypography>
                                            <Link href={pool.url}>{pool.name}</Link>
                                        </GradientTypography>
                                    </td>
                                </tr>
                            ))
                            : _.range(0, 8).map((percent, index) => (
                                <tr key={index} className="border-b-[1px] h-[65px] hover:bg-[#292929] w-full isolate overflow-hidden shadow-xl shadow-black/5 gap-[2px]">
                                    <td className="grid-cols-1 bg-[#303030] animate-pulse w-full py-5 px-4 lg:px-10 text-start" />
                                    <td className="grid-cols-1 bg-[#303030] animate-pulse w-full py-5 px-4 lg:px-10 text-start" />
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-6">
                <p>Help us to include more information on cardano mempool.</p>
                <p>Submit your pool information
                    <Link
                        className={`ml-2 bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] bg-clip-text text-transparent text-base font-medium hover:underline`}
                        href={`${process.env.CONTACT_US_URL}`}
                        target="_blank"
                    >
                        here</Link>
                </p>
            </div>
        </div>
    );
}