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

    // const generateRandomColor = () => {
    //     const randomHue = Math.random() * 360; // Random hue value
    //     const randomSaturation = Math.random() * 30 + 70; // Random saturation value biased towards brighter colors
    //     const randomLightness = Math.random() * 30 + 40; // Random lightness value biased towards brighter colors
    //     return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
    // };

    const datasets = data
        .slice()
        .reverse()
        .sort((a, b) => {
            return parseFloat(a.total_wait_time) - parseFloat(b.total_wait_time);
        })
        .map((item: PoolDistribution, idx: number) => {
            const mean = data.reduce((acc, curr) => acc + parseFloat(curr.total_wait_time), 0) / data.length;
            // const adjustedColorIndex = Math.floor(parseFloat(item.avg_wait_time) / 10) + (parseFloat(item.avg_wait_time) > mean ? 5 : 0);
            // const colorIndex = Math.max(0, Math.min(9, adjustedColorIndex));

            const isAboveMean = parseFloat(item.total_wait_time) > mean;

            let colorIndex;
            if (isAboveMean) {
                colorIndex = Math.floor(parseFloat(item.total_wait_time) / 10) + 4;
            } else {
                const totalBelowMean = data.filter((d) => parseFloat(d.total_wait_time) <= mean).length;
                colorIndex = Math.floor((idx + 1) / (totalBelowMean / 5));
            }

            colorIndex = Math.max(0, Math.min(9, colorIndex));
            // let colorIndex = Math.floor(parseFloat(item.avg_wait_time) / 10);
            // colorIndex = Math.max(0, Math.min(colorIndex, 9));
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
                const found = dataset.label?.toLowerCase().includes(searchQuery);
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

    return (
        <Bubble
            options={{
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
                            label: (context: any) => {
                                const dataset = context.dataset.label || '';
                                const dataPoint = context.parsed;
                                const tx = context.dataset?.txCount ? `\n(${parseInt(context.dataset.txCount).toLocaleString('en-US')} transactions)` : '';
                                return `${dataset}: ${dataPoint.y?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${hoverTextPrefix}${tx}`;
                            }
                        }
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
                        grid: {
                            color: 'rgba(48, 48, 48, 1)'
                        },
                        title: {
                            display: true,
                            text: 'Pool'
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
                        ticks: {
                            stepSize,
                            callback: function (value, index, ticks) {
                                return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${tickText}`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Total Wait Time (Seconds)'
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
        />
    );
}
