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
    AlRifadaProjectRawRecord,
    Logo,
    SummaryStats,
    StatsData,
    ProjectProcessedData,
    ChartConfig
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
    processAlRifadaProjectData,
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

const filterRecordsByDate = <T extends { 'طابع زمني'?: string }>(records: T[], startDate: string, endDate: string): T[] => {
    if (!startDate || !endDate || !Array.isArray(records)) {
        return records;
    }
    try {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return records.filter(record => {
            const recordDateStr = record['طابع زمني'];
            if (!recordDateStr) return false;
            const recordDate = new Date(recordDateStr);
            return recordDate >= start && recordDate <= end;
        });
    } catch (e) {
        console.error("Error parsing dates for filtering:", e);
        return records;
    }
};


const useDashboardData = (dateRange: { startDate: string; endDate: string }) => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { startDate, endDate } = dateRange;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error state for new fetch attempt
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

                            let processedData: ProjectProcessedData;
                            switch (projectConfig.type) {
                                case 'wofood':
                                    const wofoodData = records as unknown as { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] };
                                    if(wofoodData['2024']) wofoodData['2024'] = filterRecordsByDate(wofoodData['2024'], startDate, endDate);
                                    if(wofoodData['2025']) wofoodData['2025'] = filterRecordsByDate(wofoodData['2025'], startDate, endDate);
                                    processedData = processWofoodProjectData(wofoodData);
                                    break;
                                case 'walak-al-ajer':
                                    const filteredWalak = filterRecordsByDate(records as WalakAlAjerRawRecord[], startDate, endDate);
                                    processedData = processWalakAlAjerData(filteredWalak);
                                    break;
                                case 'iftar':
                                    let iftarSatisfactionRecords: IftarSatisfactionRawRecord[] = [];
                                    if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        const cleanedSatisfaction = cleanKeys(rawSatisfactionRecords) as IftarSatisfactionRawRecord[];
                                        iftarSatisfactionRecords = filterRecordsByDate(cleanedSatisfaction, startDate, endDate);
                                    }
                                    const filteredIftar = filterRecordsByDate(records as IftarProjectRawRecord[], startDate, endDate);
                                    processedData = processIftarProjectData(filteredIftar, iftarSatisfactionRecords);
                                    break;
                                case 'suqia':
                                    let suqiaSatisfactionRecords: SuqiaSatisfactionRawRecord[] = [];
                                    if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        const cleanedSatisfaction = cleanKeys(rawSatisfactionRecords) as SuqiaSatisfactionRawRecord[];
                                        suqiaSatisfactionRecords = filterRecordsByDate(cleanedSatisfaction, startDate, endDate);
                                    }
                                    const filteredSuqia = filterRecordsByDate(records as SuqiaProjectRawRecord[], startDate, endDate);
                                    processedData = processSuqiaProjectData(filteredSuqia, suqiaSatisfactionRecords);
                                    break;
                                case 'translation':
                                    const filteredTranslation = filterRecordsByDate(records as TranslationProjectRawRecord[], startDate, endDate);
                                    processedData = processTranslationProjectData(filteredTranslation);
                                    break;
                                case 'quran-distribution':
                                    let quranSatisfactionRecords: QuranDistributionSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        const cleanedSatisfaction = cleanKeys(rawSatisfactionRecords) as QuranDistributionSatisfactionRawRecord[];
                                        quranSatisfactionRecords = filterRecordsByDate(cleanedSatisfaction, startDate, endDate);
                                    }
                                    const filteredQuran = filterRecordsByDate(records as QuranDistributionRawRecord[], startDate, endDate);
                                    processedData = processQuranDistributionData(filteredQuran, quranSatisfactionRecords);
                                    break;
                                case 'tamkeen':
                                    let tamkeenSatisfactionRecords: TamkeenSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        const cleanedSatisfaction = cleanKeys(rawSatisfactionRecords) as TamkeenSatisfactionRawRecord[];
                                        tamkeenSatisfactionRecords = filterRecordsByDate(cleanedSatisfaction, startDate, endDate);
                                    }
                                    const filteredTamkeen = filterRecordsByDate(records as TamkeenProjectRawRecord[], startDate, endDate);
                                    processedData = processTamkeenProjectData(filteredTamkeen, tamkeenSatisfactionRecords);
                                    break;
                                case 'ethra-and-athar':
                                    let ethraSatisfactionRecords: EthraAndAtharSatisfactionRawRecord[] = [];
                                     if(projectConfig.satisfactionDataSourceUrl) {
                                        const satisfactionData = await fetchJson(projectConfig.satisfactionDataSourceUrl);
                                        const rawSatisfactionRecords = Array.isArray(satisfactionData) ? satisfactionData : Object.values(satisfactionData).flat();
                                        const cleanedSatisfaction = cleanKeys(rawSatisfactionRecords) as EthraAndAtharSatisfactionRawRecord[];
                                        ethraSatisfactionRecords = filterRecordsByDate(cleanedSatisfaction, startDate, endDate);
                                    }
                                    const filteredEthra = filterRecordsByDate(records as EthraAndAtharRawRecord[], startDate, endDate);
                                    processedData = processEthraAndAtharData(filteredEthra, ethraSatisfactionRecords);
                                    break;
                                case 'al-rifada':
                                    const filteredRifada = filterRecordsByDate(records as AlRifadaProjectRawRecord[], startDate, endDate);
                                    processedData = processAlRifadaProjectData(filteredRifada);
                                    break;
                                default:
                                    throw new Error(`Unknown project type: ${projectConfig.type}`);
                            }

                            return {
                                name: projectConfig.name,
                                type: projectConfig.type,
                                data: processedData.stats,
                                chartData: processedData.chart,
                            };
                        } catch (e) {
                            console.error(`Error processing project ${projectConfig.name}:`, e);
                            return {
                                name: projectConfig.name,
                                type: projectConfig.type,
                                data: null,
                                chartData: null,
                                error: (e instanceof Error ? e.message : 'Unknown error'),
                            };
                        }
                    })
                );
                
                // Calculate Summary Stats
                let totalBeneficiaries = 0;
                let totalVolunteerHours = 0;
                const satisfactionScores: number[] = [];
                const summaryChartLabels: string[] = [];
                const summaryChartData: number[] = [];

                processedProjects.forEach(p => {
                    if (p.data && !p.error) {
                        const stats = p.data as StatsData;
                        let projectBeneficiaries = 0;
                        stats.forEach(stat => {
                            if (stat.label.includes('المستفيدين') || stat.label.includes('المستفيدات') || stat.label.includes('المستفيدون')) {
                                const value = Number(stat.value) || 0;
                                totalBeneficiaries += value;
                                projectBeneficiaries += value;
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
                        if (projectBeneficiaries > 0) {
                            summaryChartLabels.push(p.name);
                            summaryChartData.push(projectBeneficiaries);
                        }
                    }
                });
                
                const overallSatisfaction = satisfactionScores.length > 0
                    ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
                    : 0;
                
                const summaryChart: ChartConfig = {
                    type: 'bar',
                    data: {
                        labels: summaryChartLabels,
                        datasets: [{
                            label: 'إجمالي المستفيدين',
                            data: summaryChartData,
                            backgroundColor: '#22c55e',
                            borderColor: '#16a34a',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            title: { 
                                display: true, 
                                text: 'إجمالي المستفيدين حسب المشروع', 
                                font: { family: 'Cairo', size: 18 },
                                padding: { top: 10, bottom: 20 }
                            },
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                ticks: { font: { family: 'Cairo' } },
                            },
                            x: { ticks: { font: { family: 'Cairo' } } },
                        }
                    }
                };

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
                    summaryChart,
                });

            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if both dates are selected, or if both are empty (initial load/cleared filter).
        // This prevents fetching when only one date has been chosen.
        if ((startDate && endDate) || (!startDate && !endDate)) {
            fetchData();
        }
    }, [startDate, endDate]);

    return { data, loading, error };
};

export default useDashboardData;