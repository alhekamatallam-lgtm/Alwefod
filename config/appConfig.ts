import { ProjectConfig } from '../types';

interface AppConfig {
  logoAndPartnersUrl: string;
  projects: ProjectConfig[];
}

export const appConfig: AppConfig = {
  logoAndPartnersUrl: "https://script.google.com/macros/s/AKfycbwJDAo__-e6gGzzkOLK3CZJnxoertGEXyJ08hoEFHLsvvBglXFgQ1JE6X2B-NYjBPjnPA/exec",
  projects: [
    {
      name: "مشروع وفود الحرم",
      dataSourceUrl: "https://script.google.com/macros/s/AKfycbyGAXoa3UU3WycERQ8CN7F_zaFBmFaeD0MfTwovFRl7J9n-6XTk1qu1AinxT9wRf9cg/exec",
      type: 'comparison',
    },
    {
      name: "مشروع ولك الأجر",
      dataSourceUrl: "https://script.google.com/macros/s/AKfycbzO3WDosDGPYyArS7YbI3WleQABHKaUV0q0A1CZX3YDIE0t2Ixe_l6ArY8FoVvbWv_K/exec",
      type: 'stats',
    }
  ]
};
