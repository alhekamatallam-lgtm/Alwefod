import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-brand-green-50/50">
    <div className="w-16 h-16 border-4 border-brand-green-300 border-t-brand-green-600 rounded-full animate-spin"></div>
    <p className="text-brand-green-800 font-semibold mt-4 text-lg">جاري تحميل البيانات...</p>
  </div>
);

export default LoadingSpinner;
