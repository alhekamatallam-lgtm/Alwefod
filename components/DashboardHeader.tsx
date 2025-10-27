import React from 'react';
import { SummaryStats, ChartConfig } from '../types';
import StatCard from './StatCard';
import HeartIcon from './icons/HeartIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import HourglassIcon from './icons/HourglassIcon';
import ProjectChart from './ProjectChart';


interface DashboardHeaderProps {
  stats: SummaryStats;
  dateRange: { startDate: string; endDate: string };
  onDateChange: (newDateRange: { startDate: string; endDate: string }) => void;
  summaryChart?: ChartConfig;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ stats, dateRange, onDateChange, summaryChart }) => {
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <section className="mb-12">
        <div className="text-center mb-8">
             <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-green-900 tracking-tight">
                لوحة المنجزات الرئيسية
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                نظرة شاملة على أبرز مؤشرات الأداء لجميع المشاريع
            </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label htmlFor="startDate" className="font-semibold text-gray-700">من تاريخ:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateInputChange}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-brand-green-500 focus:border-brand-green-500 p-2"
              aria-label="تاريخ البدء"
            />
            <label htmlFor="endDate" className="font-semibold text-gray-700">إلى تاريخ:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateInputChange}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-brand-green-500 focus:border-brand-green-500 p-2"
              aria-label="تاريخ الانتهاء"
            />
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
            icon={<BriefcaseIcon />} 
            label="إجمالي المشاريع" 
            value={stats.totalProjects} 
        />
        <StatCard 
            icon={<HourglassIcon />} 
            label="إجمالي الساعات التطوعية" 
            value={stats.totalVolunteerHours} 
        />
        <StatCard 
            icon={<UsersIcon />} 
            label="إجمالي المستفيدين" 
            value={stats.totalBeneficiaries} 
        />
        <StatCard 
            icon={<HeartIcon />} 
            label="رضا المستفيدين العام" 
            value={`${stats.overallSatisfaction.toFixed(0)}%`} 
        />
      </div>

      {summaryChart && summaryChart.data.datasets[0].data.length > 0 && (
          <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
              <ProjectChart chartConfig={summaryChart} />
          </div>
      )}

    </section>
  );
};

export default DashboardHeader;