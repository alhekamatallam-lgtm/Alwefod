import { useState, useEffect } from 'react';
import { 
    DashboardData, 
    Partner, 
    Logo, 
    ProjectConfig, 
    ProcessedProject, 
    WofoodProjectRecord, 
    ComparisonData, 
    WalakAlAjerRawRecord,
    StatsData,
    StatItem
} from '../types';
import { processWofoodProjectData, processWalakAlAjerData } from '../utils/dataProcessor';
import { appConfig } from '../config/appConfig';

const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Logo and Partners
                const logoPartnersResponse = await fetch(appConfig.logoAndPartnersUrl);
                if (!logoPartnersResponse.ok) throw new Error(`Failed to fetch logo and partners`);
                const logoPartnersData = await logoPartnersResponse.json();
                const logoUrl = logoPartnersData.data.Logo[0]?.logo || '';
                const partners = logoPartnersData.data.partenr || [];

                // 2. Fetch all projects concurrently
                const projectPromises = appConfig.projects.map(async (projectConfig: ProjectConfig): Promise<ProcessedProject> => {
                    try {
                        const response = await fetch(projectConfig.dataSourceUrl);
                        if (!response.ok) {
                           throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const projectData = await response.json();

                        const cleanRecordKeys = (records: any[]): any[] => {
                            if (!Array.isArray(records)) return [];
                            return records.map(record => {
                                const cleanedRecord: any = {};
                                for (const key in record) {
                                    // Trim whitespace from start/end and collapse multiple spaces inside to one
                                    const cleanedKey = key.trim().replace(/\s+/g, ' ');
                                    cleanedRecord[cleanedKey] = record[key];
                                }
                                return cleanedRecord;
                            });
                        };

                        if (projectConfig.type === 'comparison' && projectData.data) {
                            const rawData = projectData.data as { '2024': any[], '2025': any[] };
                            
                            const cleanedData = {
                                '2024': cleanRecordKeys(rawData['2024']) as WofoodProjectRecord[],
                                '2025': cleanRecordKeys(rawData['2025']) as WofoodProjectRecord[],
                            };
                            
                            const processed = processWofoodProjectData(cleanedData);
                            return { 
                                name: projectConfig.name, 
                                type: 'comparison', 
                                data: processed,
                                totalBeneficiaries: processed.stats2024.totalBeneficiaries + processed.stats2025.totalBeneficiaries
                            };
                        } else if (projectConfig.type === 'stats' && projectData.data) {
                             const recordsObject = projectData.data as { [sheetName: string]: any[] };
                             const firstSheetName = Object.keys(recordsObject)[0];
                             if (!firstSheetName) throw new Error("No data sheets found");

                             const rawRecords = recordsObject[firstSheetName];
                             if (!Array.isArray(rawRecords)) throw new Error("Data is not an array");

                             const records = cleanRecordKeys(rawRecords) as WalakAlAjerRawRecord[];
                             
                             const processedData = processWalakAlAjerData(records);
                             const totalBeneficiariesStat = processedData.stats.find(s => s.label === 'اجمالي المستفيدين');
                             const totalBeneficiaries = totalBeneficiariesStat && typeof totalBeneficiariesStat.value === 'number' 
                                  ? totalBeneficiariesStat.value 
                                  : 0;

                             return {
                                name: projectConfig.name,
                                type: 'stats',
                                data: processedData,
                                totalBeneficiaries: totalBeneficiaries
                             }
                        }
                        
                        throw new Error("Invalid project type or data structure");

                    } catch (e) {
                        console.error(`Failed to process project ${projectConfig.name}:`, e);
                        return { 
                            name: projectConfig.name, 
                            type: projectConfig.type, 
                            error: e instanceof Error ? e.message : 'Unknown error' 
                        };
                    }
                });

                const projects = await Promise.all(projectPromises);
                
                setData({ logoUrl, partners, projects });

            } catch (e) {
                console.error("Failed to fetch dashboard data:", e);
                setError(e instanceof Error ? e : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useDashboardData;