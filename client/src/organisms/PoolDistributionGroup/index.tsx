'use client';

import React from 'react';

import GradientBanner from '@app/atoms/GradientBanner';
import GradientHealthBar from '@app/atoms/GradientHealthBar';

export default function PoolDistributionGroup() {
    return (
        <GradientBanner>
            <div className="col-span-1 lg:col-span-2 border-r-0 border-b-[1px] border-b-[#666666] lg:border-r-[1px] lg:border-r-[#666666] lg:border-b-0">
                <div className="px-4 pt-6 flex flex-col gap-8 w-full lg:px-10 lg:pt-12 justify-between">
                    <p className="text-2xl font-medium text-[#E6E6E6]">Pool Distribution Group</p>
                    <div className="flex justify-between md:justify-start md:gap-10">
                        <div className="flex gap-2 items-center">
                            <div className="h-2 w-6 rounded bg-[#7AE856]" />
                            <p className="text-sm font-normal text-[#E6E6E6]">Great Pools</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="h-2 w-6 rounded bg-[#FEA72A]" />
                            <p className="text-sm font-normal text-[#E6E6E6]">Good Pools</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="h-2 w-6 rounded bg-[#FF6B00]" />
                            <p className="text-sm font-normal text-[#E6E6E6]">Bad Pools</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-4 pb-12 lg:px-10 lg:py-8 lg:pb-16">
                    <GradientHealthBar
                        className="absolute"
                        labelData={[
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                        linkUrl: 'https://unsplash.com'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                        linkUrl: 'https://unsplash.com'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            },
                            {
                                data: 450,
                                content: [
                                    {
                                        text: 'MonkeyDLuffy',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    },
                                    {
                                        text: 'AceDPortogas',
                                        imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    }
                                ]
                            }
                        ]}
                        labelIsPercentage
                    />
                </div>
                <div className="px-4 py-4 lg:px-10 lg:py-8 lg:min-h-[355px]">
                    <GradientHealthBar
                        labels={[
                            {
                                text: 'Great',
                                textPosition: 'start'
                            },
                            {
                                text: 'Good',
                                textPosition: 'center'
                            },
                            {
                                text: 'Bad',
                                textPosition: 'end'
                            }
                        ]}
                        labelIndicator="bad"
                    />
                </div>
            </div>
        </GradientBanner>
    );
}