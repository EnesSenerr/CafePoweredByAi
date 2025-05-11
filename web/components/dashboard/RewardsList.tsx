interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
}

interface RewardsListProps {
  rewards: Reward[];
  onRedeem: (rewardId: number) => void;
}

export default function RewardsList({ rewards, onRedeem }: RewardsListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ödül Kataloğu</h2>
      <div className="grid gap-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{reward.name}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary-600">{reward.points} Puan</div>
                <button
                  onClick={() => onRedeem(reward.id)}
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Kullan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 