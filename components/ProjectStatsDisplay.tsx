import React from 'react';
import { StatsData } from '../types';
import StatCard from './StatCard';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import GiftIcon from './icons/GiftIcon';
import HeartIcon from './icons/HeartIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import WheelchairIcon from './icons/WheelchairIcon';

const iconMap: { [key: string]: React.ReactNode } = {
  'UsersIcon': <UsersIcon />,
  'BriefcaseIcon': <BriefcaseIcon />,
  'GiftIcon': <GiftIcon />,
  'HeartIcon': <HeartIcon />,
  'BookOpenIcon': <BookOpenIcon />,
  'WheelchairIcon': <WheelchairIcon />,
};

interface ProjectStatsDisplayProps {
  data: StatsData;
}

const ProjectStatsDisplay: React.FC<ProjectStatsDisplayProps> = ({ data }) => {
  if (!data || !data.stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.stats.map((item) => (
        <StatCard 
          key={item.label} 
          icon={typeof item.icon === 'string' ? iconMap[item.icon] : item.icon} 
          label={item.label} 
          value={item.value} 
        />
      ))}
    </div>
  );
};

export default ProjectStatsDisplay;