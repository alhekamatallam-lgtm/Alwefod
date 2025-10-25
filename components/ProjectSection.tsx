import React, { useMemo } from 'react';
import { ProjectApiData, ProjectStats } from '../types';
import { processProjectData } from '../utils/dataProcessor';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface ProjectSectionProps {
  data: ProjectApiData;
}

const GrowthIndicator: React.FC<{ value2024: number; value2025: number }> = ({ value2024, value2025 }) => {
  if (value2024 === 0) {
    if (value2025 > 0) {
      return (
        <span className="flex items-center justify-center gap-1 font-bold text-sm text-blue-600">
          <span>إنجاز جديد</span>
        </span>
      );
    }
    return <span className="text-sm text-gray-500">-</span>;
  }

  const percentageChange = ((value2025 - value2024) / value2024) * 100;

  if (Math.abs(percentageChange) < 0.01) {
    return <span className="text-sm text-gray-500">0%</span>;
  }

  const isPositive = percentageChange > 0;
  const color = isPositive ? 'text-brand-green-600' : 'text-red-600';
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

  return (
    <span className={`flex items-center justify-center gap-1 font-bold text-sm ${color}`}>
      <Icon className="h-4 w-4" />
      <span>{Math.abs(percentageChange).toFixed(0)}%</span>
    </span>
  );
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ data }) => {
  const stats2024: ProjectStats = useMemo(() => processProjectData(data['2024'] || []), [data]);
  const stats2025: ProjectStats = useMemo(() => processProjectData(data['2025'] || []), [data]);

  const tableRows = [
    {
      label: 'اجمالي المستفيدين',
      value2024: stats2024.totalBeneficiaries,
      value2025: stats2025.totalBeneficiaries,
    },
    {
      label: 'الوفـــود المنفذة',
      value2024: stats2024.implementedDelegations,
      value2025: stats2025.implementedDelegations,
    },
    {
      label: 'عدد البرامج المنفذة',
      value2024: stats2024.implementedPrograms,
      value2025: stats2025.implementedPrograms,
    },
    {
      label: 'عدد الساعات الإثرائية',
      value2024: stats2024.enrichmentHours,
      value2025: stats2025.enrichmentHours,
    },
  ];

  const formatNumber = (num: number) => num.toLocaleString('ar-EG');

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-brand-green-900">مشروع وفود الحرم</h2>
          <p className="mt-3 text-lg text-gray-600">مقارنة أداء المشروع بين عامي 2024 و 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">المؤشر</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">عام 2024</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">عام 2025</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">الإجمالي</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">مؤشر النمو</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableRows.map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-800">{row.label}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-700 text-center font-mono">{formatNumber(row.value2024)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-700 text-center font-mono">{formatNumber(row.value2025)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-brand-green-900 text-center font-mono">{formatNumber(row.value2024 + row.value2025)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <GrowthIndicator value2024={row.value2024} value2025={row.value2025} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
