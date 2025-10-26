import React, { useState } from 'react';
import { ProcessedProject, StatsData } from '../types';
import ProjectStatsDisplay from './ProjectStatsDisplay';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UsersIcon from './icons/UsersIcon';

interface ProjectAccordionProps {
  project: ProcessedProject;
}

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPrimaryStat = () => {
    if (project.error) return '-';
    if (project.data) {
        const stats = project.data as StatsData;
        const beneficiaryStat = stats.find(s => s.label.includes('المستفيدين'));
        if (beneficiaryStat) {
            const value = typeof beneficiaryStat.value === 'string' ? parseFloat(beneficiaryStat.value.replace(/[^0-9.]/g, '')) : beneficiaryStat.value;
            if (!isNaN(value)) {
                 return value.toLocaleString('ar-EG');
            }
        }
    }
    return '-';
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right px-6 py-5 flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green-500"
        aria-expanded={isOpen}
        aria-controls={`project-content-${project.type}`}
      >
        <div className="flex-1 flex items-center space-x-4 space-x-reverse">
            <h3 className="text-xl font-bold text-brand-green-800">{project.name}</h3>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
             <div className="flex items-center text-sm text-gray-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
                <UsersIcon />
                <span className="mr-2">المستفيدون:</span>
                <span className="font-bold text-brand-green-900">{getPrimaryStat()}</span>
            </div>
            <ChevronDownIcon 
              className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
            />
        </div>
      </button>

      {isOpen && (
        <div id={`project-content-${project.type}`} className="p-6 border-t">
          {project.error && <p className="text-red-600 text-center">خطأ: {project.error}</p>}
          {!project.error && project.data && (
            <ProjectStatsDisplay data={project.data as StatsData} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectAccordion;