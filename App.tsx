import React from 'react';
import useDashboardData from './hooks/useDashboardData';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardHeader from './components/DashboardHeader';
import ProjectSection from './components/ProjectSection';
import PartnersSection from './components/PartnersSection';

const App: React.FC = () => {
  const { 
    loading, 
    logoUrl, 
    headerStats,
    projects,
    partners,
    error 
  } = useDashboardData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-800 mb-2">حدث خطأ فادح</h2>
          <p className="text-red-700">{error}</p>
          <p className="mt-4 text-gray-600">يرجى التأكد من أن مصدر البيانات يعمل بشكل صحيح.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-green-50/70 font-sans p-4 sm:p-6 lg:p-8">
      <header className="max-w-5xl mx-auto mb-8 text-center">
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="شعار وفود الحرم" 
            className="mx-auto h-24 sm:h-28 object-contain transition-transform duration-300 hover:scale-105"
          />
        )}
      </header>

      <main>
        <DashboardHeader 
          totalBeneficiaries={headerStats.totalBeneficiaries}
          projectCount={headerStats.projectCount}
          overallSatisfaction={headerStats.overallSatisfaction}
          loading={loading}
        />
        
        <div className="space-y-6 sm:space-y-8">
          {projects.map(project => (
            <ProjectSection key={project.name} project={project} />
          ))}
        </div>

        <PartnersSection partners={partners} loading={loading} />
      </main>

       <footer className="text-center mt-12 py-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} جمعية وفود الحرم. جميع الحقوق محفوظة.
          </p>
        </footer>
    </div>
  );
};

export default App;
