'use client';

import React, { useEffect } from 'react';

import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ILineChartProps {
    labels: string[];
    data: Array<string | number>;
    secondData?: Array<string | number>;
    tickText: string;
    suggestedMin?: number;
    suggestedMax?: number;
}

export default function LineChart({ labels, data, tickText, secondData, suggestedMin = 0, suggestedMax = 10 }: ILineChartProps) {
    const [datasets, setDatasets] = React.useState<Array<any>>([
        {
            data,
            label: '',
            borderColor: '#FF6B00',
            backgroundColor: '#FF6B00',
            pointBackgroundColor: '#FF6B00',
            pointBorderColor: '#E6E6E6',
            pointHoverBackgroundColor: '#FF6B00',
            pointHoverBorderWidth: 8,
            pointBorderWidth: 8,
            borderWidth: 4,
            fill: false,
            tension: 0.2
        }
    ]);

    useEffect(() => {
        // Update the first dataset when data prop changes
        const updatedFirstDataset = {
            ...datasets[0],
            data
        };

        const updatedDatasets = [updatedFirstDataset];

        if (secondData) {
            // Update the second dataset when secondData prop changes
            const updatedSecondDataset = {
                data: secondData,
                borderColor: '#BD00FF',
                backgroundColor: '#BD00FF',
                pointBackgroundColor: '#BD00FF',
                pointBorderColor: '#E6E6E6',
                pointHoverBackgroundColor: '#BD00FF',
                pointHoverBorderWidth: 8,
                pointBorderWidth: 8,
                borderWidth: 4,
                fill: false,
                tension: 0.2
            };
            updatedDatasets.push(updatedSecondDataset);
        }

        setDatasets(updatedDatasets);
    }, [data, secondData]);

    return (
        <Line
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
                                return `${yValue} ${tickText}`;
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
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(48, 48, 48, 1)' // Customize the y-axis grid line color,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 2, // Adjust the stepSize as needed
                            callback: function (value, index, ticks) {
                                return `${value} ${tickText}`;
                            }
                        },
                        grid: {
                            color: 'rgba(48, 48, 48, 1)' // Customize the y-axis grid line color
                        },
                        suggestedMin,
                        suggestedMax
                    }
                }
            }}
            data={{
                labels,
                datasets
            }}
        />
    );
}
