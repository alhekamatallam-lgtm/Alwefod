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
    QuranDistributionRawRecord,
    QuranDistributionSatisfactionRawRecord,
    TamkeenProjectRawRecord,
    TamkeenSatisfactionRawRecord,
    EthraAndAtharRawRecord,
    EthraAndAtharSatisfactionRawRecord,
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
    processQuranDistributionData,
    processTamkeenProjectData,
    processEthraAndAtharData,
} from '../utils/dataProcessor';

// Helper function to fetch and parse JSON from a URL, with cache busting
const fetchJson = async (url: string) => {
    const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}cache_bust=${new Date().getTime()}`;
    const response = await fetch(cacheBustUrl);
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
                                case 'quran-distribution':
                                    let quranSatisfactionRecords: QuranDistributionSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        quranSatisfactionRecords = cleanKeys(rawSatisfactionRecords) as QuranDistributionSatisfactionRawRecord[];
                                    }
                                    processedData = processQuranDistributionData(records as QuranDistributionRawRecord[], quranSatisfactionRecords);
                                    break;
                                case 'tamkeen':
                                    let tamkeenSatisfactionRecords: TamkeenSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        tamkeenSatisfactionRecords = cleanKeys(rawSatisfactionRecords) as TamkeenSatisfactionRawRecord[];
                                    }
                                    processedData = processTamkeenProjectData(records as TamkeenProjectRawRecord[], tamkeenSatisfactionRecords);
                                    break;
                                case 'ethra-and-athar':
                                    let ethraSatisfactionRecords: EthraAndAtharSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        ethraSatisfactionRecords = cleanKeys(rawSatisfactionRecords) as EthraAndAtharSatisfactionRawRecord[];
                                    }
                                    processedData = processEthraAndAtharData(records as EthraAndAtharRawRecord[], ethraSatisfactionRecords);
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
                            if (stat.label.includes('المستفيدين') || stat.label.includes('المستفيدات')) {
                                totalBeneficiaries += Number(stat.value) || 0;
                            }
                            if (stat.label.includes('الساعات التطوعية') || stat.label.includes('الساعات الإثرائية') || stat.label.includes('الساعات التدريبية')) {
                                totalVolunteerHours += Number(stat.value) || 0;
                            }
                            if (stat.label.includes('رضا المستفيدين') && typeof stat.value === 'string') {
                                const score = parseFloat(stat.value);
                                if (score > 0) {
                                    satisfactionScores.push(score);
                                }
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