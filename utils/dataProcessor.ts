import type {
    WofoodProjectData,
    WalakAlAjrProjectData,
    TranslationProjectData,
    IftarProjectData,
    IftarSatisfactionData,
    SuqiaProjectData,
    SuqiaSatisfactionData,
    Partner,
    Project,
    CalculatedStats,
    YearlyStats,
} from '../types';

// --- HELPER FUNCTIONS ---
const safeParseInt = (value: any): number => {
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? 0 : parsed;
};

const getYearFromDate = (dateString: string): string => {
    if (!dateString || typeof dateString !== 'string') return 'unknown';
    return dateString.split('-')[0];
};

const calculateSatisfaction = (data: any[], keys: string[]): number => {
    if (!data || data.length === 0) return 0;
    let totalScore = 0;
    let totalEntries = 0;
    data.forEach(item => {
        keys.forEach(key => {
            const score = safeParseInt(item[key]);
            if (score > 0 && score <= 5) { // Assuming a 1-5 scale
                totalScore += score;
                totalEntries++;
            }
        });
    });
    if (totalEntries === 0) return 0;
    const averageScore = totalScore / totalEntries;
    return (averageScore / 5) * 100;
};

const processYearlyData = <T>(data: T[], yearExtractor: (item: T) => string, processor: (item: T) => CalculatedStats): YearlyStats => {
    const yearlyStats: YearlyStats = {};

    data.forEach(item => {
        const year = yearExtractor(item);
        if (!yearlyStats[year]) {
            yearlyStats[year] = {};
        }
        const itemStats = processor(item);
        for (const key in itemStats) {
            yearlyStats[year][key] = (yearlyStats[year][key] || 0) + itemStats[key];
        }
    });

    return yearlyStats;
};

const calculateTotals = (yearlyStats: YearlyStats): CalculatedStats => {
    const total: CalculatedStats = {};
    Object.values(yearlyStats).forEach(yearStats => {
        for (const key in yearStats) {
            total[key] = (total[key] || 0) + yearStats[key];
        }
    });
    return total;
};

// --- PROJECT-SPECIFIC PROCESSORS ---

const processWofoodData = (data: WofoodProjectData[]): Project => {
    const yearlyStats = processYearlyData(
        data,
        item => getYearFromDate(item["تاريخ التنفيذ"]),
        item => ({
            beneficiaries: safeParseInt(item["عدد المستفيدين"]),
            volunteerHours: safeParseInt(item["عدد الساعات"]),
            programs: safeParseInt(item["عدد البرامج العلمية"]) + safeParseInt(item["عدد البرامج الثقافية"]) + safeParseInt(item["عدد البرامج الاجتماعية"]) + safeParseInt(item["عدد الجولات"]),
        })
    );
    
    // Calculate unique nationalities per year
    const nationalitiesByYear: { [year: string]: Set<string> } = {};
    data.forEach(item => {
        const year = getYearFromDate(item["تاريخ التنفيذ"]);
        if (!nationalitiesByYear[year]) nationalitiesByYear[year] = new Set();
        nationalitiesByYear[year].add(item["الجنسية"]);
    });
    for(const year in nationalitiesByYear){
        if(yearlyStats[year]) yearlyStats[year]['nationalities'] = nationalitiesByYear[year].size;
    }

    const total = calculateTotals(yearlyStats);
    total['nationalities'] = new Set(data.map(i => i['الجنسية'])).size;

    return {
        name: 'مشروع وفود الحرم',
        icon: 'UsersIcon',
        stats: { ...yearlyStats, total },
        years: Object.keys(yearlyStats).sort(),
        statRows: [
            { label: 'عدد المستفيدين', statKey: 'beneficiaries' },
            { label: 'عدد الجنسيات', statKey: 'nationalities' },
            { label: 'ساعات العمل التطوعية', statKey: 'volunteerHours' },
            { label: 'عدد البرامج المنفذة', statKey: 'programs' },
        ],
    };
};

const processWalakAlAjrData = (data: WalakAlAjrProjectData[]): Project => {
    const stats = {
        beneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["عدد المستفيدين من الجنائز في الفترة الأولى"]) + safeParseInt(item["عدد المستفيدين من الجنائز للفترة الثانية"]) + safeParseInt(item["عدد المستفيدين من العربات  في الفترة الأولى"]) + safeParseInt(item["عدد المستفيدين في العربات للفترة الثانية"]) + safeParseInt(item["عدد المستفيدين في الأساور للفترة الأولى"]) + safeParseInt(item["عدد المستفيدين من الأساور للفترة الثانية"]), 0),
        volunteerHours: data.reduce((sum, item) => sum + safeParseInt(item["الساعات التطوعية  للفترة الأولى"]) + safeParseInt(item["عدد الساعات التطوعية  (الفترة الثانية)"]), 0),
        funeralBeneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["عدد المستفيدين من الجنائز في الفترة الأولى"]) + safeParseInt(item["عدد المستفيدين من الجنائز للفترة الثانية"]), 0),
        wheelchairBeneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["عدد المستفيدين من العربات  في الفترة الأولى"]) + safeParseInt(item["عدد المستفيدين في العربات للفترة الثانية"]), 0),
        braceletBeneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["عدد المستفيدين في الأساور للفترة الأولى"]) + safeParseInt(item["عدد المستفيدين من الأساور للفترة الثانية"]), 0),
    };
    return {
        name: 'مشروع ولك الأجر',
        icon: 'HeartIcon',
        stats: { total: stats },
        years: [],
        statRows: [
            { label: 'إجمالي المستفيدين', statKey: 'beneficiaries' },
            { label: 'ساعات العمل التطوعية', statKey: 'volunteerHours' },
            { label: 'مستفيدي خدمة الجنائز', statKey: 'funeralBeneficiaries' },
            { label: 'مستفيدي خدمة العربات', statKey: 'wheelchairBeneficiaries' },
            { label: 'مستفيدي خدمة الأساور', statKey: 'braceletBeneficiaries' },
        ]
    }
}

const processTranslationData = (data: TranslationProjectData[]): Project => {
    const stats = {
        beneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["عدد المستفيدين:"]), 0),
        questionsAnswered: data.reduce((sum, item) => sum + safeParseInt(item["عدد الأسئلة؟"]), 0),
        volunteerHours: data.reduce((sum, item) => sum + safeParseInt(item["عدد الساعات التطوعية:"]), 0),
        booksDistributed: data.reduce((sum, item) => sum + safeParseInt(item["عدد الكتب التي تم توزيعها:"]), 0),
    };
     return {
        name: 'مشروع الإرشاد والترجمة',
        icon: 'GlobeIcon',
        stats: { total: stats },
        years: [],
        statRows: [
            { label: 'عدد المستفيدين', statKey: 'beneficiaries' },
            { label: 'عدد الأسئلة المجابة', statKey: 'questionsAnswered' },
            { label: 'ساعات العمل التطوعية', statKey: 'volunteerHours' },
            { label: 'عدد الكتب الموزعة', statKey: 'booksDistributed' },
        ]
    }
}

const processIftarData = (data: IftarProjectData[], satisfactionData: IftarSatisfactionData[]): Project => {
    const stats = {
        beneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["العـدد الكلي للوجبات؟"]), 0),
        lowCalorieMeals: data.reduce((sum, item) => sum + safeParseInt(item["عـدد الوجبات ذات السعرات الحرارية المُنخفضة؟"]), 0),
        satisfactionPercentage: calculateSatisfaction(satisfactionData, ["ما مدى رضاك عن تعامل المشرف مع العمال والمستفيدين؟ ", "ما مدى رضاك عن تعامل العمال مع المستفيدين؟", "ما مدى رضاك عن مظهر فريق العمل ؟ ", "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟\n(فريق العمل : المشرفين - الموزعين أو العمال) ", "ما مدى رضاك عن الوقت المستغرق  لتوزيع الوجبات؟", "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟", "ما مدى رضاك عن نظافة المكان بعد الانتهاء من التوزيع؟", "ما مدى رضاك عن وجبات الإفطار ؟"]),
    };
    return {
        name: 'مشروع إفطار صائم',
        icon: 'GiftIcon',
        stats: { total: stats },
        years: [],
        statRows: [
            { label: 'عدد الوجبات الموزعة', statKey: 'beneficiaries' },
            { label: 'وجبات منخفضة السعرات', statKey: 'lowCalorieMeals' },
            { label: 'مؤشر رضا المستفيدين', statKey: 'satisfactionPercentage' },
        ]
    }
};

const processSuqiaData = (data: SuqiaProjectData[], satisfactionData: SuqiaSatisfactionData[]): Project => {
    const stats = {
        beneficiaries: data.reduce((sum, item) => sum + safeParseInt(item["كم العـدد الكلي للعبوات؟"]), 0),
        distributionPoints: data.reduce((sum, item) => sum + safeParseInt(item["عدد نقاط التوزيع"]), 0),
        satisfactionPercentage: calculateSatisfaction(satisfactionData, ["ما مدى رضاك عن تواصل المشرف مع العمال والمستفيدين؟ ", "ما مدى رضاك عن مظهر فريق العمل ؟ ", "ما مدى رضاك عن تعامل العمال مع المستفيدين؟", "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟", "ما مدى رضاك عن الوقت المستغرق في التوزيع؟", "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟", "ما مدى رضاك عن عبـــوات المياه ؟", "هل المياه مُبردة بشكل مناسب؟"]),
    };
    return {
        name: 'مشروع سقيا الماء',
        icon: 'DropletIcon',
        stats: { total: stats },
        years: [],
        statRows: [
            { label: 'عدد العبوات الموزعة', statKey: 'beneficiaries' },
            { label: 'عدد نقاط التوزيع', statKey: 'distributionPoints' },
            { label: 'مؤشر رضا المستفيدين', statKey: 'satisfactionPercentage' },
        ]
    }
};

// --- MAIN ORCHESTRATOR ---

export const processDashboardData = (apiData: any) => {
    const { wofood, walakAlAjr, translation, iftar, iftarSatisfaction, suqia, suqiaSatisfaction, partners } = apiData;

    const wofoodProject = processWofoodData(wofood || []);
    const walakAlAjrProject = processWalakAlAjrData(walakAlAjr || []);
    const translationProject = processTranslationData(translation || []);
    const iftarProject = processIftarData(iftar || [], iftarSatisfaction || []);
    const suqiaProject = processSuqiaData(suqia || [], suqiaSatisfaction || []);

    const projects: Project[] = [wofoodProject, walakAlAjrProject, translationProject, iftarProject, suqiaProject];

    const totalBeneficiaries = projects.reduce((sum, p) => sum + (p.stats.total?.beneficiaries || 0), 0);
    
    const satisfactionScores = projects
        .map(p => p.stats.total?.satisfactionPercentage)
        .filter(s => s !== undefined && s > 0) as number[];
    const overallSatisfaction = satisfactionScores.length > 0
        ? satisfactionScores.reduce((sum, s) => sum + s, 0) / satisfactionScores.length
        : 0;

    const headerStats = {
        totalBeneficiaries,
        projectCount: projects.length,
        overallSatisfaction: Math.round(overallSatisfaction),
    };

    return {
        projects,
        partners: (partners || []) as Partner[],
        headerStats,
    };
};