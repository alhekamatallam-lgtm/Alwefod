// Represents a partner from the API
export interface Partner {
  "الشريك": string;
  "الشعار": string;
}

// Represents the main logo from the API
export interface Logo {
  logo: string;
}

// Represents the structure of the data property in the API response
export interface ApiData {
  Logo: Logo[];
  partenr: Partner[];
}

// Represents the final processed data used by the components
export interface DashboardData {
  logoUrl: string;
  partners: Partner[];
}
