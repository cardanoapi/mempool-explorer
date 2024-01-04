'use client';

import React, { useEffect } from 'react';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineController, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

interface IBubbleChartProps {
    labels: string[];
    data: Array<any>;
    secondData?: Array<any>;
    tickText: string;
    hoverTextPrefix?: string;
    suggestedMin?: number;
    suggestedMax?: number;
    stepSize?: number;
}

export default function BubbleChart({ labels, data, tickText, hoverTextPrefix, secondData, suggestedMin = 0, suggestedMax = 10, stepSize = 2 }: IBubbleChartProps) {
    console.log('BubbleChart', labels, data, tickText, hoverTextPrefix, secondData, suggestedMin, suggestedMax, stepSize);
    // const [datasets, setDatasets] = React.useState<Array<any>>([
    //     {
    //         data,
    //         label: '',
    //         borderColor: '#E6E6E6',
    //         backgroundColor: '#FF6B00',
    //         pointBackgroundColor: '#E6E6E6',
    //         pointBorderColor: '#E6E6E6',
    //         pointHoverBackgroundColor: '#FF6B00',
    //         pointHoverBorderWidth: 8,
    //         pointBorderWidth: 8,
    //         borderWidth: 4,
    //         fill: false,
    //         tension: 0.2
    //     }
    // ]);

    let min = -100;
    let max = 100;

    const fakeDataset = {
        datasets: [
            {
                label: 'Red dataset',
                data: Array.from({ length: 50 }, () => ({
                    x: Math.floor(Math.random() * (max - min + 1)) + min,
                    y: Math.floor(Math.random() * (max - min + 1)) + min,
                    r: Math.floor(Math.random() * (20 - 5 + 1)) + 5
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            },
            {
                label: 'Blue dataset',
                data: Array.from({ length: 50 }, () => ({
                    x: Math.floor(Math.random() * (max - min + 1)) + min,
                    y: Math.floor(Math.random() * (max - min + 1)) + min,
                    r: Math.floor(Math.random() * (20 - 5 + 1)) + 5
                })),
                backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }
        ]
    };

    // useEffect(() => {
    //     // Update the first dataset when data prop changes
    //     const updatedFirstDataset = {
    //         ...datasets[0],
    //         data
    //     };

    //     const updatedDatasets = [updatedFirstDataset];

    //     if (secondData) {
    //         // Update the second dataset when secondData prop changes
    //         const updatedSecondDataset = {
    //             data: secondData,
    //             borderColor: '#E6E6E6',
    //             backgroundColor: '#BD00FF',
    //             pointBackgroundColor: '#BD00FF',
    //             pointBorderColor: '#E6E6E6',
    //             pointHoverBackgroundColor: '#BD00FF',
    //             pointHoverBorderWidth: 8,
    //             pointBorderWidth: 8,
    //             borderWidth: 4,
    //             fill: false,
    //             tension: 0.2
    //         };
    //         updatedDatasets.push(updatedSecondDataset);
    //     }

    //     setDatasets(updatedDatasets);

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data, secondData]);
    return (
        <Bubble
            options={{
                animations: {
                    radius: {
                        duration: 400,
                        easing: 'linear',
                        loop: (context) => context.active
                    }
                },
                responsive: true,
                interaction: {
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        mode: 'nearest',
                        backgroundColor: '#4A4A4A',
                        caretPadding: 16,
                        caretSize: 8,
                        borderWidth: 1,
                        borderColor: '#000000',
                        cornerRadius: 8,
                        position: 'average',
                        padding: {
                            top: 8,
                            bottom: 8,
                            left: 16,
                            right: 16
                        },
                        callbacks: {
                            // Remove default label
                            title: function () {
                                return '';
                            },
                            // Remove default label
                            label: function () {
                                return '';
                            },
                            footer(tooltipItems) {
                                const yValue = tooltipItems[0].parsed.y;
                                return `${yValue} ${hoverTextPrefix}`;
                            }
                        },
                        footerFont: {
                            size: 16,
                            style(ctx, options) {
                                options.size = 16;
                                options.weight = 500;
                                options.lineHeight = 1.2;
                                options.color = '#E6E6E6';
                                return options.fontStyle;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                color: '#E6E6E6',
                scales: {
                    x: {
                        // beginAtZero: true,

                        grid: {
                            color: 'rgba(48, 48, 48, 1)' // Customize the y-axis grid line color,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize, // Adjust the stepSize as needed
                            callback: function (value, index, ticks) {
                                return `${value} ${tickText}`;
                            }
                        },
                        suggestedMin,
                        suggestedMax,
                        grid: {
                            color: 'rgba(48, 48, 48, 1)' // Customize the y-axis grid line color
                        }
                    }
                }
            }}
            // options={{
            //     scales: {
            //         y: {
            //             beginAtZero: true
            //         }
            //     }
            // }}
            // data={fakeDataset}
            data={{
                labels,
                datasets: fakeDataset.datasets
            }}
        />
    );
}
