import React from 'react';

const WristbandIcon: React.FC = () => (
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
    <path d="M4 19v-2.8a2 2 0 0 1 .7-1.6l4-3.2a2 2 0 0 1 2.6 0l4 3.2a2 2 0 0 1 .7 1.6V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
    <path d="M12 11v-1a2 2 0 0 0-2-2H8"></path>
    <path d="M16 9h-2a2 2 0 0 0-2 2v1"></path>
    <path d="M10 5H8"></path>
    <path d="M16 5h-2"></path>
  </svg>
);

export default WristbandIcon;