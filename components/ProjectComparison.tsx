import React from 'react';
import { ComparisonData, ComparisonStats } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface ProjectComparisonProps {
  data: ComparisonData;
}

const renderComparisonRow = (label: string, value2025: number, value2024: number) => {
  const percentageChange = value2024 !== 0 ? ((value2025 - value2024) / value2024) * 100 : (value2025 > 0 ? Infinity : 0);
  const isIncrease = percentageChange >= 0;

  return (
    <tr key={label} className="border-b last:border-b-0 hover:bg-gray-100/50">
      <td className="py-4 px-4 font-semibold text-gray-700">{label}</td>
      <td className="py-4 px-4 text-center text-gray-600">{value2024.toLocaleString('ar-EG')}</td>
      <td className="py-4 px-4 text-center text-gray-600">{value2025.toLocaleString('ar-EG')}</td>
      <td className="py-4 px-4 text-center font-bold text-brand-green-800">{(value2024 + value2025).toLocaleString('ar-EG')}</td>
      <td className="py-4 px-4">
        {isFinite(percentageChange) ? (
          <div className={`flex items-center justify-center text-sm font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {isIncrease ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            <span className="mx-1">{Math.abs(percentageChange).toFixed(0)}%</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

const ProjectComparison: React.FC<ProjectComparisonProps> = ({ data }) => {
    const { stats2024, stats2025 } = data;
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
                <tr>
                    <th className="py-3 px-4 text-right font-bold text-gray-600">المؤشر</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-600">عام 2024</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-600">عام 2025</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-600">الإجمالي</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-600">مؤشر النمو</th>
                </tr>
            </thead>
            <tbody>
                {renderComparisonRow('اجمالي المستفيدين', stats2025.totalBeneficiaries, stats2024.totalBeneficiaries)}
                {renderComparisonRow('الوفـــود المنفذة', stats2025.implementedDelegations, stats2024.implementedDelegations)}
                {renderComparisonRow('عدد البرامج المنفذة', stats2025.implementedPrograms, stats2024.implementedPrograms)}
                {renderComparisonRow('عدد الساعات الإثرائية', stats2025.enrichmentHours, stats2024.enrichmentHours)}
            </tbody>
        </table>
    </div>
  );
};

export default ProjectComparison;
