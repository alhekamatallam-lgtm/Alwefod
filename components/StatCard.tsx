import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import GiftIcon from './icons/GiftIcon';
import HeartIcon from './icons/HeartIcon';
import UsersIcon from './icons/UsersIcon';
import FoodIcon from './icons/FoodIcon';
import DropletIcon from './icons/DropletIcon';
import WheelchairIcon from './icons/WheelchairIcon';
import IncenseBurnerIcon from './icons/IncenseBurnerIcon';
import WristbandIcon from './icons/WristbandIcon';
import GlobeIcon from './icons/GlobeIcon';
import HourglassIcon from './icons/HourglassIcon';


interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const iconMap: { [key: string]: React.ReactNode } = {
    'UsersIcon': <UsersIcon />,
    'BriefcaseIcon': <BriefcaseIcon />,
    'GiftIcon': <GiftIcon />,
    'HeartIcon': <HeartIcon />,
    'BookOpenIcon': <BookOpenIcon />,
    'FoodIcon': <FoodIcon />,
    'DropletIcon': <DropletIcon />,
    'WheelchairIcon': <WheelchairIcon />,
    'IncenseBurnerIcon': <IncenseBurnerIcon />,
    'WristbandIcon': <WristbandIcon />,
    'GlobeIcon': <GlobeIcon />,
    'HourglassIcon': <HourglassIcon />,
};


const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('ar-EG') : value;

  const renderIcon = () => {
    if (typeof icon === 'string' && iconMap[icon]) {
        return iconMap[icon];
    }
    return icon;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 space-x-reverse transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="bg-brand-green-100 p-4 rounded-full flex-shrink-0">
        {renderIcon()}
      </div>
      <div className="flex-grow">
        <p className="text-md sm:text-lg font-semibold text-gray-600 truncate">{label}</p>
        <p className="text-3xl font-extrabold text-brand-green-900">{formattedValue}</p>
      </div>
    </div>
  );
};

export default StatCard;
