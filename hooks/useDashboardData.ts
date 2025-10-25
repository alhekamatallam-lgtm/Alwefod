import { useState, useEffect } from 'react';
import { DashboardData, ApiData } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbwJDAo__-e6gGzzkOLK3CZJnxoertGEXyJ08hoEFHLsvvBglXFgQ1JE6X2B-NYjBPjnPA/exec';

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`فشل الاتصال بمصدر البيانات: ${response.status} ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        
        if (!jsonResponse.success || !jsonResponse.data) {
            throw new Error('استجابة مصدر البيانات غير صالحة.');
        }

        const apiData: ApiData = jsonResponse.data;

        if (!apiData.Logo || apiData.Logo.length === 0 || !apiData.Logo[0].logo) {
            throw new Error('بيانات الشعار مفقودة من مصدر البيانات.');
        }

        const processedData: DashboardData = {
          logoUrl: apiData.Logo[0].logo,
          partners: apiData.partenr || [],
        };

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
