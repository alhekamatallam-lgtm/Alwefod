import React, { useState, useEffect } from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  className?: string;
  isPercentage?: boolean;
  accentColor: string; // e.g., 'border-blue-500'
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className, isPercentage = false, accentColor }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1500; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Using ease-out cubic function for a smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(value * easedProgress);

      setDisplayValue(currentValue);

      if (frame === totalFrames) {
        clearInterval(counter);
        setDisplayValue(value); // Ensure final value is exact
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-lg flex items-center space-x-reverse space-x-4 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${accentColor.replace('border-', 'bg-').replace('-500', '-100')}`}>
        {icon}
      </div>
      <div className={`border-r-4 ${accentColor} pr-4`}>
        <p className="text-4xl font-extrabold text-gray-800">
            {displayValue.toLocaleString('en-US')}
            {isPercentage && <span className="text-2xl">%</span>}
        </p>
        <p className="text-base font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;