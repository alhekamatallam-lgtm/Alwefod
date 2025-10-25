import React from 'react';
import useDashboardData from './hooks/useDashboardData';
import LoadingSpinner from './components/LoadingSpinner';
import PartnersSection from './components/PartnersSection';

const App: React.FC = () => {
  const { data, loading, error } = useDashboardData();

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
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm py-5 px-4 sm:px-6 lg:px-8 border-b-4 border-brand-green-700">
          <div className="max-w-5xl mx-auto flex justify-center items-center">
            <img src={data.logoUrl} alt="شعار جمعية وفود الحرم" className="h-28 w-auto object-contain" />
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-green-900 tracking-tight">
                    لوحة منجزات وفود الحرم
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    نحو خدمة متكاملة ومستدامة لضيوف الرحمن
                </p>
            </div>
            {/* The main content for projects will be added here in the future */}
        </main>

        <PartnersSection partners={data.partners} />
      </div>
    );
  };

  return renderContent();
};

export default App;
