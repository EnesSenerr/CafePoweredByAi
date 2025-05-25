import React from 'react';

// İşlem tipi arayüzü
interface Transaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
}

const TransactionHistory: React.FC = () => {
  // Bu aşamada örnek veriler kullanıyoruz
  // Gerçek uygulamada bu veriler API'den gelecek
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2025-05-04',
      type: 'earn',
      points: 50,
      description: 'Kahve siparişi',
    },
    {
      id: '2',
      date: '2025-05-02',
      type: 'earn',
      points: 125,
      description: 'Kahvaltı siparişi',
    },
    {
      id: '3',
      date: '2025-05-01',
      type: 'redeem',
      points: 200,
      description: 'Ücretsiz tatlı',
    },
    {
      id: '4',
      date: '2025-04-28',
      type: 'earn',
      points: 75,
      description: 'Öğle yemeği siparişi',
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="overflow-x-auto">
      {mockTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Henüz işlem geçmişiniz bulunmuyor.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarih</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlem</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Puan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {transaction.description}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                  transaction.type === 'earn' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div className="mt-4 text-right">
        <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
          Tüm İşlemleri Görüntüle
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory; 