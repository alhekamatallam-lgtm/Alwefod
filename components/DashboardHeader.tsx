import React from 'react';
import { SummaryStats } from '../types';
import StatCard from './StatCard';
import HeartIcon from './icons/HeartIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import HourglassIcon from './icons/HourglassIcon';


interface DashboardHeaderProps {
  stats: SummaryStats;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ stats }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={<HeartIcon />} 
            label="رضا المستفيدين العام" 
            value={`${stats.overallSatisfaction.toFixed(0)}%`} 
        />
        <StatCard 
            icon={<BriefcaseIcon />} 
            label="إجمالي المشاريع" 
            value={stats.totalProjects} 
        />
        <StatCard 
            icon={<UsersIcon />} 
            label="إجمالي المستفيدين" 
            value={stats.totalBeneficiaries} 
        />
        <StatCard 
            icon={<HourglassIcon />} 
            label="إجمالي الساعات التطوعية" 
            value={stats.totalVolunteerHours} 
        />
      </div>
    </section>
  );
};

export default DashboardHeader;