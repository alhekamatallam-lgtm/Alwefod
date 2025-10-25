import React from 'react';
import { ProcessedProject } from '../types';
import ProjectAccordion from './ProjectAccordion';

interface ProjectSectionProps {
  projects: ProcessedProject[];
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
       <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          منجزات المشاريع
        </h2>
        <p className="mt-2 text-md text-gray-500">
          نستعرض أبرز الأرقام والإحصائيات لمشاريعنا النوعية
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {projects.map((project) => (
          <ProjectAccordion key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
