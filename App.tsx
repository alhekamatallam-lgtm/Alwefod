import React from 'react';
import useDashboardData from './hooks/useDashboardData';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { loading, logoUrl } = useDashboardData();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-brand-green-50">
      {logoUrl ? (
        <div className="text-center">
          <img 
            src={logoUrl} 
            alt="شعار الجمعية" 
            className="max-h-32 sm:max-h-40 mb-8 animate-[fade-in_1s_ease-in-out]"
          />
          <h1 className="text-2xl font-bold text-brand-green-800">
            تم تحميل الشعار بنجاح!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            هذه هي الخطوة الأولى. سنقوم ببناء بقية لوحة المعلومات تدريجياً.
          </p>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">
            فشل تحميل الشعار.
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            يرجى التحقق من أن البيانات التجريبية تحتوي على رابط الشعار.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
