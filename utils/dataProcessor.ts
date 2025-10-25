import { ProjectRecord, ProjectStats } from '../types';

/**
 * Processes an array of project records to calculate aggregate statistics.
 * @param records - An array of ProjectRecord objects.
 * @returns An object of type ProjectStats with calculated totals.
 */
export const processProjectData = (records: ProjectRecord[]): ProjectStats => {
  if (!records || !Array.isArray(records) || records.length === 0) {
    return {
      enrichmentHours: 0,
      implementedPrograms: 0,
      implementedDelegations: 0,
      totalBeneficiaries: 0,
    };
  }

  const initialStats = {
    enrichmentHours: 0,
    implementedPrograms: 0,
    totalBeneficiaries: 0,
  };

  const aggregatedStats = records.reduce((acc, record) => {
    // Ensure that values are numbers before adding
    acc.enrichmentHours += Number(record['عدد الساعات']) || 0;
    acc.implementedPrograms += Number(record['عدد البرامج العلمية']) || 0;
    acc.totalBeneficiaries += Number(record['عدد المستفيدين']) || 0;
    return acc;
  }, initialStats);

  // Count unique delegations by their name
  const implementedDelegations = new Set(
    records.map(record => record['اسم الوفد']?.trim()).filter(Boolean)
  ).size;

  return {
    ...aggregatedStats,
    implementedDelegations,
  };
};
