'use client';

import { useState, useEffect } from 'react';
import PointsBalance from '@/components/dashboard/PointsBalance';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import RewardsList from '@/components/dashboard/RewardsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanıcı Paneli | Cafe Sadakat Sistemi',
  description: 'Cafe sadakat sisteminde puanlarınızı takip edin ve ödüllerinizi kullanın',
};

export default function DashboardPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // TODO: API entegrasyonu yapılacak
    // Şimdilik dummy data
    setPoints(150);
    setTransactions([
      { id: 1, type: 'earn', points: 50, date: '2024-03-20', description: 'Kahve Siparişi' },
      { id: 2, type: 'redeem', points: -30, date: '2024-03-19', description: 'Kurabiye Ödülü' }
    ]);
    setRewards([
      { id: 1, name: 'Ücretsiz Kahve', points: 100, description: 'Herhangi bir kahve içeceği' },
      { id: 2, name: 'Kurabiye', points: 30, description: 'Ev yapımı kurabiye' }
    ]);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kullanıcı Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PointsBalance points={points} />
          <TransactionHistory transactions={transactions} />
        </div>
        
        <div>
          <RewardsList rewards={rewards} onRedeem={(rewardId) => {
            // TODO: API entegrasyonu yapılacak
            console.log('Ödül kullanıldı:', rewardId);
          }} />
        </div>
      </div>
    </div>
  );
} 