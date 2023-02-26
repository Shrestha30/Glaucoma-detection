import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData, title }) {
  if(false) ChartJS();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: Math.min(...chartData.datasets[0].data)-Math.floor(0.1*Math.min(...chartData.datasets[0].data)+1),
      }
    }
  };

  return <Bar data={chartData} options={options}/>;
}

export default BarChart;