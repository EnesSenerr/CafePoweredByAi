interface PointsBalanceProps {
  points: number;
}

export default function PointsBalance({ points }: PointsBalanceProps) {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 rounded-3xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Puan Bakiyeniz</h2>
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 mb-8">
          <div>
            <div className="text-6xl font-bold text-white mb-2">{points}</div>
            <p className="text-white/80 text-lg font-medium">Toplam Puan</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <p className="text-white font-medium text-lg">Ödüllerinizi kullanın!</p>
              <p className="text-white/80 text-sm mt-1">Her 50 puan = 15₺ değerinde</p>
            </div>
            <div className="flex-shrink-0">
              <a 
                href="/hesabim/rewards" 
                className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
                Ödülleri Gör
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 