import React, { useState } from 'react';
import { ProcessedProject, ComparisonData, StatsData } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ProjectComparison from './ProjectComparison';
import ProjectStatsDisplay from './ProjectStatsDisplay';

const ProjectAccordion: React.FC<{ project: ProcessedProject }> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderContent = () => {
    if (project.error) {
      return <p className="p-4 text-red-600">فشل تحميل بيانات المشروع: {project.error}</p>;
    }

    if (!project.data) {
      return <p className="p-4 text-gray-500">لا توجد بيانات لعرضها.</p>;
    }

    if (project.type === 'comparison') {
      return <ProjectComparison data={project.data as ComparisonData} />;
    }

    if (project.type === 'stats') {
      return <ProjectStatsDisplay data={project.data as StatsData} />;
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-right hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-brand-green-900">{project.name}</h3>
           {typeof project.totalBeneficiaries === 'number' && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold">{project.totalBeneficiaries.toLocaleString('ar-EG')}</span> مستفيد
            </p>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="border-t border-gray-200">
          <div className="p-5 bg-gray-50">
           {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAccordion;
