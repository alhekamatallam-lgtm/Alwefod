import { 
    StatsData,
    WofoodProjectRecord,
    WalakAlAjerRawRecord,
    IftarProjectRawRecord,
    IftarSatisfactionRawRecord,
    SuqiaProjectRawRecord,
    SuqiaSatisfactionRawRecord
} from '../types';

// --- Robust Number Parsing ---

const easternArabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const westernArabicNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts a string containing Eastern Arabic numerals to Western Arabic numerals.
 * @param s The string to convert.
 * @returns The converted string.
 */
const convertNumerals = (s: string): string => {
    let result = s;
    for (let i = 0; i < easternArabicNumerals.length; i++) {
        result = result.replace(new RegExp(easternArabicNumerals[i], 'g'), westernArabicNumerals[i]);
    }
    return result;
};

/**
 * Parses a number from a value of any type, with support for various formats.
 * Handles numbers, strings, null/undefined, Eastern Arabic numerals, and thousands separators.
 * @param value The value to parse.
 * @returns A number, or null if parsing fails.
 */
const parseFlexibleNumber = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;

    const strValue = String(value).trim();
    if (strValue === '') return null;
    
    // Standardize numerals and separators
    const westernStr = convertNumerals(strValue);
    const cleanedStr = westernStr.replace(/[,٬]/g, '');

    // parseFloat handles cases like "123 text" by parsing "123"
    const num = parseFloat(cleanedStr);

    return isNaN(num) ? null : num;
};


// A new, robust sum function using the flexible parser
const sum = (records: any[], key: string): number => {
    return records.reduce((acc, curr) => {
        const value = curr[key];
        const parsedNum = parseFlexibleNumber(value);
        if (parsedNum !== null) {
            return acc + parsedNum;
        }
        return acc;
    }, 0);
};

const countUnique = (records: any[], key: string, normalizeFn?: (value: string) => string) => {
    const uniqueValues = new Set(
        records.map(r => r[key])
               .filter(Boolean)
               // Exclude header row value which is often identical to the key
               .filter(v => v !== key) 
               .map(v => typeof v === 'string' ? (normalizeFn ? normalizeFn(v) : v.trim()) : v)
    );
    return uniqueValues.size;
}

const normalizeDelegationName = (name: string) => {
    // Normalize by unifying different forms of Alef, but keep prefixes to distinguish delegations.
    return name.trim()
        .replace(/أ|إ|آ/g, 'ا');
};

export const processWofoodProjectData = (data: { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] }): StatsData => {
    const allRecords = [...(data['2024'] || []), ...(data['2025'] || [])];

    // This logic now benefits from the more robust `sum` function.
    const totalBeneficiaries = sum(allRecords, 'عدد المستفيدين');
    const implementedDelegations = countUnique(allRecords, 'اسم الوفد', normalizeDelegationName);
    const implementedPrograms = sum(allRecords, 'عدد البرامج العلمية');
    const enrichmentHours = sum(allRecords, 'عدد الساعات');

    return [
        { label: 'اجمالي المستفيدين', value: totalBeneficiaries, icon: 'UsersIcon' },
        { label: 'الوفـــود المنفذة', value: implementedDelegations, icon: 'BriefcaseIcon' },
        { label: 'البرامج المنفذة', value: implementedPrograms, icon: 'BookOpenIcon' },
        { label: 'الساعات الإثرائية', value: enrichmentHours, icon: 'HourglassIcon' },
    ];
};

export const processWalakAlAjerData = (records: WalakAlAjerRawRecord[]): StatsData => {
    const volunteerHours = sum(records, 'الساعات التطوعية للفترة الأولى') + sum(records, 'عدد الساعات التطوعية (الفترة الثانية)');
    const funerals = sum(records, 'عدد المستفيدين من الجنائز للفترة الثانية') + sum(records, 'عدد المستفيدين من الجنائز في الفترة الأولى');
    const wheelchairs = sum(records, 'عدد المستفيدين من العربات في الفترة الأولى') + sum(records, 'عدد المستفيدين في العربات للفترة الثانية');
    const perfuming = sum(records, 'عدد المستفيدين من التطيب في الفترة الأولى');
    const wristbands = sum(records, 'عدد المستفيدين من الأساور للفترة الثانية') + sum(records, 'عدد المستفيدين في الأساور للفترة الأولى');
    const totalBeneficiaries = volunteerHours + funerals + wheelchairs + perfuming + wristbands;

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
        { label: 'اجمالي المستفيدين', value: sum(mainRecords, 'العـدد الكلي للوجبات؟'), icon: 'FoodIcon' },
        { label: 'اجمالي فريق العمل', value: sum(mainRecords, 'اجمالي عدد العمال والمشرفين'), icon: 'UsersIcon' },
        { label: 'عدد المشرفين', value: sum(mainRecords, 'عدد المشرفين'), icon: 'BriefcaseIcon' },
    ];

    if (satisfactionRecords.length > 0) {
        const satisfactionKeys = Object.keys(satisfactionRecords[0]).filter(key => key.startsWith('ما مدى رضاك'));
        let totalScore = 0;
        let totalResponses = 0;
        satisfactionRecords.forEach(record => {
            satisfactionKeys.forEach(key => {
                const score = parseFlexibleNumber(record[key as keyof IftarSatisfactionRawRecord]);
                if (score !== null) {
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
        { label: 'اجمالي المستفيدين', value: sum(records, 'كم العـدد الكلي للعبوات؟'), icon: 'DropletIcon' },
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
                const score = parseFlexibleNumber(record[key as keyof SuqiaSatisfactionRawRecord]);
                if (score !== null) {
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

export const processTranslationProjectData = (records: any[]): StatsData => {
    let totalBeneficiaries = 0;
    let totalQuestions = 0;
    let totalVolunteerHours = 0;
    const languages = new Set<string>();

    const keyMappings = {
        beneficiaries: 'عدد المستفيدين',
        questions: 'عدد الأسئلة',
        hours: 'الساعات التطوعية',
        languages: 'اللغات المستخدمة',
    };

    records.forEach(record => {
        if (typeof record !== 'object' || record === null) return;

        // Find actual keys in the record object by substring matching
        const beneficiariesKey = Object.keys(record).find(k => k.includes(keyMappings.beneficiaries));
        const questionsKey = Object.keys(record).find(k => k.includes(keyMappings.questions));
        const hoursKey = Object.keys(record).find(k => k.includes(keyMappings.hours));
        const languagesKey = Object.keys(record).find(k => k.includes(keyMappings.languages));

        // Sum values using the robust parser
        if (beneficiariesKey) {
            const num = parseFlexibleNumber(record[beneficiariesKey]);
            if (num !== null) totalBeneficiaries += num;
        }
        if (questionsKey) {
            const num = parseFlexibleNumber(record[questionsKey]);
            if (num !== null) totalQuestions += num;
        }
        if (hoursKey) {
            const num = parseFlexibleNumber(record[hoursKey]);
            if (num !== null) totalVolunteerHours += num;
        }
        
        // Process languages, avoiding counting the header row
        if (languagesKey) {
            const langString = record[languagesKey];
            if (typeof langString === 'string' && langString.trim() && langString.trim().toLowerCase() !== languagesKey.toLowerCase()) {
                langString.split(/[,،]/).forEach(lang => {
                    const trimmedLang = lang.trim();
                    if (trimmedLang) languages.add(trimmedLang);
                });
            }
        }
    });

    return [
        { label: 'اجمالي المستفيدين', value: totalBeneficiaries, icon: 'UsersIcon' },
        { label: 'عدد الأسئلة', value: totalQuestions, icon: 'BookOpenIcon' },
        { label: 'الساعات التطوعية', value: totalVolunteerHours, icon: 'HourglassIcon' },
        { label: 'عدد اللغات', value: languages.size, icon: 'GlobeIcon' },
    ];
};
