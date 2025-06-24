interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  date: string;
  description: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  // Transactions'ın array olduğunu ve length property'sine sahip olduğunu garanti et
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  if (safeTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19Z" />
          </svg>
        </div>
        <p className="text-gray-900 font-bold mb-1">Henüz işlem geçmişiniz yok</p>
        <p className="text-gray-600 text-sm">Kahve siparişi vererek puan kazanmaya başlayın</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeTransactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200/50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                transaction.type === 'earn' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              }`}>
                {transaction.type === 'earn' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                  </svg>
                )}
              </div>
              
              <div>
                <p className="font-bold text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-600 font-medium">
                  {new Date(transaction.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className={`font-bold text-lg ${
              transaction.type === 'earn' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {transaction.type === 'earn' ? '+' : ''}{transaction.points} Puan
            </div>
          </div>
        </div>
      ))}
      
      {safeTransactions.length > 0 && (
        <div className="pt-4 text-center">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg">
            Tüm İşlem Geçmişi
          </button>
        </div>
      )}
    </div>
  );
} 