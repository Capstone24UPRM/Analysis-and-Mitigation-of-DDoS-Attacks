// components/BarChart.js

"use client";  // This ensures it's a client component

import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto'; // Import chart.js directly

const BarChart = ({ data }) => {
  const chartRef = useRef(null); // Reference for the canvas

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const myBarChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bar Chart',
          },
        },
      },
    });

    // Clean up chart on component unmount
    return () => {
      myBarChart.destroy();
    };
  }, [data]);

  return (
  <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] n-auto p-4 border rounded-lg bg-white'>
    <canvas ref={chartRef} className="w-full h-full" />
  </div>
    );
};

export default BarChart;
