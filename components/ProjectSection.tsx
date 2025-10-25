import React, { useState, useMemo } from 'react';
import type { Project } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UsersIcon from './icons/UsersIcon';
import HeartIcon from './icons/HeartIcon';
import GlobeIcon from './icons/GlobeIcon';
import GiftIcon from './icons/GiftIcon';
import DropletIcon from './icons/DropletIcon';

const ICONS: { [key: string]: React.FC<any> } = {
    UsersIcon,
    HeartIcon,
    GlobeIcon,
    GiftIcon,
    DropletIcon,
};

const PerformanceIndicator = ({ oldValue, newValue }: { oldValue: number; newValue: number }) => {
    if (oldValue === 0) {
        if (newValue > 0) {
            return <span className="flex items-center justify-center gap-1 text-green-600 font-medium"><ArrowUpIcon className="w-4 h-4" /> جديد</span>;
        }
        return <span className="text-gray-500">-</span>;
    }
    if (newValue === oldValue) {
        return <span className="text-gray-500">-</span>;
    }

    const change = ((newValue - oldValue) / oldValue) * 100;
    const isPositive = change > 0;

    return (
        <div className={`flex items-center justify-center gap-1 font-mono font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
            {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(0)}%</span>
        </div>
    );
};

const ProgressBar = ({ value }: { value: number }) => {
    const percentage = Math.max(0, Math.min(100, value));
    let bgColor = 'bg-red-500';
    if (percentage > 70) bgColor = 'bg-yellow-500';
    if (percentage > 85) bgColor = 'bg-green-500';

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const formatValue = (statKey: string, value: number | undefined) => {
    const num = value ?? 0;
    if (statKey === 'satisfactionPercentage') {
        return (
            <div className="flex items-center gap-3">
                <span className="font-mono text-base sm:text-lg w-14 sm:w-16 text-right">{num.toFixed(1)}%</span>
                <ProgressBar value={num} />
            </div>
        );
    }
    return <span className="font-mono text-base sm:text-lg">{num.toLocaleString('en-US')}</span>;
};

const ProjectSection: React.FC<{ project: Project }> = ({ project }) => {
    const [isTableVisible, setIsTableVisible] = useState(false);
    const { name, stats, years, statRows, icon } = project;
    const isSimpleView = years.length === 0;

    const Icon = icon ? ICONS[icon] : null;

    const primaryStat = useMemo(() => {
        const primaryStatConfig = statRows[0];
        if (!primaryStatConfig || !stats?.total) return { label: '', value: '0' };
        
        const value = stats.total[primaryStatConfig.statKey] ?? 0;
        return {
            label: primaryStatConfig.label,
            value: value.toLocaleString('en-US'),
        };
    }, [statRows, stats]);

    const averageIndicator = useMemo(() => {
        if (!stats || years.length < 2) {
            return { value: 0, hasData: false };
        }

        const statKeys = statRows.map(row => row.statKey);
        const changes: number[] = [];

        statKeys.forEach(key => {
            const oldValue = stats?.[years[0]]?.[key];
            const newValue = stats?.[years[1]]?.[key];
            if (oldValue && oldValue > 0) {
                const change = (((newValue ?? 0) - oldValue) / oldValue) * 100;
                changes.push(change);
            } else if (newValue && newValue > 0) {
                changes.push(200); // Cap "new" growth at 200% for a stable average
            }
        });
        
        if (changes.length === 0) {
            return { value: 0, hasData: false };
        }

        const averageChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        
        return { value: averageChange, hasData: true };

    }, [stats, years, statRows]);

    return (
        <div className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto overflow-hidden transition-all duration-300 ease-in-out">
          <div 
            className="flex justify-between items-center p-4 sm:p-6 md:p-8 cursor-pointer hover:bg-gray-50/50"
            onClick={() => setIsTableVisible(!isTableVisible)}
            aria-expanded={isTableVisible}
            aria-controls={`comparison-table-${name.replace(/\s/g, '-')}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsTableVisible(!isTableVisible)}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              {Icon && <div className="bg-brand-green-100 p-2 sm:p-3 rounded-lg"><Icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-green-700" /></div>}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{name}</h2>
                <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500">{primaryStat.label}: <span className="font-bold text-brand-green-800 font-mono text-sm sm:text-base">{primaryStat.value}</span></p>
                    {averageIndicator.hasData && (
                        <div className={`flex items-center gap-1 font-mono font-bold text-sm px-3 py-1 rounded-full ${averageIndicator.value >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} dir="ltr">
                            {averageIndicator.value >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                            <span>{Math.abs(averageIndicator.value).toFixed(0)}%</span>
                        </div>
                    )}
                </div>
              </div>
            </div>
            <ChevronDownIcon className={`w-7 h-7 text-gray-400 transition-transform duration-300 ${isTableVisible ? 'rotate-180 text-brand-green-700' : ''}`} />
          </div>
          
          <div 
            id={`comparison-table-${name.replace(/\s/g, '-')}`}
            className={`transition-all duration-500 ease-in-out grid ${isTableVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
            <div className="overflow-hidden">
                <div className="px-4 pb-4 sm:px-6 md:px-8 sm:pb-6 md:pb-8">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-slate-50/30">
                        <table className="w-full text-right table-auto">
                        <thead className="border-b-2 border-gray-200">
                            <tr className="bg-slate-50">
                                <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase text-gray-600 tracking-wider text-right">المنجز</th>
                                { !isSimpleView && years.map(year => (
                                    <th key={year} className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase text-gray-600 tracking-wider text-center">{year}</th>
                                ))}
                                { !isSimpleView && years.length > 1 &&
                                    <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase text-gray-600 tracking-wider text-center">المؤشر</th>
                                }
                                <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase text-brand-green-800 tracking-wider text-center">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {statRows.map(rowConfig => (
                                <tr key={rowConfig.statKey} className="odd:bg-white even:bg-slate-50/70">
                                    <td className="p-3 sm:p-4 font-medium text-gray-800 text-sm sm:text-base">{rowConfig.label}</td>
                                    { !isSimpleView && years.map(year => (
                                        <td key={year} className="p-3 sm:p-4 text-center text-gray-700">
                                            {formatValue(rowConfig.statKey, stats?.[year]?.[rowConfig.statKey])}
                                        </td>
                                    ))}
                                    { !isSimpleView && years.length > 1 && (
                                        <td className="p-3 sm:p-4 text-center">
                                            <PerformanceIndicator 
                                                oldValue={stats?.[years[0]]?.[rowConfig.statKey] || 0} 
                                                newValue={stats?.[years[1]]?.[rowConfig.statKey] || 0} 
                                            />
                                        </td>
                                    )}
                                    <td className={`p-3 sm:p-4 text-center font-bold ${rowConfig.statKey !== 'satisfactionPercentage' ? 'text-brand-green-800' : 'text-gray-800'}`}>
                                        {formatValue(rowConfig.statKey, stats?.['total']?.[rowConfig.statKey])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
};

export default ProjectSection;