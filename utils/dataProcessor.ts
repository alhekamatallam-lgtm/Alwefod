import { WofoodProjectRecord, ComparisonStats, ComparisonData, WalakAlAjerRawRecord, StatsData, StatItem } from '../types';

const cleanDelegationName = (name: string): string => {
    if (!name) return '';
    return name.trim().replace(/^(الوفد|وفد)\s+/i, '');
};

const calculateWofoodStats = (records: WofoodProjectRecord[]): ComparisonStats => {
    if (!records || !Array.isArray(records)) {
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
        acc.enrichmentHours += Number(record['عدد الساعات']) || 0;
        acc.implementedPrograms += Number(record['عدد البرامج العلمية']) || 0;
        acc.totalBeneficiaries += Number(record['عدد المستفيدين']) || 0;
        return acc;
    }, initialStats);

    const implementedDelegations = new Set(
        records.map(record => cleanDelegationName(record['اسم الوفد'])).filter(Boolean)
    ).size;

    return {
        ...aggregatedStats,
        implementedDelegations,
    };
};


export const processWofoodProjectData = (data: { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] }): ComparisonData => {
    const stats2024 = calculateWofoodStats(data['2024']);
    const stats2025 = calculateWofoodStats(data['2025']);
    return { stats2024, stats2025 };
};

export const processWalakAlAjerData = (records: WalakAlAjerRawRecord[]): StatsData => {
    if (!records || !Array.isArray(records)) {
        return { stats: [] };
    }

    const totals = records.reduce((acc, record) => {
        acc.volunteerHours += Number(record['الساعات التطوعية للفترة الأولى']) || 0;
        acc.volunteerHours += Number(record['عدد الساعات التطوعية (الفترة الثانية)']) || 0;

        acc.funerals += Number(record['عدد المستفيدين من الجنائز للفترة الثانية']) || 0;
        acc.funerals += Number(record['عدد المستفيدين من الجنائز في الفترة الأولى']) || 0;

        acc.carts += Number(record['عدد المستفيدين من العربات في الفترة الأولى']) || 0;
        acc.carts += Number(record['عدد المستفيدين في العربات للفترة الثانية']) || 0;
        
        acc.perfuming += Number(record['عدد المستفيدين من التطيب في الفترة الأولى']) || 0;

        acc.bracelets += Number(record['عدد المستفيدين من الأساور للفترة الثانية']) || 0;
        acc.bracelets += Number(record['عدد المستفيدين في الأساور للفترة الأولى']) || 0;

        return acc;
    }, {
        volunteerHours: 0,
        funerals: 0,
        carts: 0,
        perfuming: 0,
        bracelets: 0,
    });

    const totalBeneficiaries = totals.funerals + totals.carts + totals.perfuming + totals.bracelets;

    const stats: StatItem[] = [
        { label: 'اجمالي المستفيدين', value: totalBeneficiaries, icon: 'UsersIcon' },
        { label: 'الساعات التطوعية', value: totals.volunteerHours, icon: 'BriefcaseIcon' },
        { label: 'الجنائـــز', value: totals.funerals, icon: 'HeartIcon' },
        { label: 'الــــعـربات', value: totals.carts, icon: 'WheelchairIcon' },
        { label: 'الاساور', value: totals.bracelets, icon: 'GiftIcon' },
        { label: 'التطيب', value: totals.perfuming, icon: 'BookOpenIcon' },
    ];

    return { stats };
};