import React from 'react';
// Fix: Changed import path to be relative.
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
      <div className="max-w-4xl mx-auto space-y-4">
        {projects.map((project) => (
          <ProjectAccordion key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;