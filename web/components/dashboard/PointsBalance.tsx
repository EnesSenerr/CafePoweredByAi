interface PointsBalanceProps {
  points: number;
}

export default function PointsBalance({ points }: PointsBalanceProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Puan Bakiyeniz</h2>
      <div className="text-4xl font-bold text-primary-600">
        {points} Puan
      </div>
      <p className="text-gray-600 mt-2">
        Ödüllerinizi kullanmak için puanlarınızı harcayabilirsiniz
      </p>
    </div>
  );
} 