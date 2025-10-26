import { useState, useEffect } from 'react';
import { 
    DashboardData, 
    Partner, 
    ProcessedProject, 
    WofoodProjectRecord,
    WalakAlAjerRawRecord,
    IftarProjectRawRecord,
    IftarSatisfactionRawRecord,
    SuqiaProjectRawRecord,
    SuqiaSatisfactionRawRecord,
    TranslationProjectRawRecord,
    Logo,
    SummaryStats,
    StatsData
} from '../types';
import { 
    PROJECTS_CONFIG, 
    PARTNERS_DATA_URL 
} from '../config/appConfig';
import {
    processWofoodProjectData,
    processWalakAlAjerData,
    processIftarProjectData,
    processSuqiaProjectData,
    processTranslationProjectData,
} from '../utils/dataProcessor';

// Helper function to fetch and parse JSON from a URL
const fetchJson = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
    }
    const json = await response.json();
    if (!json.success || !json.data) {
        throw new Error(`Invalid data structure from ${url}`);
    }
    return json.data;
};

// Helper to clean object keys (remove extra spaces)
const cleanKeys = (records: any[]): any[] => {
    return records.map(record => {
        const newRecord: { [key: string]: any } = {};
        for (const key in record) {
            const cleanedKey = key.replace(/\s+/g, ' ').trim();
            newRecord[cleanedKey] = record[key];
        }
        return newRecord;
    });
};

const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const logoAndPartnersData = await fetchJson(PARTNERS_DATA_URL);

                const processedProjects: ProcessedProject[] = await Promise.all(
                    PROJECTS_CONFIG.map(async (projectConfig): Promise<ProcessedProject> => {
                        try {
                            const mainData = await fetchJson(projectConfig.dataSourceUrl);
                            
                            let records = Array.isArray(mainData) ? mainData : Object.values(mainData).flat();
                            
                             if (projectConfig.type === 'wofood') {
                                const cleanedData: { [key: string]: any[] } = {};
                                for(const year in mainData) {
                                    cleanedData[year] = cleanKeys(mainData[year]);
                                }
                                records = cleanedData as any;
                            } else {
                                records = cleanKeys(records);
                            }

                            let processedData;
                            switch (projectConfig.type) {
                                case 'wofood':
                                    processedData = processWofoodProjectData(records as unknown as { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] });
                                    break;
                                case 'walak-al-ajer':
                                    processedData = processWalakAlAjerData(records as WalakAlAjerRawRecord[]);
                                    break;
                                case 'iftar':
                                    let iftarSatisfactionRecords: IftarSatisfactionRawRecord[] = [];
                                    if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        iftarSatisfactionRecords = cleanKeys(rawSatisfactionRecords) as IftarSatisfactionRawRecord[];
                                    }
                                    processedData = processIftarProjectData(records as IftarProjectRawRecord[], iftarSatisfactionRecords);
                                    break;
                                case 'suqia':
                                    let suqiaSatisfactionRecords: SuqiaSatisfactionRawRecord[] = [];
                                    if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        suqiaSatisfactionRecords = cleanKeys(rawSatisfactionRecords) as SuqiaSatisfactionRawRecord[];
                                    }
                                    processedData = processSuqiaProjectData(records as SuqiaProjectRawRecord[], suqiaSatisfactionRecords);
                                    break;
                                case 'translation':
                                    processedData = processTranslationProjectData(records);
                                    break;
                                default:
                                    throw new Error(`Unknown project type: ${projectConfig.type}`);
                            }

                            return {
                                name: projectConfig.name,
                                type: projectConfig.type,
                                data: processedData,
                            };
                        } catch (e) {
                            console.error(`Error processing project ${projectConfig.name}:`, e);
                            return {
                                name: projectConfig.name,
                                type: projectConfig.type,
                                data: null,
                                error: (e instanceof Error ? e.message : 'Unknown error'),
                            };
                        }
                    })
                );
                
                // Calculate Summary Stats
                let totalBeneficiaries = 0;
                let totalVolunteerHours = 0;
                const satisfactionScores: number[] = [];

                processedProjects.forEach(p => {
                    if (p.data && !p.error) {
                        const stats = p.data as StatsData;
                        stats.forEach(stat => {
                            if (stat.label === 'اجمالي المستفيدين') {
                                totalBeneficiaries += Number(stat.value) || 0;
                            }
                            if (stat.label.includes('الساعات التطوعية') || stat.label.includes('الساعات الإثرائية')) {
                                totalVolunteerHours += Number(stat.value) || 0;
                            }
                            if (stat.label.includes('رضا المستفيدين') && typeof stat.value === 'string') {
                                satisfactionScores.push(parseFloat(stat.value));
                            }
                        });
                    }
                });
                
                const overallSatisfaction = satisfactionScores.length > 0
                    ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
                    : 0;

                const summaryStats: SummaryStats = {
                    totalProjects: PROJECTS_CONFIG.length,
                    totalBeneficiaries,
                    totalVolunteerHours,
                    overallSatisfaction,
                };


                setData({
                    logoUrl: (logoAndPartnersData.Logo as Logo[])[0].logo,
                    partners: logoAndPartnersData.partenr as Partner[],
                    projects: processedProjects,
                    summaryStats,
                });

            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useDashboardData;