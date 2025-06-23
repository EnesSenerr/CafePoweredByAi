interface PointsBalanceProps {
  points: number;
}

export default function PointsBalance({ points }: PointsBalanceProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-coffee-700 text-white">
        <h2 className="text-xl font-serif font-semibold">Puan Bakiyeniz</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-coffee-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10c5.513 0 10-4.486 10-10S17.513 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-12H11v5l4.5 2.7.75-1.23-3.75-2.22V8z" />
            </svg>
          </div>
          <div>
            <div className="text-5xl font-bold text-coffee-800">{points}</div>
            <p className="text-gray-700 mt-1 font-medium">Toplam Puan</p>
          </div>
        </div>
        
        <div className="mt-6 bg-coffee-50 rounded-lg p-4 border border-coffee-100 flex justify-between items-center">
          <div>
            <p className="text-gray-900 font-medium">Ödüllerinizi kullanmak için puanlarınızı harcayabilirsiniz</p>
            <p className="text-gray-700 text-sm mt-1">Her 50 puan = 15₺ değerinde</p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="/hesabim/rewards" 
              className="px-4 py-2 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800 transition-colors text-sm"
            >
              Ödülleri Gör
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 