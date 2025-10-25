import { useState, useEffect } from 'react';
import type { Project, Partner } from '../types';
import { MOCK_API_DATA } from '../utils/mockData';
import { processDashboardData } from '../utils/dataProcessor';

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
        const fetchData = () => {
            // Simulate API call delay to mimic real-world loading
            setTimeout(() => {
                try {
                    // Extract the logo URL directly from the mock data source
                    const logo = MOCK_API_DATA.logo?.[0]?.logo || '';
                    setLogoUrl(logo);

                    // Process the rest of the data for subsequent steps
                    const { projects, partners, headerStats } = processDashboardData(MOCK_API_DATA);
                    setProjects(projects);
                    setPartners(partners);
                    setHeaderStats(headerStats);

                } catch (error) {
                    console.error("Failed to process mock data:", error);
                    // In case of an error, ensure the app doesn't stay in a loading state
                } finally {
                    setLoading(false);
                }
            }, 1000); // 1-second delay for visual confirmation of the loading spinner
        };

        fetchData();
    }, []);

    return { loading, projects, partners, headerStats, logoUrl };
};

export default useDashboardData;
