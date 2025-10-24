// Fix: Import React to provide the 'React' namespace for types like React.FC.
import React from 'react';

// Raw data from the "Wofood Al Haram" project sheet
export interface WofoodProjectData {
  "تاريخ التنفيذ": string;
  "اسم الوفد": string;
  "الجنسية": string;
  "عدد المستفيدين": string;
  "عدد الساعات": string;
  "اسم البرنامج": string;
  "نوع البرنامج": string;
  "عدد البرامج العلمية": string;
  "عدد البرامج الثقافية": string;
  "عدد البرامج الاجتماعية": string;
  "عدد الجولات": string;
}

// Raw data from the "Walak Al Ajr" project sheet
export interface WalakAlAjrProjectData {
    "الساعات التطوعية  للفترة الأولى": string;
    "عدد الساعات التطوعية  (الفترة الثانية)": string;
    "عدد المستفيدين من الجنائز في الفترة الأولى": string;
    "عدد المستفيدين من الجنائز للفترة الثانية": string;
    "عدد المستفيدين من العربات  في الفترة الأولى": string;
    "عدد المستفيدين في العربات للفترة الثانية": string;
    "عدد المستفيدين في الأساور للفترة الأولى": string;
    "عدد المستفيدين من الأساور للفترة الثانية": string;
    "عدد المستفيدين من التطيب  في الفترة الأولى": string;
    [key: string]: any;
}

// Raw data from the "Translation and Guidance" project sheet
export interface TranslationProjectData {
    "اسم المترجم:": string;
    "عدد الأسئلة؟": string | number;
    "عدد المستفيدين:": string | number;
    "عدد الساعات التطوعية:": string | number;
    "ماهي اللغات المستخدمة في الترجمة؟": string;
    "عدد مرات الإرشاد المكاني:": string | number;
    "عدد الكتب التي تم توزيعها:": string | number;
    [key: string]: any;
}

// Raw data from the "Iftar" project sheet
export interface IftarProjectData {
  "العـدد الكلي للوجبات؟": string | number;
  "اجمالي عدد العمال والمشرفين": string | number;
  "عـدد الوجبات ذات السعرات الحرارية المُنخفضة؟": string | number;
  "مُعد التقرير": string;
  [key: string]: any;
}

// Raw data from the "Iftar Satisfaction Survey" sheet
export interface IftarSatisfactionData {
    "ما مدى رضاك عن تعامل المشرف مع العمال والمستفيدين؟ ": number;
    "ما مدى رضاك عن تعامل العمال مع المستفيدين؟": number;
    "ما مدى رضاك عن مظهر فريق العمل ؟ ": number;
    "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟\n(فريق العمل : المشرفين - الموزعين أو العمال) ": number;
    "ما مدى رضاك عن الوقت المستغرق  لتوزيع الوجبات؟": number;
    "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟": number;
    "ما مدى رضاك عن نظافة المكان بعد الانتهاء من التوزيع؟": number;
    "ما مدى رضاك عن وجبات الإفطار ؟": number;
    [key: string]: any;
}

// Raw data from the "Suqia" project sheet
export interface SuqiaProjectData {
  "كم العـدد الكلي للعبوات؟": string | number;
  "عدد العمال": string | number;
  "عدد نقاط التوزيع": string | number;
  "مكان توزيع سقيا الماء؟": string;
  "مُعد التقرير": string;
  [key: string]: any;
}

// Raw data from the "Suqia Satisfaction Survey" sheet
export interface SuqiaSatisfactionData {
    "ما مدى رضاك عن تواصل المشرف مع العمال والمستفيدين؟ ": number;
    "ما مدى رضاك عن مظهر فريق العمل ؟ ": number;
    "ما مدى رضاك عن تعامل العمال مع المستفيدين؟": number;
    "ما مدى رضاك عن أداء فريق العمل أثناء التوزيـــع؟": number;
    "ما مدى رضاك عن الوقت المستغرق في التوزيع؟": number;
    "ما مدى رضاك عن مكان تقديم الخدمة ونظافته وتنظيمه؟": number;
    "ما مدى رضاك عن عبـــوات المياه ؟": number;
    "هل المياه مُبردة بشكل مناسب؟": number;
    [key:string]: any;
}

// Data for partners
export interface Partner {
    "الشريك": string;
    "الشعار": string;
}

// A generic structure for calculated stats for any project
export interface CalculatedStats {
  [key: string]: number;
}

export interface YearlyStats {
  [year: string]: CalculatedStats;
}

// Configuration for what rows to display in the project table
export interface StatRowConfig {
    label: string;
    statKey: string;
}

export interface Project {
  name: string;
  stats: YearlyStats;
  years: string[];
  statRows: StatRowConfig[]; // This will drive the table rendering
  icon?: React.FC<any>;
}