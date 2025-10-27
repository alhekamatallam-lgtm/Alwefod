import React, { useState } from 'react';
// Fix: Changed import path to be relative.
import useDashboardData from './hooks/useDashboardData';
import LoadingSpinner from './components/LoadingSpinner';
import PartnersSection from './components/PartnersSection';
import ProjectSection from './components/ProjectSection';
import DashboardHeader from './components/DashboardHeader';

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const { data, loading, error } = useDashboardData(dateRange);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800 p-6" role="alert">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">حدث خطأ فني</h2>
            <p>تعذر تحميل بيانات لوحة التحكم. الرجاء المحاولة مرة أخرى لاحقاً.</p>
            <p className="mt-4 text-sm text-red-600 font-mono bg-red-100 p-2 rounded">
              Error details: {error.message}
            </p>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">لا توجد بيانات متاحة لعرضها.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
        <header className="bg-white shadow-sm py-5 px-4 sm:px-6 lg:px-8 border-b-4 border-brand-green-700">
          <div className="max-w-5xl mx-auto flex justify-center items-center">
            <img src={data.logoUrl} alt="شعار جمعية وفود الحرم" className="h-28 w-auto object-contain" />
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-12 space-y-16">
            {data.summaryStats && (
                <DashboardHeader 
                    stats={data.summaryStats} 
                    dateRange={dateRange} 
                    onDateChange={setDateRange}
                    summaryChart={data.summaryChart}
                />
            )}
            
            {data.projects && data.projects.length > 0 && <ProjectSection projects={data.projects} />}

        </main>

        <PartnersSection partners={data.partners} />
      </div>
    );
  };

  return renderContent();
};

export default App;