import React from 'react';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4" dir="rtl">
      {/* The logo has been removed as per the user's request */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-green-800 pt-10">
        لوحة المنجزات الرقمية
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mt-3 font-semibold">
        تحت الإنشاء
      </p>
      <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-xl">
        نعمل حالياً على تطوير وتحديث لوحة المعلومات لعرض منجزاتنا بشكل مبتكر. شكراً لانتظاركم!
      </p>
      <div className="mt-8">
        <div className="w-12 h-12 border-4 border-brand-green-200 border-t-brand-green-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default App;
