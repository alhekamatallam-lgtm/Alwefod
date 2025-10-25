import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('ar-EG') : value;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 space-x-reverse transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="bg-brand-green-100 p-4 rounded-full flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-md sm:text-lg font-semibold text-gray-600 truncate">{label}</p>
        <p className="text-3xl font-extrabold text-brand-green-900">{formattedValue}</p>
      </div>
    </div>
  );
};

export default StatCard;
