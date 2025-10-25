import React from 'react';
import useDashboardData from './hooks/useDashboardData';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardHeader from './components/DashboardHeader';
import ProjectSection from './components/ProjectSection';
import PartnersSection from './components/PartnersSection';

const FALLBACK_LOGO_URL = 'https://wofood.org.sa/img/logo.png';

const App: React.FC = () => {
  const { projects, partners, headerStats, loading, logoUrl } = useDashboardData();

  if (loading && projects.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <img src={logoUrl || FALLBACK_LOGO_URL} alt="شعار جمعية وفود الحرم" className="mx-auto h-16 sm:h-20 w-auto mb-2 sm:mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-800">لوحة المنجزات الرقمية</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-1 sm:mt-2">متابعة حية لأداء وإنجازات مشاريعنا</p>
        </header>
        
        <DashboardHeader
            loading={loading && projects.length === 0}
            totalBeneficiaries={headerStats.totalBeneficiaries}
            projectCount={headerStats.projectCount}
            overallSatisfaction={headerStats.overallSatisfaction}
        />

        <div className="space-y-8">
            {projects.map(project => (
                <ProjectSection key={project.name} project={project} />
            ))}
        </div>
        
        <PartnersSection partners={partners} loading={loading && projects.length === 0} />

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} جمعية وفود الحرم</p>
        </footer>
      </main>
    </div>
  );
};

export default App;