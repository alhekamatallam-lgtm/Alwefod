import { ReactNode } from "react";

// Basic data types from sheets
export interface Partner {
  'الشريك': string;
  'الشعار': string;
}

export interface Logo {
  logo: string;
}

export interface WofoodProjectRecord {
  'اسم الوفد': string;
  'عدد الساعات': number;
  'عدد البرامج العلمية': number;
  'عدد المستفيدين': number;
}

export interface WalakAlAjerRawRecord {
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


// Configuration for each project in the app
export type ProjectType = 'comparison' | 'stats';
export interface ProjectConfig {
  name: string;
  dataSourceUrl: string;
  type: ProjectType;
}

// Processed stats for display
export interface ComparisonStats {
  enrichmentHours: number;
  implementedPrograms: number;
  implementedDelegations: number;
  totalBeneficiaries: number;
}

export interface StatItem {
    label: string;
    value: number | string;
    icon: ReactNode | string;
}


// Processed data structures for components
export interface ComparisonData {
  stats2024: ComparisonStats;
  stats2025: ComparisonStats;
}

export interface StatsData {
    stats: StatItem[];
}

export type ProcessedProjectData = ComparisonData | StatsData;

export interface ProcessedProject {
  name: string;
  type: ProjectType;
  data?: ProcessedProjectData;
  error?: string;
  totalBeneficiaries?: number;
}

// Main data structure for the dashboard
export interface DashboardData {
  logoUrl: string;
  partners: Partner[];
  projects: ProcessedProject[];
}