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
        <div className="w-16 h-16 mx-auto bg-coffee-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67l-.5-.68C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83L8.62 12L11 8.76l1-1.36l1 1.36L15.38 12L17 10.83L14.92 8H20v6z" />
          </svg>
        </div>
        <p className="text-coffee-700 mb-1">Henüz ödül bulunmuyor</p>
        <p className="text-coffee-500 text-sm">Yakında yeni ödüller eklenecek</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <div key={reward.id} className="bg-white border border-coffee-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
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
              <div className="h-32 bg-coffee-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-coffee-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-coffee-800 text-white text-xs px-2 py-1 rounded-full">
              {reward.points} Puan
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-coffee-900">{reward.name}</h3>
            <p className="text-sm text-coffee-600 mt-1 mb-4">{reward.description}</p>
            
            <button
              onClick={() => onRedeem(reward.id)}
              className="w-full px-4 py-2 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800 transition-colors text-sm font-medium"
            >
              Bu Ödülü Kullan
            </button>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <a href="/rewards" className="text-coffee-700 hover:text-coffee-900 text-sm font-medium">
          Tüm Ödülleri Gör
        </a>
      </div>
    </div>
  );
} 