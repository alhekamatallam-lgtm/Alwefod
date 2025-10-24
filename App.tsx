import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { WofoodProjectData, WalakAlAjrProjectData, TranslationProjectData, IftarProjectData, SuqiaProjectData, SuqiaSatisfactionData, IftarSatisfactionData, CalculatedStats, Project, YearlyStats, StatRowConfig, Partner } from './types';
import ProjectSection from './components/ProjectSection';
import DashboardHeader from './components/DashboardHeader';
import PartnersSection from './components/PartnersSection';

// Icons for projects
import UsersIcon from './components/icons/UsersIcon';
import GiftIcon from './components/icons/GiftIcon';
import GlobeIcon from './components/icons/GlobeIcon';
import MoonIcon from './components/icons/MoonIcon';
import DropletIcon from './components/icons/DropletIcon';

const WOFOOD_DATA_URL = 'https://script.google.com/macros/s/AKfycbyBgajCWTGfNUHP6YC1bIXvu5_tbIN1vlos-OWAvdLMrvraa2In7e8O-2cArHz606al/exec';
const WALAK_AL_AJR_DATA_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhBZTyrNgKn9_CUZAqICeTTdg9u3FoLHIKHAePipL4fBDwTSFG2OKse4RuotQE4PeYk4GoTeLRBMmrdSis7sC4DF2ceuMIJ3Cuyx2m1UQNh_aCpowCAlrlG6BvMHzyORQDu1RqUx1y5WhOyI6Vsb0F4Bh7Cb5INPullzVNhVlucZ0pITxvP0waJJruMkxJfRNCBT0KZ2Eq48by4GQ8k2tD_TnGviNVZvBxtOVsGSL9bczguXWH_X8iGjBmxG0E0U6tgvQlU0VKfwkS8DOCpCRFUM-QgZm77jqh8VFlI&lib=Msed_r78BGEfAVeAMqFN8CDZf8yMvwf_T';
const TRANSLATION_PROJECT_DATA_URL = 'https://script.google.com/macros/s/AKfycbxevA_BDka-q7vH4AHGx2731u0JXwYEAYoztfaQlFE1SBqQgoDB3R507f3bop9B5CZ9eA/exec';
const IFTAR_PROJECT_DATA_URL = 'https://script.google.com/macros/s/AKfycbycEDvGx3SyFtvHij0HWY1Lhh99cAUfjJUpiRmHeP5pN0c5OhZ-f1BmZMcP8nTo8qSpwQ/exec';
const SUQIA_PROJECT_DATA_URL = 'https://script.google.com/macros/s/AKfycbxQY0GXQJab87U4VdjgI5U72woxmlJSONbqwiJQn_ozoQTUBlmSP3fTqYf5v7LYG109/exec';
const SUQIA_SATISFACTION_DATA_URL = 'https://script.google.com/macros/s/AKfycbzNdp9V2S-Uu8Mnt6V60wV9R0Q3pUDvsaMGUmuFme9fZm5ewpjv3s62ah8PE2G5lvUeDw/exec';
const IFTAR_SATISFACTION_DATA_URL = 'https://script.google.com/macros/s/AKfycbxHlN__ylDXLRIRxhOgdj00bmcEAkyeU_Yt9VTu_WH6gqIAQQ7eJNzma-Pk-5oNEVNhEA/exec';
const FALLBACK_LOGO_URL = 'https://wofood.org.sa/img/logo.png';

const cleanRecordKeys = (record: any): {[key: string]: any} | null => {
    if (typeof record !== 'object' || record === null) return null;
    const newRow: {[key: string]: any} = {};
    for (const key in record) {
      newRow[key.trim()] = record[key];
    }
    return newRow;
};

const safeParseInt = (value: any): number => {
    if (value === null || value === undefined) return 0;
    // Remove commas and then parse
    const strValue = String(value).replace(/,/g, '');
    const num = parseInt(strValue, 10);
    return isNaN(num) ? 0 : num;
};


// --- Processor for "Wofood Al Haram" Project ---
const processWofoodProject = (jsonData: any): Project | null => {
    const calculateWofoodStats = (data: WofoodProjectData[]): CalculatedStats => {
      const uniqueDelegations = new Set<string>();
      const totals = data.reduce((acc, item) => {
        acc.totalHours += safeParseInt(item['عدد الساعات']);
        acc.totalBeneficiaries += safeParseInt(item['عدد المستفيدين']);
        acc.totalPrograms += safeParseInt(item['عدد البرامج العلمية']);
        if (item['اسم الوفد']) {
            const delegationName = String(item['اسم الوفد']).trim();
            if (delegationName) uniqueDelegations.add(delegationName);
        }
        return acc;
      }, { totalHours: 0, totalBeneficiaries: 0, totalPrograms: 0 });
      return { ...totals, uniqueDelegations: uniqueDelegations.size };
    };

    const projectYears = Object.keys(jsonData.data).filter(key => !isNaN(parseInt(key, 10))).sort();
    if (projectYears.length === 0) return null;

    const yearlyData: {[key: string]: WofoodProjectData[]} = {};
    const allRecords: WofoodProjectData[] = [];

    projectYears.forEach(year => {
        const records = jsonData.data[year] as any[];
        const cleanedRecords = records.map(cleanRecordKeys).filter(Boolean) as WofoodProjectData[];
        yearlyData[year] = cleanedRecords;
        allRecords.push(...cleanedRecords);
    });

    const calculatedYearlyStats: YearlyStats = {};
    projectYears.forEach(year => {
        calculatedYearlyStats[year] = calculateWofoodStats(yearlyData[year]);
    });
    
    const totalStats = calculateWofoodStats(allRecords);
    totalStats.uniqueDelegations = new Set(allRecords.map(r => String(r['اسم الوفد']).trim()).filter(Boolean)).size;
    calculatedYearlyStats['total'] = totalStats;

    const statRows: StatRowConfig[] = [
        { label: "اجمالي المستفيدين", statKey: "totalBeneficiaries" },
        { label: "الوفود المنفذة", statKey: "uniqueDelegations" },
        { label: "البرامج المنفذة", statKey: "totalPrograms" },
        { label: "عدد الساعات الإثرائية", statKey: "totalHours" },
    ];
    
    return { name: 'مشروع وفود الحرم', stats: calculatedYearlyStats, years: projectYears, statRows, icon: UsersIcon };
};

// --- Processor for "Walak Al Ajr" Project ---
const processWalakAlAjrProject = (jsonData: any): Project | null => {
    const calculateWalakAlAjrStats = (data: WalakAlAjrProjectData[]): CalculatedStats => {
        return data.reduce((acc, item) => {
            const volunteerHours = safeParseInt(item['الساعات التطوعية  للفترة الأولى']) + safeParseInt(item['عدد الساعات التطوعية  (الفترة الثانية)']);
            const funerals = safeParseInt(item['عدد المستفيدين من الجنائز في الفترة الأولى']) + safeParseInt(item['عدد المستفيدين من الجنائز للفترة الثانية']);
            const carts = safeParseInt(item['عدد المستفيدين من العربات  في الفترة الأولى']) + safeParseInt(item['عدد المستفيدين في العربات للفترة الثانية']);
            const bracelets = safeParseInt(item['عدد المستفيدين في الأساور للفترة الأولى']) + safeParseInt(item['عدد المستفيدين من الأساور للفترة الثانية']);
            const perfuming = safeParseInt(item['عدد المستفيدين من التطيب  في الفترة الأولى']);
            
            acc.volunteerHours += volunteerHours;
            acc.funerals += funerals;
            acc.carts += carts;
            acc.bracelets += bracelets;
            acc.perfuming += perfuming;
            // User requested to sum all services including volunteer hours for the total.
            acc.totalBeneficiaries += (funerals + carts + bracelets + perfuming + volunteerHours);
            return acc;
        }, { totalBeneficiaries: 0, volunteerHours: 0, funerals: 0, carts: 0, bracelets: 0, perfuming: 0 });
    };
    
    const allRecords: WalakAlAjrProjectData[] = [];
    if (jsonData.data && typeof jsonData.data === 'object') {
        for (const key in jsonData.data) {
            if (Array.isArray(jsonData.data[key])) {
                const records = jsonData.data[key] as any[];
                const cleanedRecords = records.map(cleanRecordKeys).filter(Boolean) as WalakAlAjrProjectData[];
                allRecords.push(...cleanedRecords);
            }
        }
    }

    if (allRecords.length === 0) return null;

    const calculatedTotalStats = calculateWalakAlAjrStats(allRecords);
    
    const yearlyStats: YearlyStats = {
        'total': calculatedTotalStats
    };

    const statRows: StatRowConfig[] = [
        { label: "إجمالي المستفيدين", statKey: "totalBeneficiaries" },
        { label: "الساعات التطوعية", statKey: "volunteerHours" },
        { label: "خدمة الجنائز", statKey: "funerals" },
        { label: "خدمة العربات", statKey: "carts" },
        { label: "خدمة الأساور", statKey: "bracelets" },
        { label: "خدمة التطيب", statKey: "perfuming" },
    ];

    return { name: 'مشروع ولك الأجر', stats: yearlyStats, years: [], statRows, icon: GiftIcon };
};


// --- Processor for "Translation and Guidance" Project ---
const processTranslationProject = (jsonData: any): Project | null => {
    const calculateTranslationStats = (data: TranslationProjectData[]): CalculatedStats => {
      const uniqueTranslators = new Set<string>();
      const uniqueLanguages = new Set<string>();

      const totals = data.reduce((acc, item) => {
        acc.totalBeneficiaries += safeParseInt(item['عدد المستفيدين:']);
        acc.totalHours += safeParseInt(item['عدد الساعات التطوعية:']);
        acc.totalQuestions += safeParseInt(item['عدد الأسئلة؟']);
        acc.totalGuidance += safeParseInt(item['عدد مرات الإرشاد المكاني:']);
        acc.totalBooks += safeParseInt(item['عدد الكتب التي تم توزيعها:']);

        if (item['اسم المترجم:']) {
            const translatorName = String(item['اسم المترجم:']).trim();
            if (translatorName) uniqueTranslators.add(translatorName);
        }

        if (item['ماهي اللغات المستخدمة في الترجمة؟']) {
            const languages = String(item['ماهي اللغات المستخدمة في الترجمة؟']).split(',');
            languages.forEach(lang => {
                const trimmedLang = lang.trim();
                if (trimmedLang) uniqueLanguages.add(trimmedLang);
            });
        }

        return acc;
      }, { 
          totalBeneficiaries: 0, 
          totalHours: 0, 
          totalQuestions: 0,
          totalGuidance: 0,
          totalBooks: 0
      });

      return { 
          ...totals, 
          uniqueTranslators: uniqueTranslators.size,
          uniqueLanguages: uniqueLanguages.size,
      };
    };

    if (!jsonData.data || !jsonData.data.first || !Array.isArray(jsonData.data.first)) {
        return null;
    }
    
    const allRecords: TranslationProjectData[] = (jsonData.data.first as any[])
        .map(cleanRecordKeys)
        .filter(Boolean) as TranslationProjectData[];

    if (allRecords.length === 0) return null;

    const calculatedTotalStats = calculateTranslationStats(allRecords);
    
    const yearlyStats: YearlyStats = {
        'total': calculatedTotalStats
    };

    const statRows: StatRowConfig[] = [
        { label: "إجمالي المستفيدين", statKey: "totalBeneficiaries" },
        { label: "عدد المترجمين", statKey: "uniqueTranslators" },
        { label: "الساعات التطوعية", statKey: "totalHours" },
        { label: "الأسئلة المجابة", statKey: "totalQuestions" },
        { label: "عدد اللغات", statKey: "uniqueLanguages" },
        { label: "خدمات الإرشاد المكاني", statKey: "totalGuidance" },
        { label: "الكتب الموزعة", statKey: "totalBooks" },
    ];

    return { name: 'مشروع الترجمة والإرشاد', stats: yearlyStats, years: [], statRows, icon: GlobeIcon };
};

// --- Processor for "Iftar" Project ---
const processIftarProject = (jsonData: any, satisfactionJsonData?: any): Project | null => {
    const calculateIftarStats = (data: IftarProjectData[]): CalculatedStats => {
        const uniqueReporters = new Set<string>();
        const totals = data.reduce((acc, item) => {
            acc.totalMeals += safeParseInt(item['العـدد الكلي للوجبات؟']);
            acc.totalWorkers += safeParseInt(item['اجمالي عدد العمال والمشرفين']);
            acc.totalLowCalorieMeals += safeParseInt(item['عـدد الوجبات ذات السعرات الحرارية المُنخفضة؟']);

            if (item['مُعد التقرير']) {
                const reporterName = String(item['مُعد التقرير']).trim();
                if (reporterName) uniqueReporters.add(reporterName);
            }
            return acc;
        }, { totalMeals: 0, totalWorkers: 0, totalLowCalorieMeals: 0 });
        
        return { 
            ...totals, 
            uniqueReporters: uniqueReporters.size,
        };
    };

    const calculateSatisfaction = (data: IftarSatisfactionData[]): number => {
        const ratingKeys: (keyof IftarSatisfactionData)[] = [
            "ما مدى رضاك عن تعامل المشرف مع العمال والمستفيدين؟ ",
            "ما مدى رضاك عن تعامل العمال مع المستفيدين؟",
            "ما مدى رضاك عن مظهر فريق العمل ؟ ",
            "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟\n(فريق العمل : المشرفين - الموزعين أو العمال) ",
            "ما مدى رضاك عن الوقت المستغرق  لتوزيع الوجبات؟",
            "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟",
            "ما مدى رضاك عن نظافة المكان بعد الانتهاء من التوزيع؟",
            "ما مدى رضاك عن وجبات الإفطار ؟",
        ];
        
        let totalScore = 0;
        let totalRatings = 0;

        data.forEach(response => {
            ratingKeys.forEach(key => {
                const score = response[key];
                if (typeof score === 'number' && !isNaN(score)) {
                    totalScore += score;
                    totalRatings++;
                }
            });
        });

        if (totalRatings === 0) return 0;
        
        const averageScore = totalScore / totalRatings;
        const percentage = (averageScore / 5) * 100;
        return percentage;
    };
    
    if (!jsonData.data || !jsonData.data.respon || !Array.isArray(jsonData.data.respon)) {
        return null;
    }

    const allRecords: IftarProjectData[] = (jsonData.data.respon as any[])
        .map(cleanRecordKeys)
        .filter(Boolean) as IftarProjectData[];

    if (allRecords.length === 0) return null;

    const calculatedTotalStats = calculateIftarStats(allRecords);

    // Note the key is "respone" not "response" in the provided JSON structure
    if (satisfactionJsonData?.data?.respone) {
      const satisfactionRecords = (satisfactionJsonData.data.respone as any[])
        .map(cleanRecordKeys)
        .filter(Boolean) as IftarSatisfactionData[];
      calculatedTotalStats.satisfactionPercentage = calculateSatisfaction(satisfactionRecords);
    } else {
      calculatedTotalStats.satisfactionPercentage = 0;
    }

    const yearlyStats: YearlyStats = {
        'total': calculatedTotalStats
    };

    const statRows: StatRowConfig[] = [
        { label: "إجمالي الوجبات الموزعة", statKey: "totalMeals" },
        { label: "إجمالي العمال والمشرفين", statKey: "totalWorkers" },
        { label: "الوجبات منخفضة السعرات", statKey: "totalLowCalorieMeals" },
        { label: "عدد معدي التقارير", statKey: "uniqueReporters" },
        { label: "مستوى رضا المستفيدين", statKey: "satisfactionPercentage" },
    ];

    return { name: 'مشروع تفطير الصائمين', stats: yearlyStats, years: [], statRows, icon: MoonIcon };
};

// --- Processor for "Suqia" Project ---
const processSuqiaProject = (jsonData: any, satisfactionJsonData?: any): Project | null => {
    const calculateSuqiaStats = (data: SuqiaProjectData[]): CalculatedStats => {
        const uniqueReporters = new Set<string>();
        const uniqueDistributionPoints = new Set<string>();

        const totals = data.reduce((acc, item) => {
            acc.totalBottles += safeParseInt(item['كم العـدد الكلي للعبوات؟']);
            acc.totalWorkers += safeParseInt(item['عدد العمال']);

            if (item['مُعد التقرير']) {
                const reporterName = String(item['مُعد التقرير']).trim();
                if (reporterName) uniqueReporters.add(reporterName);
            }
            if (item['مكان توزيع سقيا الماء؟']) {
                // Normalize whitespace to correctly identify unique locations
                const location = String(item['مكان توزيع سقيا الماء؟']).replace(/\s+/g, ' ').trim();
                if (location) uniqueDistributionPoints.add(location);
            }
            return acc;
        }, { totalBottles: 0, totalWorkers: 0 });
        
        return { 
            ...totals,
            distributionPoints: uniqueDistributionPoints.size,
            uniqueReporters: uniqueReporters.size,
        };
    };
    
    const calculateSatisfaction = (data: SuqiaSatisfactionData[]): number => {
        const ratingKeys: (keyof SuqiaSatisfactionData)[] = [
            "ما مدى رضاك عن تواصل المشرف مع العمال والمستفيدين؟ ",
            "ما مدى رضاك عن مظهر فريق العمل ؟ ",
            "ما مدى رضاك عن تعامل العمال مع المستفيدين؟",
            "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟",
            "ما مدى رضاك عن الوقت المستغرق في التوزيع؟",
            "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟",
            "ما مدى رضاك عن عبـــوات المياه ؟",
            "هل المياه مُبردة بشكل مناسب؟",
        ];
        
        let totalScore = 0;
        let totalRatings = 0;

        data.forEach(response => {
            ratingKeys.forEach(key => {
                const score = response[key];
                if (typeof score === 'number' && !isNaN(score)) {
                    totalScore += score;
                    totalRatings++;
                }
            });
        });

        if (totalRatings === 0) return 0;
        
        const averageScore = totalScore / totalRatings;
        const percentage = (averageScore / 5) * 100;
        return percentage;
    };


    if (!jsonData.data || !jsonData.data.respon || !Array.isArray(jsonData.data.respon)) {
        return null;
    }

    const allRecords: SuqiaProjectData[] = (jsonData.data.respon as any[])
        .map(cleanRecordKeys)
        .filter(Boolean) as SuqiaProjectData[];

    if (allRecords.length === 0) return null;

    const calculatedTotalStats = calculateSuqiaStats(allRecords);

    if (satisfactionJsonData?.data?.response) {
      const satisfactionRecords = (satisfactionJsonData.data.response as any[])
        .map(cleanRecordKeys)
        .filter(Boolean) as SuqiaSatisfactionData[];
      calculatedTotalStats.satisfactionPercentage = calculateSatisfaction(satisfactionRecords);
    } else {
      calculatedTotalStats.satisfactionPercentage = 0;
    }


    const yearlyStats: YearlyStats = {
        'total': calculatedTotalStats
    };

    const statRows: StatRowConfig[] = [
        { label: "إجمالي العبوات الموزعة", statKey: "totalBottles" },
        { label: "إجمالي العمال", statKey: "totalWorkers" },
        { label: "عدد نقاط التوزيع", statKey: "distributionPoints" },
        { label: "عدد معدي التقارير", statKey: "uniqueReporters" },
        { label: "مستوى رضا المستفيدين", statKey: "satisfactionPercentage" },
    ];

    return { name: 'مشروع السقيا', stats: yearlyStats, years: [], statRows, icon: DropletIcon };
};


const ProjectSectionSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto mt-8 overflow-hidden animate-pulse">
        <div className="flex justify-between items-center p-6 md:p-8">
            <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(FALLBACK_LOGO_URL);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [wofoodResponse, walakAlAjrResponse, translationResponse, iftarResponse, suqiaResponse, suqiaSatisfactionResponse, iftarSatisfactionResponse] = await Promise.all([
        fetch(WOFOOD_DATA_URL),
        fetch(WALAK_AL_AJR_DATA_URL),
        fetch(TRANSLATION_PROJECT_DATA_URL),
        fetch(IFTAR_PROJECT_DATA_URL),
        fetch(SUQIA_PROJECT_DATA_URL),
        fetch(SUQIA_SATISFACTION_DATA_URL),
        fetch(IFTAR_SATISFACTION_DATA_URL),
      ]);

      if (!wofoodResponse.ok || !walakAlAjrResponse.ok || !translationResponse.ok || !iftarResponse.ok || !suqiaResponse.ok || !suqiaSatisfactionResponse.ok || !iftarSatisfactionResponse.ok) {
        throw new Error(`HTTP error!`);
      }
      
      const [wofoodJson, walakAlAjrJson, translationJson, iftarJson, suqiaJson, suqiaSatisfactionJson, iftarSatisfactionJson] = await Promise.all([
        wofoodResponse.json(),
        walakAlAjrResponse.json(),
        translationResponse.json(),
        iftarResponse.json(),
        suqiaResponse.json(),
        suqiaSatisfactionResponse.json(),
        iftarSatisfactionResponse.json(),
      ]);

      if (!wofoodJson.success || !walakAlAjrJson.success || !translationJson.success || !iftarJson.success || !suqiaJson.success || !suqiaSatisfactionJson.success || !iftarSatisfactionJson.success) {
        throw new Error('Invalid data format received');
      }

      if (wofoodJson.data?.logo?.[0]?.logo) {
        setLogoUrl(wofoodJson.data.logo[0].logo);
      }
      
      if (iftarSatisfactionJson?.data?.partenr && Array.isArray(iftarSatisfactionJson.data.partenr)) {
        setPartners(iftarSatisfactionJson.data.partenr);
      }

      const processedProjects: (Project | null)[] = [
        processWofoodProject(wofoodJson),
        processWalakAlAjrProject(walakAlAjrJson),
        processTranslationProject(translationJson),
        processIftarProject(iftarJson, iftarSatisfactionJson),
        processSuqiaProject(suqiaJson, suqiaSatisfactionJson),
      ];

      setProjects(processedProjects.filter(Boolean) as Project[]);

    } catch (e) {
      console.error("Failed to fetch or process data:", e);
      setError('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dashboardStats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { totalBeneficiaries: 0, projectCount: 0, overallSatisfaction: 0 };
    }

    const projectCount = projects.length;

    const totalBeneficiaries = projects.reduce((sum, project) => {
        // The first stat row is assumed to be the primary beneficiary/item count
        const beneficiaryKey = project.statRows[0]?.statKey;
        if (beneficiaryKey && project.stats.total) {
            return sum + (project.stats.total[beneficiaryKey] || 0);
        }
        return sum;
    }, 0);

    const satisfactionProjects = projects.filter(p => p.stats.total?.satisfactionPercentage !== undefined && p.stats.total?.satisfactionPercentage > 0);
    const totalSatisfaction = satisfactionProjects.reduce((sum, p) => sum + (p.stats.total.satisfactionPercentage || 0), 0);
    const overallSatisfaction = satisfactionProjects.length > 0 ? totalSatisfaction / satisfactionProjects.length : 0;

    return {
        totalBeneficiaries,
        projectCount,
        overallSatisfaction: Math.round(overallSatisfaction)
    };
  }, [projects]);


  return (
    <div className="min-h-screen text-gray-800 font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <img src={logoUrl} alt="شعار جمعية وفود الحرم" className="mx-auto h-16 sm:h-20 w-auto mb-2 sm:mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-800">لوحة المنجزات الرقمية</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-1 sm:mt-2">متابعة حية لأداء وإنجازات مشاريعنا</p>
        </header>
        
        {error && (
          <div className="text-center bg-red-100 border-r-4 border-red-500 text-red-700 p-4 rounded-lg max-w-2xl mx-auto" role="alert">
            <p className="font-bold">خطأ في الاتصال</p>
            <p>{error}</p>
          </div>
        )}

        <DashboardHeader 
            totalBeneficiaries={dashboardStats.totalBeneficiaries}
            projectCount={dashboardStats.projectCount}
            overallSatisfaction={dashboardStats.overallSatisfaction}
            loading={loading}
        />

        {loading ? (
           <div className="space-y-6">
            <ProjectSectionSkeleton />
            <ProjectSectionSkeleton />
            <ProjectSectionSkeleton />
            <ProjectSectionSkeleton />
            <ProjectSectionSkeleton />
           </div>
        ) : (
          projects && projects.length > 0 ? (
            <div className="space-y-6">
                {projects.map(project => (
                <ProjectSection key={project.name} project={project} />
                ))}
            </div>
          ) : (
            !error && <p className="text-center text-gray-500">لا توجد بيانات لعرضها.</p>
          )
        )}
        
        <PartnersSection partners={partners} loading={loading} />

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} جمعية وفود الحرم</p>
        </footer>
      </main>
    </div>
  );
};

export default App;