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
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">İşlem Geçmişiniz</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-600">{transaction.date}</p>
            </div>
            <div className={`font-semibold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'earn' ? '+' : ''}{transaction.points} Puan
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 