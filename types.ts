// Fix: Removed conflicting import. The 'Partner' interface is defined in this file.

export interface Partner {
  'الشريك': string;
  'الشعار': string;
}

export interface Logo {
  logo: string;
}

// Wofood Project
export interface WofoodProjectRecord {
  'طابع زمني'?: string;
  'عدد الساعات': number;
  'عدد البرامج العلمية': number;
  'اسم الوفد': string;
  'عدد المستفيدين': number;
}

// Fix: Add missing types for ProjectComparison component.
export interface ComparisonStats {
  totalBeneficiaries: number;
  implementedDelegations: number;
  implementedPrograms: number;
  enrichmentHours: number;
}
export interface ComparisonData {
  stats2024: ComparisonStats;
  stats2025: ComparisonStats;
}

// Walak Al Ajer Project
export interface WalakAlAjerRawRecord {
    'طابع زمني'?: string;
    'الساعات التطوعية للفترة الأولى': number;
    'عدد الساعات التطوعية (الفترة الثانية)': number;
    'عدد المستفيدين من الجنائز للفترة الثانية': number;
    'عدد المستفيدين من الجنائز في الفترة الأولى': number;
    'عدد المستفيدين من العربات في الفترة الأولى': number;
    'عدد المستفيدين في العربات للفترة الثانية': number;
    'عدد المستفيدين من التطيب في الفترة الأولى': number;
    'عدد المستفيدين من الأساور للفترة الثانية': number;
    'عدد المستفيدين في الأساور للفترة الأولى': number;
}

// Iftar Project
export interface IftarProjectRawRecord {
    'طابع زمني'?: string;
    'اجمالي عدد العمال والمشرفين': number;
    'عدد المشرفين': number;
    'العـدد الكلي للوجبات؟': number;
}
export interface IftarSatisfactionRawRecord {
    'طابع زمني'?: string;
    'ما مدى رضاك عن تعامل المشرف مع العمال والمستفيدين؟ ': number;
    'ما مدى رضاك عن تعامل العمال مع المستفيدين؟': number;
    'ما مدى رضاك عن مظهر فريق العمل ؟ ': number;
    'ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟\n(فريق العمل : المشرفين - الموزعين أو العمال) ': number;
    'ما مدى رضاك عن الوقت المستغرق  لتوزيع الوجبات؟': number;
    'ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟': number;
    'ما مدى رضاك عن نظافة المكان بعد الانتهاء من التوزيع؟': number;
    'ما مدى رضاك عن وجبات الإفطار ؟': number;
}

// Suqia Project
export interface SuqiaProjectRawRecord {
    'طابع زمني'?: string;
    'عدد العمال': number;
    'مكان توزيع سقيا الماء؟': string;
    'كم العـدد الكلي للعبوات؟': number;
    'عدد المشرفين': number;
}
export interface SuqiaSatisfactionRawRecord {
    'طابع زمني'?: string;
    'ما مدى رضاك عن تواصل المشرف مع العمال والمستفيدين؟ ': number;
    'ما مدى رضاك عن مظهر فريق العمل ؟ ': number;
    'ما مدى رضاك عن تعامل العمال مع المستفيدين؟': number;
    'ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟': number;
    'ما مدى رضاك عن الوقت المستغرق في التوزيع؟': number;
    'ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟': number;
    'ما مدى رضاك عن عبـــوات المياه ؟': number;
    'هل المياه مُبردة بشكل مناسب؟': number;
}


// Translation Project
export interface TranslationProjectRawRecord {
    'طابع زمني'?: string;
    'عدد الساعات التطوعية:': number;
    'عدد الأسئلة؟': number;
    'عدد المستفيدين:': number;
    'ماهي اللغات المستخدمة في الترجمة؟': string;
    'عدد مرات الإرشاد المكاني:': number;
    'عدد الكتب التي تم توزيعها:': number;
}

// Quran Distribution Project
export interface QuranDistributionRawRecord {
    'طابع زمني'?: string;
    'عدد المصاحف الموزعة': number;
    'عدد المتطوعين:': number;
    'الساعات التطوعية': number;
    'نقاط توزيع المصاحف': string;
}
export interface QuranDistributionSatisfactionRawRecord {
    'طابع زمني'?: string;
    [key: string]: string | number;
}

// Tamkeen Project
export interface TamkeenProjectRawRecord {
    'طابع زمني'?: string;
    'الوقت الزمني الفعلي للقاءات التدريبية': number;
    'عدد الحاضرات؟ ': number;
    'اسم الدورة': string;
    'اسم المدربة': string;
    'عدد المستهدفات في اللقاء الواحد ': number;
}
export interface TamkeenSatisfactionRawRecord {
    'طابع زمني'?: string;
    [key: string]: string | number;
}

// Ethra and Athar Project
export interface EthraAndAtharRawRecord {
  'طابع زمني'?: string;
  'مجموع الساعات التطوعية (لكامل الفريق):': string | number;
  'عدد الهدايا التي تم توزيعها؟': string | number;
  'عدد المستفيدات:': string | number;
}
export interface EthraAndAtharSatisfactionRawRecord {
    'طابع زمني'?: string;
    [key: string]: string | number;
}

// Al-Rifada Project
export interface AlRifadaProjectRawRecord {
    'طابع زمني'?: string;
    'اجمالي عدد العمال والمشرفين': number;
    'عدد التريلات (سيارات التوزيع)': number;
    'العـدد الكلي للوجبات؟': number;
    'مكان التوزيع:': string;
    'عـدد مواقع التوزيع؟': number;
}

// Generic Stat type
export interface Stat {
  icon: string;
  label: string;
  value: string | number;
}
export type StatsData = Stat[];

// Chart Types
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartConfig {
  type: 'bar' | 'doughnut' | 'pie';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: any;
}

// Project Configuration & Processed Data
export type ProjectType = 'wofood' | 'walak-al-ajer' | 'iftar' | 'suqia' | 'translation' | 'quran-distribution' | 'tamkeen' | 'ethra-and-athar' | 'al-rifada';
export interface ProjectConfig {
    name: string;
    type: ProjectType;
    dataSourceUrl: string;
    satisfactionDataSourceUrl?: string;
}

export interface ProjectProcessedData {
    stats: StatsData;
    chart?: ChartConfig;
}

export interface ProcessedProject {
  name: string;
  type: ProjectType;
  data: StatsData | null;
  chartData?: ChartConfig | null;
  error?: string | null;
}

// Summary Stats for Dashboard Header
export interface SummaryStats {
    overallSatisfaction: number;
    totalProjects: number;
    totalBeneficiaries: number;
    totalVolunteerHours: number;
}

// Final Dashboard Data
export interface DashboardData {
    logoUrl: string;
    projects: ProcessedProject[];
    partners: Partner[];
    summaryStats?: SummaryStats;
    summaryChart?: ChartConfig;
}