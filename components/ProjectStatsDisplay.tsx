import React from 'react';
// Fix: Changed import path to be relative.
import { StatsData } from '../types';
import StatCard from './StatCard';

interface ProjectStatsDisplayProps {
  data: StatsData;
}

const ProjectStatsDisplay: React.FC<ProjectStatsDisplayProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">لا توجد إحصائيات لعرضها.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((stat, index) => (
        <StatCard 
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default ProjectStatsDisplay;
