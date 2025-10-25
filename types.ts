// Represents a partner from the API
export interface Partner {
  "الشريك": string;
  "الشعار": string;
}

// Represents the main logo from the API
export interface Logo {
  logo: string;
}

// Represents the structure of the data property in the main API response
export interface ApiData {
  Logo: Logo[];
  partenr: Partner[];
}

// Represents a single record from the project data source
export interface ProjectRecord {
    "عدد الساعات": number;
    "عدد البرامج العلمية": number;
    "اسم الوفد": string;
    "عدد المستفيدين": number;
}

// Represents the raw data from the project API, with keys for each year/sheet
export interface ProjectApiData {
    [key: string]: ProjectRecord[];
}

// Represents the calculated statistics for a project
export interface ProjectStats {
    enrichmentHours: number;
    implementedPrograms: number;
    implementedDelegations: number;

    totalBeneficiaries: number;
}

// Represents the final processed data used by the components
export interface DashboardData {
  logoUrl: string;
  partners: Partner[];
  projectData?: ProjectApiData; // Changed from projectStats to allow for dynamic filtering
}