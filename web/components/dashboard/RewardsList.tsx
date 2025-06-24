interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  image?: string;
}

interface RewardsListProps {
  rewards: Reward[];
  onRedeem: (rewardId: number) => void;
}

export default function RewardsList({ rewards, onRedeem }: RewardsListProps) {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
          </svg>
        </div>
        <p className="text-gray-900 font-bold mb-1">Henüz ödül bulunmuyor</p>
        <p className="text-gray-600 text-sm">Yakında yeni ödüller eklenecek</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <div key={reward.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="relative">
            {reward.image ? (
              <div 
                className="h-32 bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url(${reward.image})`, 
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              ></div>
            ) : (
              <div className="h-32 bg-gradient-to-r from-purple-100 to-indigo-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              {reward.points} Puan
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-bold text-gray-900 text-lg mb-2">{reward.name}</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{reward.description}</p>
            
            <button
              onClick={() => onRedeem(reward.id)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              🎁 Bu Ödülü Kullan
            </button>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <a 
          href="/rewards" 
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
          </svg>
          Tüm Ödülleri Gör
        </a>
      </div>
    </div>
  );
} 