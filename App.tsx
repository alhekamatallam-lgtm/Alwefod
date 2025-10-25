import React from 'react';

const FALLBACK_LOGO_URL = 'https://wofood.org.sa/img/logo.png';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-800 font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <img src={FALLBACK_LOGO_URL} alt="شعار جمعية وفود الحرم" className="mx-auto h-16 sm:h-20 w-auto mb-2 sm:mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-800">لوحة المنجزات الرقمية</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-1 sm:mt-2">متابعة حية لأداء وإنجازات مشاريعنا</p>
        </header>
        
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-2">وضع التشخيص</h2>
            <p className="text-gray-600">
                هذا عرض مبسط للتأكد من أن البيئة الأساسية للتطبيق تعمل بشكل صحيح.
                إذا كنت ترى هذه الصفحة، فالخطوة التالية هي التحقق من مصادر البيانات.
            </p>
        </div>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} جمعية وفود الحرم</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
