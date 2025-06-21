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
        <div className="w-16 h-16 mx-auto bg-coffee-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19Z" />
          </svg>
        </div>
        <p className="text-coffee-700 mb-1">Henüz işlem geçmişiniz yok</p>
        <p className="text-coffee-500 text-sm">Kahve siparişi vererek puan kazanmaya başlayın</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-coffee-100">
      {safeTransactions.map((transaction) => (
        <div key={transaction.id} className="py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              transaction.type === 'earn' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-amber-100 text-amber-600'
            }`}>
              {transaction.type === 'earn' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.2 0-8 3.22-8 8.2 0 3.32 2.67 7.25 8 11.8 5.33-4.55 8-8.48 8-11.8C20 5.22 16.2 2 12 2z" />
                </svg>
              )}
            </div>
            
            <div>
              <p className="font-medium text-coffee-900">{transaction.description}</p>
              <p className="text-sm text-coffee-500">
                {new Date(transaction.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className={`font-semibold ${
            transaction.type === 'earn' ? 'text-green-600' : 'text-amber-600'
          }`}>
            {transaction.type === 'earn' ? '+' : ''}{transaction.points} Puan
          </div>
        </div>
      ))}
      
      {safeTransactions.length > 0 && (
        <div className="pt-4 text-center">
          <button className="text-coffee-700 hover:text-coffee-900 text-sm font-medium">
            Tüm İşlem Geçmişi
          </button>
        </div>
      )}
    </div>
  );
} 