import React from 'react';
import { Partner } from '../types';

interface PartnersSectionProps {
  partners: Partner[];
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <footer className="bg-white py-16 px-4 sm:px-6 lg:px-8 mt-auto border-t">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-green-800 mb-12">
          شركاء النجاح
        </h2>
        <div className="flex flex-row flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8">
          {partners.map((partner) => (
            <div key={partner['الشريك']} title={partner['الشريك']} className="flex justify-center">
              <img 
                src={partner['الشعار']} 
                alt={partner['الشريك']} 
                className="max-h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out cursor-pointer" 
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default PartnersSection;