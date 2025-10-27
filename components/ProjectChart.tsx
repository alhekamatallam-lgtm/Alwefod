import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LogarithmicScale } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { ChartConfig } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LogarithmicScale);

interface ProjectChartProps {
  chartConfig: ChartConfig;
}

const ProjectChart: React.FC<ProjectChartProps> = ({ chartConfig }) => {
  const renderChart = () => {
    switch (chartConfig.type) {
      case 'bar':
        return <Bar data={chartConfig.data} options={chartConfig.options} />;
      case 'doughnut':
        return <Doughnut data={chartConfig.data} options={chartConfig.options} />;
      case 'pie':
        return <Pie data={chartConfig.data} options={chartConfig.options} />;
      default:
        return <p>نوع المخطط غير مدعوم.</p>;
    }
  };

  return <div className="w-full h-auto">{renderChart()}</div>;
};

export default ProjectChart;
