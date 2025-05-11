import React from 'react';

type PointBalanceProps = {
  currentPoints: number;
};

export default function PointBalance({ currentPoints }: PointBalanceProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 mb-1">Mevcut Puanlarınız</p>
          <h3 className="text-4xl font-bold text-amber-600">{currentPoints} Puan</h3>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold">
          Sonraki Seviye: 1000 Puan
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
        <div 
          className="bg-amber-600 h-4 rounded-full" 
          style={{ width: `${Math.min((currentPoints / 1000) * 100, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>0</span>
        <span>250</span>
        <span>500</span>
        <span>750</span>
        <span>1000</span>
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">Puan Kazanma İpuçları</h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span> 
            Her sipariş için harcadığınız her 1₺ için 10 puan kazanırsınız
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span> 
            Arkadaşınızı davet ettiğinizde 100 bonus puan kazanırsınız
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span> 
            Doğum gününüzde 250 bonus puan hediye edilir
          </li>
        </ul>
      </div>
    </div>
  );
} 