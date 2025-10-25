import React from 'react';

const HourglassIcon: React.FC = () => (
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
        <path d="M5 22h14"></path>
        <path d="M5 2h14"></path>
        <path d="M17 2v5l-5 5-5-5V2"></path>
        <path d="M7 22v-5l5-5 5 5v5"></path>
    </svg>
);

export default HourglassIcon;
