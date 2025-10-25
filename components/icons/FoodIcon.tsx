import React from 'react';

const FoodIcon: React.FC = () => (
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
    <path d="M3 11h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"></path>
    <path d="M12 11V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"></path>
    <path d="M6 11V6a2 2 0 0 1 2-2h1"></path>
    <path d="M6 6h.01"></path>
    <path d="M18 6h.01"></path>
  </svg>
);

export default FoodIcon;