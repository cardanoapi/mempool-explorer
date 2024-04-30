import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import _ from 'lodash';

import { Tooltip } from '@mui/material';

import TriangleIndicator from '@app/atoms/Icon/TriangleIndicator';
import { toEndDottedStr } from '@app/utils/string-utils';

interface ILabelContent {
    imageUrl?: string;
    linkUrl?: string;
    text: string;
    totalWaitTime: string;
    poolId: string;
}

interface ILabelData {
    data: number | string; // indicates percentage
    content: Array<ILabelContent>;
}

interface IGradientHealthBarProps {
    searchQuery?: string;
    labelIsPercentage?: boolean;
    labels?: Array<
        | string
        | {
              text: string;
              textPosition: string;
          }
    >;
    labelData?: ILabelData[];
    labelIndicator?: 'great' | 'good' | 'bad';
    className?: string;
}

// DO NOT REMOVE THIS COMMENTED CODE
// renders transaction status health with top triangle indicator bar
// USAGE in code

// const labels = [
//         {
//             text: 'Great',
//             textPosition: 'start'
//         },
//         {
//             text: 'Good',
//             textPosition: 'center'
//         },
//         {
//             text: 'Bad',
//             textPosition: 'end'
//         }
//     ];
// <GradientHealthBar labels={labels} labelIndicator="bad" />
const GradientHealthBar = ({ labels, labelData, labelIndicator, searchQuery = '', labelIsPercentage = false, className = '' }: IGradientHealthBarProps) => {
    // console.log('GradientHealthBar', labels, labelData?.slice().reverse(), labelIndicator, labelIsPercentage);

    const [filteredData, setFilteredData] = useState<Array<ILabelData>>([]);

    useEffect(() => {
        if (labelData) {
            const filtered: any = labelData.map((label: ILabelData) => ({
                data: label.content.filter((content: ILabelContent) => content.text.toLowerCase().includes(searchQuery.toLowerCase())).length,
                content: label.content.filter((content: ILabelContent) => content.text.toLowerCase().includes(searchQuery.toLowerCase()))
            }));

            setFilteredData(filtered);
        }
    }, [searchQuery, labelData]);

    return (
        <>
            <div className="relative w-full overflow-auto">
                {/* Rendering labelData with Array inside Array */}
                <div className="flex w-full justify-evenly items-end h-[385px] text-[#292929]">
                    {filteredData &&
                        filteredData.length > 0 &&
                        filteredData
                            .slice()
                            .reverse()
                            .map((label, index) => {
                                return (
                                    <div key={index} className="w-full flex flex-col">
                                        <div className="overflow-y-auto max-h-[385px] flex flex-col first:!mt-auto">
                                            {label.content.length > 0 &&
                                                label.content.map((content, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className="w-full min-h-[35px] bg-black border-[1px] border-[#303030] flex items-center">
                                                            {content.imageUrl && (
                                                                <p className="h-[35px] w-[35px] flex items-center justify-start bg-black text-white text-xs p-2 overflow-hidden">
                                                                    {content.text.startsWith('pool') ? content.imageUrl.substring(0, 3) : content.imageUrl.substring(0, 2)}
                                                                </p>
                                                            )}
                                                            {/* {content.linkUrl ? (
                                                                // TODO: Navigate to our pool page and in that page add external link to the pool
                                                                <Tooltip title={`Total Wait time ${content.totalWaitTime} sec`} arrow>
                                                                    <a href={content.linkUrl} className="hover:text-blue-500 w-full bg-white" target="_blank">
                                                                        <p className="p-2 text-xs">{toEndDottedStr(content.text, 10)}</p>
                                                                    </a>
                                                                </Tooltip>
                                                            ) : ( */}
                                                            <Tooltip title={`Total Wait time ${content.totalWaitTime} sec`} arrow>
                                                                <Link href={`/pool/${content.poolId}`} className="bg-white w-full" prefetch={false}>
                                                                    <p className="w-full p-2 text-xs">{toEndDottedStr(content.text, 10)}</p>
                                                                </Link>
                                                            </Tooltip>
                                                            {/* )} */}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <p className="h-11 w-full z-10 bg-transparent p-3 flex items-center text-base font-medium text-[#292929] border-[1px] border-[#303030] justify-center">{label.data}</p>
                                    </div>
                                );
                            })}
                </div>
                <div className={`bottom-0 h-11 w-full bg-gradient-to-r from-[#FF491C] via-[#FEA72A] to-[#7AE856] ${className}`}></div>
            </div>
            <div className="relative w-full mt-2">
                <div className="flex w-full justify-evenly items-center">
                    {/* Rendering labels apart from percentage */}
                    {labels &&
                        labels.length > 0 &&
                        labels.map((label, index) => {
                            if (typeof label === 'object') {
                                return (
                                    // do not remove justify-start justify-center justify-end
                                    <div key={index} className={`relative h-full w-full flex items-center justify-center`}>
                                        {labelIndicator && labelIndicator === label.text.toLowerCase() && (
                                            <div className={`absolute -top-20 w-full flex justify-${label.textPosition}`}>
                                                <TriangleIndicator />
                                            </div>
                                        )}
                                        <p className={`w-full text-sm font-normal text-[#E6E6E6] text-${label.textPosition}`}>{label.text}</p>
                                    </div>
                                );
                            }
                            return (
                                // do not remove text-center text-end !text-start
                                <div key={index} className="h-full w-full flex items-center justify-center">
                                    <p className={`w-full text-center text-end !text-start text-sm font-normal text-[#E6E6E6] ${label.toLowerCase().includes(searchQuery.toLowerCase()) ? 'bg-[#7AE856] text-white' : ''}`}>{label}</p>
                                </div>
                            );
                        })}

                    {/* Rendering percentage */}
                    {labelIsPercentage &&
                        labelData &&
                        labelData.length > 0 &&
                        _.range(0, 100, 10).map((percent, index) => (
                            <div key={index} className="h-full w-full flex items-center justify-center">
                                <p className="w-full text-center text-end !text-start text-sm font-normal text-[#E6E6E6]">{percent}%</p>
                            </div>
                        ))}
                </div>

                {/* Rendering last percentage 100% */}
                {labelIsPercentage && labelData && labelData.length > 0 && (
                    <div className="absolute right-0 bottom-0 h-full w-full flex items-center justify-center">
                        <p className="w-full text-end text-sm font-normal text-[#E6E6E6]">100%</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default GradientHealthBar;
