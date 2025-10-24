import React, { useState, useEffect } from 'react';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import HeartIcon from './icons/HeartIcon';

interface DashboardHeaderProps {
    totalBeneficiaries: number;
    projectCount: number;
    overallSatisfaction: number;
    loading: boolean;
}

const AnimatedNumber: React.FC<{ value: number; isPercentage?: boolean }> = ({ value, isPercentage = false }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (value === 0) {
            setDisplayValue(0);
            return;
        }

        const duration = 1500; // ms
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            const currentValue = Math.round(value * easedProgress);

            setDisplayValue(currentValue);

            if (frame === totalFrames) {
                clearInterval(counter);
                setDisplayValue(value);
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [value]);

    return (
        <p className="text-4xl lg:text-5xl font-extrabold text-brand-green-900 font-mono">
            {displayValue.toLocaleString('en-US')}
            {isPercentage && <span className="text-3xl">%</span>}
        </p>
    );
};

const DashboardHeaderSkeleton = () => (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-12 border border-white overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x-reverse md:divide-gray-200">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-3"></div>
                    <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
                </div>
            ))}
        </div>
    </div>
);


const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    totalBeneficiaries,
    projectCount,
    overallSatisfaction,
    loading
}) => {
    if (loading) {
        return <DashboardHeaderSkeleton />;
    }

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-12 border border-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x-reverse md:divide-gray-200">
                
                <div className="p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
                        <UsersIcon className="h-9 w-9 text-blue-600" />
                    </div>
                    <AnimatedNumber value={totalBeneficiaries} />
                    <p className="text-base font-medium text-gray-600 mt-1">إجمالي المستفيدين</p>
                </div>

                <div className="p-6 flex flex-col items-center text-center border-t border-gray-100 md:border-t-0 transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-3">
                        <BriefcaseIcon className="h-9 w-9 text-purple-600" />
                    </div>
                    <AnimatedNumber value={projectCount} />
                    <p className="text-base font-medium text-gray-600 mt-1">عدد المشاريع</p>
                </div>

                <div className="p-6 flex flex-col items-center text-center border-t border-gray-100 md:border-t-0 transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-3">
                        <HeartIcon className="h-9 w-9 text-red-600" />
                    </div>
                    <AnimatedNumber value={overallSatisfaction} isPercentage={true} />
                    <p className="text-base font-medium text-gray-600 mt-1">الرضا العام</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
