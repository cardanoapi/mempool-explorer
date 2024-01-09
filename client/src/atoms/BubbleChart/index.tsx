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
    console.log('BubbleChart', data, tickText, hoverTextPrefix, secondData, suggestedMin, suggestedMax, stepSize);

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
            let colorIndex = Math.floor(parseFloat(item.avg_wait_time) / 10);
            colorIndex = Math.max(0, Math.min(colorIndex, 9));
            const bgColor = backgroundColor[colorIndex];

            return {
                label: item.name,
                data: [
                    {
                        x: idx + 1,
                        y: parseFloat(item.avg_wait_time),
                        r: 5
                    }
                ],
                backgroundColor: bgColor
            };
        });
    const [filteredDatasets, setFilteredDatasets] = useState(datasets);

    useEffect(() => {
        setFilteredDatasets(
            datasets.map((dataset, idx) => {
                if (searchQuery === '') {
                    return { ...dataset, backgroundColor: dataset.backgroundColor };
                }
                const found = dataset.label.toLowerCase().includes(searchQuery);
                // const opacity = found ? 1 : 0.2;

                return {
                    ...dataset,
                    data: dataset.data.map((item) => ({
                        ...item,
                        // opacity,
                        r: found ? 15 : 3
                    }))
                    // backgroundColor: found ? '#90DD4F' : '#E7E7E7' // Highlight in red if found
                };
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
                                return `${dataset}: ${dataPoint.y} ${hoverTextPrefix}`;
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
