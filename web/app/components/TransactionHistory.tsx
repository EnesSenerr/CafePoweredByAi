import React from 'react';

// İşlem tipi arayüzü
interface Transaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
}

export default function TransactionHistory() {
  // Örnek işlem verileri
  const transactions = [
    {
      id: 1,
      date: '11 Mayıs 2023',
      description: 'Kahve siparişi',
      type: 'Kazanılan',
      points: 50,
    },
    {
      id: 2,
      date: '9 Mayıs 2023',
      description: 'Ödül kullanımı: Ücretsiz Kahve',
      type: 'Harcanan',
      points: -250,
    },
    {
      id: 3,
      date: '5 Mayıs 2023',
      description: 'Kahve siparişi',
      type: 'Kazanılan',
      points: 45,
    },
    {
      id: 4,
      date: '2 Mayıs 2023',
      description: 'Arkadaş davetiyesi bonusu',
      type: 'Kazanılan',
      points: 100,
    },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left font-semibold text-gray-600">Tarih</th>
              <th className="pb-3 text-left font-semibold text-gray-600">İşlem</th>
              <th className="pb-3 text-right font-semibold text-gray-600">Puan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 text-sm text-gray-600">{transaction.date}</td>
                <td className="py-4 text-sm">{transaction.description}</td>
                <td className={`py-4 text-sm font-medium text-right ${
                  transaction.type === 'Kazanılan' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'Kazanılan' ? '+' : ''}{transaction.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Henüz işlem geçmişiniz bulunmamaktadır.
        </div>
      )}
    </div>
  );
} 