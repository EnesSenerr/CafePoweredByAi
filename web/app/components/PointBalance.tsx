import React from 'react';

interface PointBalanceProps {
  points: number;
}

const PointBalance: React.FC<PointBalanceProps> = ({ points }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{points}</div>
      <div className="mt-2 text-gray-600 dark:text-gray-400">Toplam Puanınız</div>
      
      <div className="mt-6 w-full">
        <button 
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
        >
          QR Kod ile Puan Kazan
        </button>
      </div>
    </div>
  );
};

export default PointBalance; 