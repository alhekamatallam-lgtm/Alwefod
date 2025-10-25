import { useState, useEffect } from 'react';
import { MOCK_API_DATA } from '../utils/mockData';
import { processDashboardData } from '../utils/dataProcessor';
import type { Project, Partner } from '../types';

interface HeaderStats {
    totalBeneficiaries: number;
    projectCount: number;
    overallSatisfaction: number;
}

const LOGO_API_URL = 'https://script.google.com/macros/s/AKfycbzw846YftubKOJoi_Rj_keXEo8Sd3aEFeE89emw-zneoJWAs8UdI7QIpNwuQ08EP-7JZg/exec';

const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [headerStats, setHeaderStats] = useState<HeaderStats>({ totalBeneficiaries: 0, projectCount: 0, overallSatisfaction: 0 });
    const [projects, setProjects] = useState<Project[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Step 1: Fetch the live logo
                const response = await fetch(LOGO_API_URL);
                if (!response.ok) {
                    throw new Error(`فشل الاتصال بمصدر الشعار. الحالة: ${response.status}`);
                }
                const logoData = await response.json();
                
                // Extract logo URL based on the exact structure provided
                const url = logoData?.data?.Logo?.[0]?.logo;
                if (typeof url === 'string' && url.length > 0) {
                    setLogoUrl(url);
                } else {
                    // This is a critical failure as per the user's request.
                    throw new Error("لم يتم العثور على رابط الشعار بالهيكلية المتوقعة في استجابة قاعدة البيانات.");
                }

                // Step 2: Process the stable mock data for the rest of the dashboard
                // This ensures the dashboard UI is fully functional while testing the live logo connection.
                const processedData = processDashboardData(MOCK_API_DATA);
                setHeaderStats(processedData.headerStats);
                setProjects(processedData.projects);
                setPartners(processedData.partners);
                
            } catch (err: any) {
                console.error("فشل في جلب أو معالجة البيانات:", err);
                setError(err.message || 'حدث خطأ غير معروف.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { loading, logoUrl, headerStats, projects, partners, error };
};

export default useDashboardData;
