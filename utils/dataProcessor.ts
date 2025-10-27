import {
    ProjectProcessedData,
    StatsData,
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
    ChartConfig
} from '../types';

const parseNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    
    const stringValue = String(value).trim();
    if (stringValue === '') return 0;

    const normalizedValue = stringValue
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632)) // Convert Arabic numerals
        .replace(/٬/g, '') // Remove Arabic thousands separator
        .replace(/,/g, ''); // Remove Western thousands separator

    const num = parseFloat(normalizedValue);
    return isNaN(num) ? 0 : num;
};

const sum = (records: any[], key: string): number =>
    records.reduce((acc, curr) => acc + parseNumber(curr[key.trim()]), 0);

const max = (records: any[], key: string): number =>
    records.reduce((maxVal, curr) => Math.max(maxVal, parseNumber(curr[key.trim()])), 0);

const average = (records: any[], key: string): number => {
    let total = 0;
    let count = 0;
    records.forEach(record => {
        const value = parseNumber(record[key.trim()]);
        if (record[key.trim()] !== null && record[key.trim()] !== undefined && String(record[key.trim()]).trim() !== '') {
           total += value;
           count++;
        }
    });
    return count > 0 ? total / count : 0;
};

// Helper to calculate average satisfaction from records
const calculateSatisfaction = (records: any[]): number => {
    if (!records || records.length === 0) return 0;

    let totalScore = 0;
    let questionCount = 0;

    records.forEach(record => {
        const questionKeys = Object.keys(record).filter(key => (key.includes('رضا') || key.includes('التقييم')) && (key.includes('[التقييم]') || key.includes('[التقييم ]')));
        
        questionKeys.forEach(key => {
            const numValue = parseNumber(record[key]);
            if (!isNaN(numValue) && numValue > 0) {
                totalScore += numValue;
                questionCount++;
            }
        });
    });

    if (questionCount === 0) return 0;
    
    const averageRating = totalScore / questionCount;
    return (averageRating / 5) * 100;
};


export const processWofoodProjectData = (data: { '2024': WofoodProjectRecord[], '2025': WofoodProjectRecord[] }): ProjectProcessedData => {
    const records2024 = data['2024'] || [];
    const records2025 = data['2025'] || [];
    const allRecords = [...records2024, ...records2025];
    
    if (allRecords.length === 0) return { stats: [] };
    
    const totalBeneficiaries = sum(allRecords, 'عدد المستفيدين');
    const enrichmentHours = sum(allRecords, 'عدد الساعات');
    const implementedPrograms = sum(allRecords, 'عدد البرامج العلمية');
    const implementedDelegations = new Set(allRecords.map(r => r['اسم الوفد'])).size;

    const stats: StatsData = [
        { icon: 'UsersIcon', label: 'اجمالي المستفيدين', value: totalBeneficiaries },
        { icon: 'BriefcaseIcon', label: 'الوفود المنفذة', value: implementedDelegations },
        { icon: 'BookOpenIcon', label: 'البرامج العلمية المنفذة', value: implementedPrograms },
        { icon: 'HourglassIcon', label: 'الساعات الإثرائية', value: enrichmentHours },
    ];

    const chart: ChartConfig = {
        type: 'bar',
        data: {
            labels: ['الوفود المنفذة', 'البرامج العلمية المنفذة'],
            datasets: [{
                label: 'العدد',
                data: [implementedDelegations, implementedPrograms],
                backgroundColor: ['#4ade80', '#16a34a'],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'مقارنة بين الوفود والبرامج المنفذة', font: { family: 'Cairo' } },
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: { 
                        font: { family: 'Cairo' },
                        precision: 0 
                    },
                },
                x: { ticks: { font: { family: 'Cairo' } } },
            }
        },
    };

    return { stats, chart };
};

export const processWalakAlAjerData = (records: WalakAlAjerRawRecord[]): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };

    const volunteerHours = sum(records, 'الساعات التطوعية للفترة الأولى') + sum(records, 'عدد الساعات التطوعية (الفترة الثانية)');
    const funeralBeneficiaries = sum(records, 'عدد المستفيدين من الجنائز في الفترة الأولى') + sum(records, 'عدد المستفيدين من الجنائز للفترة الثانية');
    const cartBeneficiaries = sum(records, 'عدد المستفيدين من العربات في الفترة الأولى') + sum(records, 'عدد المستفيدين في العربات للفترة الثانية');
    const incenseBeneficiaries = sum(records, 'عدد المستفيدين من التطيب في الفترة الأولى');
    const wristbandBeneficiaries = sum(records, 'عدد المستفيدين في الأساور للفترة الأولى') + sum(records, 'عدد المستفيدين من الأساور للفترة الثانية');
    
    const totalBeneficiaries = funeralBeneficiaries + cartBeneficiaries + incenseBeneficiaries + wristbandBeneficiaries + volunteerHours;

    const stats: StatsData = [
        { icon: 'UsersIcon', label: 'اجمالي المستفيدين', value: totalBeneficiaries },
        { icon: 'WheelchairIcon', label: 'المستفيدون من العربات', value: cartBeneficiaries },
        { icon: 'IncenseBurnerIcon', label: 'المستفيدون من التطيب', value: incenseBeneficiaries },
        { icon: 'WristbandIcon', label: 'المستفيدون من الأساور', value: wristbandBeneficiaries },
        { icon: 'HourglassIcon', label: 'إجمالي الساعات التطوعية', value: volunteerHours },
    ];

    const chart: ChartConfig = {
        type: 'bar',
        data: {
            labels: ['العربات', 'التطيب', 'الأساور', 'الجنائز'],
            datasets: [{
                label: 'عدد المستفيدين حسب الخدمة',
                data: [cartBeneficiaries, incenseBeneficiaries, wristbandBeneficiaries, funeralBeneficiaries],
                backgroundColor: ['#86efac', '#4ade80', '#22c55e', '#16a34a'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'توزيع المستفيدين حسب الخدمة', font: { family: 'Cairo' } }
            },
            scales: {
                y: { ticks: { font: { family: 'Cairo' } } },
                x: { ticks: { font: { family: 'Cairo' } } },
            }
        }
    };

    return { stats, chart };
};

const createSatisfactionChart = (satisfaction: number): ChartConfig => ({
    type: 'doughnut',
    data: {
        labels: ['الرضا', ''],
        datasets: [{
            label: 'نسبة الرضا',
            data: [satisfaction, 100 - satisfaction],
            backgroundColor: ['#16a34a', '#e5e7eb'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'مؤشر رضا المستفيدين', font: { family: 'Cairo' } },
            tooltip: {
                filter: (item) => item.label !== '',
                callbacks: {
                    label: (context) => ` الرضا: ${context.parsed.toFixed(1)}%`
                }
            }
        }
    }
});

export const processIftarProjectData = (
    records: IftarProjectRawRecord[],
    satisfactionRecords: IftarSatisfactionRawRecord[]
): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };
    
    const totalMeals = sum(records, 'العـدد الكلي للوجبات؟');
    const volunteers = max(records, 'اجمالي عدد العمال والمشرفين');
    const satisfaction = calculateSatisfaction(satisfactionRecords);

    const stats: StatsData = [
        { icon: 'FoodIcon', label: 'اجمالي الوجبات الموزعة (المستفيدين)', value: totalMeals },
        { icon: 'UsersIcon', label: 'عدد المتطوعين', value: volunteers },
        { icon: 'HeartIcon', label: 'رضا المستفيدين', value: `${satisfaction.toFixed(1)}%` },
    ];
    
    const chart = createSatisfactionChart(satisfaction);

    return { stats, chart };
};

export const processSuqiaProjectData = (
    records: SuqiaProjectRawRecord[],
    satisfactionRecords: SuqiaSatisfactionRawRecord[]
): ProjectProcessedData => {
     if (!records || records.length === 0) return { stats: [] };

    const totalBottles = sum(records, 'كم العـدد الكلي للعبوات؟');
    const totalStaff = sum(records, 'عدد العمال') + sum(records, 'عدد المشرفين');
    const distributionPoints = new Set(records.map(r => r['مكان توزيع سقيا الماء؟'])).size;
    const satisfaction = calculateSatisfaction(satisfactionRecords);
    
    const stats: StatsData = [
        { icon: 'DropletIcon', label: 'اجمالي عبوات المياه الموزعة (المستفيدين)', value: totalBottles },
        { icon: 'UsersIcon', label: 'إجمالي فريق العمل', value: totalStaff },
        { icon: 'BriefcaseIcon', label: 'نقاط التوزيع', value: distributionPoints },
        { icon: 'HeartIcon', label: 'رضا المستفيدين', value: `${satisfaction.toFixed(1)}%` },
    ];

    const chart = createSatisfactionChart(satisfaction);

    return { stats, chart };
};

export const processTranslationProjectData = (records: TranslationProjectRawRecord[]): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };

    const answeredQuestions = sum(records, 'عدد الأسئلة؟');
    const volunteerHours = sum(records, 'عدد الساعات التطوعية:');
    const spatialGuidance = sum(records, 'عدد مرات الإرشاد المكاني:');
    const distributedBooks = sum(records, 'عدد الكتب التي تم توزيعها:');
    
    const totalBeneficiaries = spatialGuidance + distributedBooks + answeredQuestions;
    
    const languages = new Set<string>();
    records.forEach(r => {
        const langString = r['ماهي اللغات المستخدمة في الترجمة؟'] || '';
        langString.split(/[,،]/).forEach(lang => {
            const trimmedLang = lang.trim();
            if (trimmedLang) languages.add(trimmedLang);
        });
    });

    const stats: StatsData = [
        { icon: 'UsersIcon', label: 'اجمالي المستفيدين', value: totalBeneficiaries },
        { icon: 'GlobeIcon', label: 'عدد اللغات', value: languages.size },
        { icon: 'BookOpenIcon', label: 'إجمالي الأسئلة المجابة', value: answeredQuestions },
        { icon: 'HourglassIcon', label: 'إجمالي الساعات التطوعية', value: volunteerHours },
    ];
    
    const chart: ChartConfig = {
        type: 'doughnut',
        data: {
            labels: ['إجابة أسئلة', 'إرشاد مكاني', 'توزيع كتب'],
            datasets: [{
                label: 'أنواع الخدمات',
                data: [answeredQuestions, spatialGuidance, distributedBooks],
                backgroundColor: ['#16a34a', '#22c55e', '#4ade80'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Cairo' } } },
                title: { display: true, text: 'توزيع الخدمات المقدمة', font: { family: 'Cairo' } }
            }
        }
    };

    return { stats, chart };
};

export const processQuranDistributionData = (
    records: QuranDistributionRawRecord[],
    satisfactionRecords: QuranDistributionSatisfactionRawRecord[]
): ProjectProcessedData => {
     if (!records || records.length === 0) return { stats: [] };
     
    const distributedQurans = sum(records, 'عدد المصاحف الموزعة');
    const volunteers = max(records, 'عدد المتطوعين:');
    const volunteerHours = sum(records, 'الساعات التطوعية');
    
    const distributionPoints = new Set<string>();
    records.forEach(r => {
        const pointsString = r['نقاط توزيع المصاحف'] || '';
        pointsString.split(/[,،]/).forEach(point => {
            const trimmedPoint = point.trim();
            if (trimmedPoint) distributionPoints.add(trimmedPoint);
        });
    });
    
    const satisfaction = calculateSatisfaction(satisfactionRecords);

    const stats: StatsData = [
        { icon: 'BookOpenIcon', label: 'عدد المصاحف الموزعة', value: distributedQurans },
        { icon: 'UsersIcon', label: 'عدد المتطوعين', value: volunteers },
        { icon: 'HourglassIcon', label: 'الساعات التطوعية', value: volunteerHours },
        { icon: 'BriefcaseIcon', label: 'نقاط التوزيع', value: distributionPoints.size },
    ];
    
    if (satisfaction > 0) {
        stats.push({ icon: 'HeartIcon', label: 'رضا المستفيدين', value: `${satisfaction.toFixed(1)}%` });
    }

    const chart: ChartConfig = {
        type: 'bar',
        data: {
            labels: ['نقاط التوزيع', 'الساعات التطوعية', 'عدد المتطوعين'],
            datasets: [{
                label: 'المؤشرات',
                data: [distributionPoints.size, volunteerHours, volunteers],
                backgroundColor: ['#4ade80', '#22c55e', '#16a34a'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { 
                    display: true, 
                    text: 'مؤشرات أداء المشروع', 
                    font: { family: 'Cairo' } 
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: { 
                        font: { family: 'Cairo' },
                        precision: 0 
                    },
                },
                x: { ticks: { font: { family: 'Cairo' } } },
            }
        }
    };

    return { stats, chart };
};

export const processTamkeenProjectData = (
    records: TamkeenProjectRawRecord[],
    satisfactionRecords?: TamkeenSatisfactionRawRecord[]
): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };
    
    const totalBeneficiaries = sum(records, 'عدد الحاضرات؟ ');
    const trainingHours = sum(records, 'الوقت الزمني الفعلي للقاءات التدريبية');
    const trainers = new Set(records.map(r => r['اسم المدربة']?.trim()).filter(Boolean)).size;

    const enrichmentMeetings = new Set(records.map(r => r['اسم الدورة']?.trim()).filter(Boolean)).size;
    const averageTargetAttendees = average(records, 'عدد المستهدفات في اللقاء الواحد ');
    const averageAttendees = average(records, 'عدد الحاضرات؟ ');
    
    const satisfaction = satisfactionRecords ? calculateSatisfaction(satisfactionRecords) : 0;

    const stats: StatsData = [
        { icon: 'UsersIcon', label: 'اجمالي المستفيدين', value: totalBeneficiaries },
        { icon: 'UsersIcon', label: 'الحضور في اللقاء الواحد', value: Math.round(averageAttendees) },
        { icon: 'UsersIcon', label: 'العدد المستهدف في اللقاء الواحد', value: Math.round(averageTargetAttendees) },
        { icon: 'BookOpenIcon', label: 'عدد اللقاءات الإثرائية', value: enrichmentMeetings },
        { icon: 'HourglassIcon', label: 'إجمالي الساعات التدريبية', value: trainingHours },
        { icon: 'BriefcaseIcon', label: 'عدد المدربات', value: trainers },
    ];
    
    let chart: ChartConfig | undefined = undefined;
    if (satisfaction > 0) {
        stats.push({ icon: 'HeartIcon', label: 'رضا المستفيدين', value: `${satisfaction.toFixed(1)}%` });
        chart = createSatisfactionChart(satisfaction);
    }
    
    return { stats, chart };
};

export const processEthraAndAtharData = (
    records: EthraAndAtharRawRecord[],
    satisfactionRecords?: EthraAndAtharSatisfactionRawRecord[]
): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };
    
    const volunteerHours = sum(records, 'مجموع الساعات التطوعية (لكامل الفريق):');
    const distributedGifts = sum(records, 'عدد الهدايا التي تم توزيعها؟');
    const totalBeneficiaries = sum(records, 'عدد المستفيدات:');
    
    const satisfaction = satisfactionRecords ? calculateSatisfaction(satisfactionRecords) : 0;

    const stats: StatsData = [
        { icon: 'UsersIcon', label: 'المستفيدون', value: totalBeneficiaries },
        { icon: 'GiftIcon', label: 'الهدايا الموزعة على الحاجات', value: distributedGifts },
        { icon: 'HourglassIcon', label: 'الساعات التطوعية', value: volunteerHours },
    ];
    
    let chart: ChartConfig | undefined = undefined;
    if (satisfaction > 0) {
        stats.push({ icon: 'HeartIcon', label: 'رضا المستفيدين', value: `${satisfaction.toFixed(1)}%` });
        chart = createSatisfactionChart(satisfaction);
    }
    
    return { stats, chart };
};

export const processAlRifadaProjectData = (records: AlRifadaProjectRawRecord[]): ProjectProcessedData => {
    if (!records || records.length === 0) return { stats: [] };

    const totalBeneficiaries = sum(records, 'العـدد الكلي للوجبات؟');
    const workersAndSupervisors = max(records, 'اجمالي عدد العمال والمشرفين');
    const distributionTrucks = sum(records, 'عدد التريلات (سيارات التوزيع)');
    const distributionSites = sum(records, 'عـدد مواقع التوزيع؟');

    const stats: StatsData = [
        { icon: 'FoodIcon', label: 'اجمالي المستفيدين', value: totalBeneficiaries },
        { icon: 'UsersIcon', label: 'العاملين والمشرفين', value: workersAndSupervisors },
        { icon: 'BriefcaseIcon', label: 'شاحنات التوزيع', value: distributionTrucks },
        { icon: 'BriefcaseIcon', label: 'مواقع التوزيع', value: distributionSites },
    ];

    const chart: ChartConfig = {
        type: 'bar',
        data: {
            labels: ['الوجبات', 'العاملين', 'الشاحنات', 'المواقع'],
            datasets: [{
                label: 'مؤشرات المشروع',
                data: [totalBeneficiaries, workersAndSupervisors, distributionTrucks, distributionSites],
                backgroundColor: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'المؤشرات الرئيسية لمشروع الرفادة', font: { family: 'Cairo' } }
            },
            scales: {
                y: { type: 'logarithmic', ticks: { font: { family: 'Cairo' } } },
                x: { ticks: { font: { family: 'Cairo' } } },
            }
        }
    };

    return { stats, chart };
};