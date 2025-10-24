import React from 'react';
import type { Partner } from '../types';

interface PartnersSectionProps {
    partners: Partner[];
    loading: boolean;
}

const PartnersSectionSkeleton: React.FC = () => (
    <div className="text-center mt-16 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-8"></div>
        <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-32 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
    </div>
);

const PartnersSection: React.FC<PartnersSectionProps> = ({ partners, loading }) => {
    if (loading) {
        return <PartnersSectionSkeleton />;
    }
    
    if (!partners || partners.length === 0) {
        return null;
    }

    return (
        <section className="text-center mt-16 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-8">شركاء النجاح</h2>
            <div className="flex justify-center items-center flex-wrap gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-8">
                {partners.map((partner) => (
                    <div key={partner.الشريك} className="group">
                         <img 
                            src={partner.الشعار} 
                            alt={`شعار ${partner.الشريك}`} 
                            className="h-16 sm:h-20 max-w-[120px] sm:max-w-[150px] object-contain filter grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
                            />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PartnersSection;