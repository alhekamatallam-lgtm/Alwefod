import React from 'react';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-brand-green-50">
      <h1 className="text-5xl font-extrabold text-brand-green-800">
        تحت الإنشاء
      </h1>
      <p className="text-xl text-gray-700 mt-4">
        نعمل حالياً على تطوير الموقع. شكراً لزيارتكم!
      </p>
    </div>
  );
};

export default App;