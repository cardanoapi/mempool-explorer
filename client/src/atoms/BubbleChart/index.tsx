'use client';

import React, { useEffect, useState } from 'react';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineController, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

interface IPoolData {
    pool_id: string;
    name: string;
    ticker_name: string;
    url: string;
    avg_wait_time: string;
    tx_count: string;
}

interface IBubbleChartProps {
    data: Array<IPoolData>;
    searchQuery?: string;
    secondData?: Array<any>;
    tickText: string;
    hoverTextPrefix?: string;
    suggestedMin?: number;
    suggestedMax?: number;
    stepSize?: number;
}

export default function BubbleChart({ data, tickText, hoverTextPrefix, secondData, searchQuery = '', suggestedMin = 0, suggestedMax = 10, stepSize = 2 }: IBubbleChartProps) {
    // console.log('BubbleChart', data, tickText, hoverTextPrefix, secondData, suggestedMin, suggestedMax, stepSize);

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
            return parseFloat(a.avg_wait_time) - parseFloat(b.avg_wait_time);
        })
        .map((item: IPoolData, idx: number) => {
            const mean = data.reduce((acc, curr) => acc + parseFloat(curr.avg_wait_time), 0) / data.length;
            // const adjustedColorIndex = Math.floor(parseFloat(item.avg_wait_time) / 10) + (parseFloat(item.avg_wait_time) > mean ? 5 : 0);
            // const colorIndex = Math.max(0, Math.min(9, adjustedColorIndex));

            const isAboveMean = parseFloat(item.avg_wait_time) > mean;

            let colorIndex;
            if (isAboveMean) {
                colorIndex = Math.floor(parseFloat(item.avg_wait_time) / 10) + 4;
            } else {
                const totalBelowMean = data.filter((d) => parseFloat(d.avg_wait_time) <= mean).length;
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
                        y: parseFloat(item.avg_wait_time),
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
                const found = dataset.label.toLowerCase().includes(searchQuery);
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
                                const tx = context.dataset?.txCount ? `\n(${context.dataset?.txCount} transactions)` : '';
                                return `${dataset}: ${dataPoint.y} ${hoverTextPrefix}${tx}`;
                            }
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
                                return `${value} ${tickText}`;
                            }
                        }
                    },
                    y: {
                        // beginAtZero: true,
                        ticks: {
                            stepSize,
                            callback: function (value, index, ticks) {
                                return `${value} ${tickText}`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Avg. Wait Time (Seconds)'
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
