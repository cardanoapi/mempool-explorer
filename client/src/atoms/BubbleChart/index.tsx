'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Bubble } from 'react-chartjs-2';

import { PoolDistribution } from '@app/types/poolDistribution';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineController, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

interface IBubbleChartProps {
    data: Array<PoolDistribution>;
    searchQuery?: string;
    secondData?: Array<any>;
    tickText: string;
    hoverTextPrefix?: string;
    suggestedMin?: number;
    suggestedMax?: number;
    stepSize?: number;
}

export default function BubbleChart({ data, tickText, hoverTextPrefix, secondData, searchQuery = '', suggestedMin = 0, suggestedMax = 10, stepSize = 2 }: IBubbleChartProps) {
    const router = useRouter();

    const backgroundColor = ['#FF4B1D', '#FF5E1F', '#FF7122', '#FE8425', '#FE9828', '#F8A92C', '#DFB634', '#C4C33D', '#AAD046', '#90DD4F'];

    const datasets = data
        .slice()
        .reverse()
        .sort((a, b) => {
            return parseFloat(b.total_wait_time) - parseFloat(a.total_wait_time);
            // return parseFloat(a.total_wait_time) - parseFloat(b.total_wait_time);
        })
        .map((item: PoolDistribution, idx: number) => {
            const mean = data.reduce((acc, curr) => acc + parseFloat(curr.total_wait_time), 0) / data.length;

            const isAboveMean = parseFloat(item.total_wait_time) > mean;

            let colorIndex;
            if (isAboveMean) {
                colorIndex = Math.floor(parseFloat(item.total_wait_time) / 10) + 4;
            } else {
                const totalBelowMean = data.filter((d) => parseFloat(d.total_wait_time) <= mean).length;
                colorIndex = 9 - Math.floor((idx + 1) / (totalBelowMean / 5));
                // colorIndex = Math.floor((idx + 1) / (totalBelowMean / 5));
            }

            colorIndex = Math.max(0, Math.min(9, colorIndex));
            const bgColor = backgroundColor[colorIndex];

            return {
                label: item.name,
                txCount: item.tx_count,
                data: [
                    {
                        ...item,
                        y: parseFloat(item.total_wait_time),
                        x: idx + 1,
                        // r: !!item?.tx_count ? parseInt(item.tx_count) : 5
                        r: 5
                    }
                ],
                backgroundColor: bgColor
            };
        });
    const [filteredDatasets, setFilteredDatasets] = useState(datasets);

    useEffect(() => {
        setFilteredDatasets(
            datasets.filter((dataset, idx) => {
                if (searchQuery === '') {
                    return { ...dataset, backgroundColor: dataset.backgroundColor };
                }
                const found = dataset.label?.toLowerCase().includes(searchQuery.toLowerCase());
                return found;

                // return {
                //     ...dataset,
                //     data: dataset.data.map((item) => ({
                //         ...item,
                //         r: found ? 15 : 5
                //     }))
                // };
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    // Calculate dynamic offsets for maxX and maxY based on data length
    const calculateOffset = (length: number) => {
        // Adjust these coefficients as needed based on your requirements
        const xOffsetCoefficient = 0.02; // Adjust as needed
        const yOffsetCoefficient = 2; // Adjust as needed

        // Calculate offsets based on data length
        const offsetX = Math.min(20, Math.floor(length * xOffsetCoefficient));
        const offsetY = Math.min(200, Math.floor(length * yOffsetCoefficient));

        return { offsetX, offsetY };
    };

    // Calculate dynamic offsets based on filtered data length
    const { offsetX, offsetY } = calculateOffset(datasets.length);

    // Find the minimum and maximum values of X and Y axes in the original data
    const originalXYMin = 0;
    const originalYMax = Math.max(...data.map((item) => parseFloat(item.total_wait_time))) + offsetY;
    const originalXMax = data.length + offsetX;

    return (
        <Bubble
            options={{
                clip: false,
                animation: false,
                // animations: {
                //     radius: {
                //         duration: 200,
                //         easing: 'linear',
                //         loop: (context: any) => context.active
                //     }
                // },
                responsive: true,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (context: any) => {
                                if (context.length === 0) {
                                    return '';
                                }
                                return context[0].dataset.label;
                            },
                            label: (context: any) => {
                                const dataPoint = context.parsed;

                                return `Rank #${dataPoint.x?.toLocaleString('en-US')}`;
                            },
                            afterLabel: (context: any) => {
                                return context.dataset?.txCount ? `\nMined ${parseInt(context.dataset.txCount).toLocaleString('en-US')} transactions` : '';
                            },
                            footer: (context: any) => {
                                if (context.length === 0) {
                                    return '';
                                }
                                return `\nSaved ${context[0].parsed.y?.toLocaleString('en-US', { maximumFractionDigits: 2 })} seconds of waiting time`;
                            }
                        },
                        displayColors: false,
                        // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        // borderColor: '#ccc',
                        borderWidth: 1,
                        // bodyColor: '#333',
                        bodyFont(ctx, options) {
                            return {
                                size: 14,
                                weight: 'normal',
                                lineHeight: 1
                            };
                        },
                        bodySpacing: 1,
                        padding: 16,
                        boxPadding: 8,
                        // titleColor: '#333',
                        titleFont(ctx, options) {
                            return {
                                size: 18,
                                weight: 'bold',
                                lineHeight: 1.5
                            };
                        },
                        titleSpacing: 1,
                        // footerColor: '#333',
                        footerFont(ctx, options) {
                            return {
                                size: 14,
                                weight: 'normal',
                                lineHeight: 1
                            };
                        },
                        footerMarginTop: 0,
                        footerSpacing: 1
                    }
                },
                onClick(event, elements, chart) {
                    if (elements.length > 0) {
                        const element = elements[0];
                        const dataset = chart.data.datasets[element.datasetIndex];
                        if (dataset && dataset.data && dataset.data[element.index]) {
                            const pool: PoolDistribution = dataset.data[element.index] as unknown as PoolDistribution;
                            router.push(`/pool/${pool.pool_id}`);
                        }
                    }
                },
                color: '#E6E6E6',
                scales: {
                    x: {
                        // beginAtZero: true,
                        min: originalXYMin,
                        max: originalXMax,
                        grid: {
                            color: 'rgba(48, 48, 48, 1)'
                        },
                        title: {
                            display: true,
                            text: 'Pool Rank'
                        },
                        ticks: {
                            stepSize,
                            callback: function (value, index, ticks) {
                                return `${value.toLocaleString('en-US')} ${tickText}`;
                            }
                        }
                    },
                    y: {
                        // beginAtZero: true,
                        min: originalXYMin,
                        max: originalYMax,
                        ticks: {
                            stepSize,
                            callback: function (value, index, ticks) {
                                return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${tickText}`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Collective Transaction Wait Time (Seconds)'
                        },
                        suggestedMin,
                        suggestedMax,
                        grid: {
                            color: 'rgba(48, 48, 48, 1)'
                        }
                    }
                }
            }}
            data={{
                // labels: filteredDatasets.map((item) => item.label),
                datasets: filteredDatasets.flat()
            }}
            style={{ cursor: 'pointer', overflow: 'visible' }}
        />
    );
}
