import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import _ from 'lodash';

import TriangleIndicator from '@app/atoms/Icon/TriangleIndicator';
import { toEndDottedStr } from '@app/utils/string-utils';


interface IGradientHealthBarProps {
    labelIsPercentage?: boolean;
    labels?: Array<
        | string
        | {
            text: string;
            textPosition: string;
        }
    >;
    labelData?: Array<{
        data: number | string; // indicates percentage
        content: Array<{
            imageUrl?: string;
            linkUrl?: string;
            text: string;
            avgWaitTime: string;
        }>;
    }>;
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
const GradientHealthBar = ({ labels, labelData, labelIndicator, labelIsPercentage = false, className = '' }: IGradientHealthBarProps) => {
    return (
        <>
            <div className="relative w-full overflow-auto">
                {/* Rendering labelData with Array inside Array */}
                <div className="flex w-full justify-evenly items-end text-[#292929]">
                    {labelData &&
                        labelData.length > 0 &&
                        labelData.map((label, index) => {
                            return (
                                <div key={index} className="w-full flex flex-col">
                                    <div className='overflow-y-auto max-h-[385px] flex flex-col first:!mt-auto'>
                                        {label.content.length > 0 &&
                                            label.content.map((content, idx) => (
                                                <div key={idx} className='relative'>
                                                    <div className="w-full min-h-[35px] bg-white border-[1px] border-[#303030] flex items-center">
                                                        {content.imageUrl &&
                                                            <p className="h-[35px] w-[35px] flex items-center justify-start bg-black text-white text-xs p-2 overflow-hidden">
                                                                {content.text.startsWith("pool") ?
                                                                    content.imageUrl.substring(0, 3)
                                                                    : content.imageUrl.substring(0, 2)
                                                                }
                                                            </p>
                                                        }
                                                        {content.linkUrl ? (
                                                            <a href={content.linkUrl} className="hover:text-blue-500 w-full" target="_blank">
                                                                <p className="p-2 text-xs">{toEndDottedStr(content.text, 10)}</p>
                                                                <div className='absolute pt-8 inset-0 z-10 opacity-0 hover:opacity-100 duration-300'>
                                                                    <div className="p-4 flex justify-center items-center text-xs text-white bg-black">Avg. Wait time {content.avgWaitTime} sec</div>
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <Link href={`/pool/${content.text}`} target="_blank">
                                                                <p className="w-full p-2 text-xs">{toEndDottedStr(content.text, 10)}</p>
                                                                <div className='absolute pt-8  inset-0 z-10 opacity-0 hover:opacity-100 duration-300'>
                                                                    <div className="p-4 flex justify-center items-center text-xs text-white bg-black">Avg. Wait time {content.avgWaitTime} sec</div>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </div>

                                                </div>
                                            ))}
                                    </div>
                                    <p className="h-11 w-full z-10 bg-transparent p-3 flex items-center text-base font-medium text-[#292929] border-[1px] border-[#303030] justify-center">{label.data}</p>
                                </div>
                            );
                        })}
                </div>
                <div className={`bottom-0 h-11 w-full bg-gradient-to-r from-[#7AE856] via-[#FEA72A] to-[#FF491C] ${className}`}></div>
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
                                    <p className="w-full text-center text-end !text-start text-sm font-normal text-[#E6E6E6]">{label}</p>
                                </div>
                            );
                        })}

                    {/* Rendering percentage backwards */}
                    {labelIsPercentage &&
                        labelData &&
                        labelData.length > 0 &&
                        _.range(100, 0, -10).map((percent, index) => (
                            <div key={index} className="h-full w-full flex items-center justify-center">
                                <p className="w-full text-center text-end !text-start text-sm font-normal text-[#E6E6E6]">{percent}%</p>
                            </div>
                        ))}
                </div>

                {/* Rendering last percentage 0% */}
                {labelIsPercentage && labelData && labelData.length > 0 && (
                    <div className="absolute right-0 bottom-0 h-full w-full flex items-center justify-center">
                        <p className="w-full text-end text-sm font-normal text-[#E6E6E6]">0%</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default GradientHealthBar;