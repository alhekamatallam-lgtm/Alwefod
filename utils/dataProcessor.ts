import { 
    ComparisonStats, 
    ComparisonData, 
    StatsData,
    WofoodProjectRecord,
    WalakAlAjerRawRecord,
    IftarProjectRawRecord,
    IftarSatisfactionRawRecord,
    SuqiaProjectRawRecord,
    SuqiaSatisfactionRawRecord,
    TranslationProjectRawRecord
} from '../types';

const sum = (records: any[], key: string) => records.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
const countUnique = (records: any[], key: string, normalizeFn?: (value: string) => string) => {
    const uniqueValues = new Set(
        records.map(r => r[key])
               .filter(Boolean)
               .map(v => typeof v === 'string' ? (normalizeFn ? normalizeFn(v) : v.trim()) : v)
    );
    return uniqueValues.size;
}
const normalizeDelegationName = (name: string) => {
    return name.trim().replace(/^(الوفد|وفد)\s+/i, '');
};

export const processWofoodProjectData = (data: { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] }): ComparisonData => {
    const calculateStats = (records: WofoodProjectRecord[]): ComparisonStats => ({
        totalBeneficiaries: sum(records, 'عدد المستفيدين'),
        implementedDelegations: countUnique(records, 'اسم الوفد', normalizeDelegationName),
        implementedPrograms: sum(records, 'عدد البرامج العلمية'),
        enrichmentHours: sum(records, 'عدد الساعات'),
    });

    return {
        stats2024: calculateStats(data['2024'] || []),
        stats2025: calculateStats(data['2025'] || []),
    };
};

export const processWalakAlAjerData = (records: WalakAlAjerRawRecord[]): StatsData => {
    const volunteerHours = sum(records, 'الساعات التطوعية للفترة الأولى') + sum(records, 'عدد الساعات التطوعية (الفترة الثانية)');
    const funerals = sum(records, 'عدد المستفيدين من الجنائز للفترة الثانية') + sum(records, 'عدد المستفيدين من الجنائز في الفترة الأولى');
    const wheelchairs = sum(records, 'عدد المستفيدين من العربات في الفترة الأولى') + sum(records, 'عدد المستفيدين في العربات للفترة الثانية');
    const perfuming = sum(records, 'عدد المستفيدين من التطيب في الفترة الأولى');
    const wristbands = sum(records, 'عدد المستفيدين من الأساور للفترة الثانية') + sum(records, 'عدد المستفيدين في الأساور للفترة الأولى');
    const totalBeneficiaries = funerals + wheelchairs + perfuming + wristbands;

    return [
        { label: 'اجمالي المستفيدين', value: totalBeneficiaries, icon: 'UsersIcon' },
        { label: 'الساعات التطوعية', value: volunteerHours, icon: 'HourglassIcon' },
        { label: 'الجنائـــز', value: funerals, icon: 'BriefcaseIcon' },
        { label: 'الــــعـربات', value: wheelchairs, icon: 'WheelchairIcon' },
        { label: 'التطيب', value: perfuming, icon: 'IncenseBurnerIcon' },
        { label: 'الاساور', value: wristbands, icon: 'WristbandIcon' },
    ];
};

export const processIftarProjectData = (mainRecords: IftarProjectRawRecord[], satisfactionRecords: IftarSatisfactionRawRecord[]): StatsData => {
    const stats: StatsData = [
        { label: 'اجمالي الوجبات', value: sum(mainRecords, 'العـدد الكلي للوجبات؟'), icon: 'FoodIcon' },
        { label: 'اجمالي فريق العمل', value: sum(mainRecords, 'اجمالي عدد العمال والمشرفين'), icon: 'UsersIcon' },
        { label: 'عدد المشرفين', value: sum(mainRecords, 'عدد المشرفين'), icon: 'BriefcaseIcon' },
    ];

    if (satisfactionRecords.length > 0) {
        const satisfactionKeys = Object.keys(satisfactionRecords[0]).filter(key => key.startsWith('ما مدى رضاك'));
        let totalScore = 0;
        let totalResponses = 0;
        satisfactionRecords.forEach(record => {
            satisfactionKeys.forEach(key => {
                const score = Number(record[key as keyof IftarSatisfactionRawRecord]);
                if (!isNaN(score)) {
                    totalScore += score;
                    totalResponses++;
                }
            });
        });
        const averageSatisfaction = totalResponses > 0 ? (totalScore / totalResponses) / 5 * 100 : 0;
        stats.push({ label: 'رضا المستفيدين', value: `${averageSatisfaction.toFixed(0)}%`, icon: 'HeartIcon' });
    }

    return stats;
};

export const processSuqiaProjectData = (records: SuqiaProjectRawRecord[], satisfactionRecords?: SuqiaSatisfactionRawRecord[]): StatsData => {
    const stats: StatsData = [
        { label: 'اجمالي العبوات', value: sum(records, 'كم العـدد الكلي للعبوات؟'), icon: 'DropletIcon' },
        { label: 'عدد العمال', value: sum(records, 'عدد العمال'), icon: 'UsersIcon' },
        { label: 'عدد المشرفين', value: sum(records, 'عدد المشرفين'), icon: 'BriefcaseIcon' },
        { label: 'نقاط التوزيع', value: countUnique(records, 'مكان توزيع سقيا الماء؟'), icon: 'GlobeIcon' },
    ];
    
    if (satisfactionRecords && satisfactionRecords.length > 0) {
        const satisfactionKeys = Object.keys(satisfactionRecords[0]).filter(key => key.startsWith('ما مدى رضاك') || key.startsWith('هل المياه'));
        let totalScore = 0;
        let totalResponses = 0;
        satisfactionRecords.forEach(record => {
            satisfactionKeys.forEach(key => {
                const score = Number(record[key as keyof SuqiaSatisfactionRawRecord]);
                if (!isNaN(score)) {
                    totalScore += score;
                    totalResponses++;
                }
            });
        });
        const averageSatisfaction = totalResponses > 0 ? (totalScore / totalResponses) / 5 * 100 : 0;
        stats.push({ label: 'رضا المستفيدين', value: `${averageSatisfaction.toFixed(0)}%`, icon: 'HeartIcon' });
    }

    return stats;
};

export const processTranslationProjectData = (records: TranslationProjectRawRecord[]): StatsData => {
    const languages = new Set<string>();
    records.forEach(record => {
        const langString = record['ماهي اللغات المستخدمة في الترجمة؟'];
        if (typeof langString === 'string' && langString.trim()) {
            langString.split(/[,،]/).forEach(lang => {
                const trimmedLang = lang.trim();
                if (trimmedLang) languages.add(trimmedLang);
            });
        }
    });

    return [
        { label: 'اجمالي المستفيدين', value: sum(records, 'عدد المستفيدين:'), icon: 'UsersIcon' },
        { label: 'عدد الأسئلة', value: sum(records, 'عدد الأسئلة؟'), icon: 'BookOpenIcon' },
        { label: 'الساعات التطوعية', value: sum(records, 'عدد الساعات التطوعية:'), icon: 'HourglassIcon' },
        { label: 'عدد اللغات', value: languages.size, icon: 'GlobeIcon' },
    ];
};