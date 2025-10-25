import { useState, useEffect } from 'react';
import type { Project, Partner } from '../types';
import { processDashboardData } from '../utils/dataProcessor';
import { MOCK_API_DATA } from '../utils/mockData'; // Import mock data

// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnG6YSL9ZlHhxiK5srgSfAgJaB0il4DKnjaYkTm0LBfWBuuU0SAGEdJoHAAwsgFSL9/exec';

interface HeaderStats {
    totalBeneficiaries: number;
    projectCount: number;
    overallSatisfaction: number;
}

const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [headerStats, setHeaderStats] = useState<HeaderStats>({
        totalBeneficiaries: 0,
        projectCount: 0,
        overallSatisfaction: 0,
    });

    useEffect(() => {
        const loadMockData = () => {
            setLoading(true);
            // Simulate network delay
            setTimeout(() => {
                try {
                    const data = MOCK_API_DATA;

                    if (data.logo && data.logo.length > 0 && data.logo[0].logo) {
                        setLogoUrl(data.logo[0].logo);
                    }

                    const processed = processDashboardData(data);
                    setProjects(processed.projects);
                    setPartners(processed.partners);
                    setHeaderStats(processed.headerStats);

                } catch (error) {
                    console.error("Failed to process mock dashboard data:", error);
                    // Reset state on error
                    setProjects([]);
                    setPartners([]);
                    setLogoUrl('');
                    setHeaderStats({
                        totalBeneficiaries: 0,
                        projectCount: 0,
                        overallSatisfaction: 0,
                    });
                } finally {
                    setLoading(false);
                }
            }, 1500); // 1.5 second delay to show loading spinner
        };
        
        loadMockData();
    }, []);

    return { loading, projects, partners, headerStats, logoUrl };
};

export default useDashboardData;