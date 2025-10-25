import React from 'react';

const WheelchairIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="h-6 w-6 text-brand-green-700"
  >
    <path d="M12 12a5 5 0 1 0-10 0 5 5 0 1 0 10 0Z"/>
    <path d="M19.34 16.34a2 2 0 1 0 2.32 2.32l-2.32-2.32Z"/>
    <path d="M2 12h2.5"/>
    <path d="M12 2v2.5"/>
    <path d="m4.66 4.66 1.76 1.77"/>
    <path d="M12 19.5V22"/>
    <path d="m17.58 6.42-1.76 1.77"/>
  </svg>
);

export default WheelchairIcon;