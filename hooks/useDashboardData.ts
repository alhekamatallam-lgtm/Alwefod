import { useState, useEffect } from 'react';
import { DashboardData, ApiData, ProjectApiData, ProjectRecord } from '../types';

const MAIN_API_URL = 'https://script.google.com/macros/s/AKfycbwJDAo__-e6gGzzkOLK3CZJnxoertGEXyJ08hoEFHLsvvBglXFgQ1JE6X2B-NYjBPjnPA/exec';
const PROJECT_API_URL = 'https://script.google.com/macros/s/AKfycbyGAXoa3UU3WycERQ8CN7F_zaFBmFaeD0MfTwovFRl7J9n-6XTk1qu1AinxT9wRf9cg/exec';


const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main data (logo and partners)
        const mainResponse = await fetch(MAIN_API_URL);
        if (!mainResponse.ok) {
          throw new Error(`فشل الاتصال بمصدر البيانات الرئيسي: ${mainResponse.status} ${mainResponse.statusText}`);
        }

        const mainJsonResponse = await mainResponse.json();
        
        if (!mainJsonResponse.success || !mainJsonResponse.data) {
            throw new Error('استجابة مصدر البيانات الرئيسي غير صالحة.');
        }

        const mainApiData: ApiData = mainJsonResponse.data;

        if (!mainApiData.Logo || mainApiData.Logo.length === 0 || !mainApiData.Logo[0].logo) {
            throw new Error('بيانات الشعار مفقودة من مصدر البيانات.');
        }

        let processedData: DashboardData = {
          logoUrl: mainApiData.Logo[0].logo,
          partners: mainApiData.partenr || [],
        };

        // Fetch project data and pass it raw
        try {
          const projectResponse = await fetch(PROJECT_API_URL);
          if (projectResponse.ok) {
            const projectJsonResponse = await projectResponse.json();
            if (projectJsonResponse.success && projectJsonResponse.data) {
              const projectApiData: ProjectApiData = projectJsonResponse.data;
              
              // Smartly clean the keys from trailing/leading spaces
              const cleanedProjectData: ProjectApiData = {};
              for (const key in projectApiData) {
                if (Object.prototype.hasOwnProperty.call(projectApiData, key)) {
                  cleanedProjectData[key] = projectApiData[key].map(record => {
                    const cleanedRecord: { [key: string]: any } = {};
                    for (const recordKey in record) {
                      if (Object.prototype.hasOwnProperty.call(record, recordKey)) {
                        cleanedRecord[recordKey.trim()] = record[recordKey as keyof typeof record];
                      }
                    }
                    return cleanedRecord as ProjectRecord;
                  });
                }
              }
              
              processedData.projectData = cleanedProjectData; // Pass cleaned data
            } else {
              console.error('Project API response was not successful or data is missing:', projectJsonResponse);
            }
          } else {
            console.error(`Failed to fetch project data: ${projectResponse.status} ${projectResponse.statusText}`);
          }
        } catch (projectError) {
          console.error('An error occurred while fetching or processing project data:', projectError);
        }

        setData(processedData);

      } catch (err) {
        if (err instanceof Error) {
            setError(err);
        } else {
            setError(new Error('حدث خطأ غير معروف أثناء جلب البيانات.'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDashboardData;