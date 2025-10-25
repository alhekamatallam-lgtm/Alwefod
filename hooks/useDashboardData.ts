import { useState, useEffect } from 'react';
import type { Project, Partner } from '../types';

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
        // Data loading is disabled as per the user's request.
        // Immediately set loading to false.
        setLoading(false);
    }, []);

    return { loading, projects, partners, headerStats, logoUrl };
};

export default useDashboardData;
