'use client';

import { useState, useEffect } from 'react';
import PointsBalance from '@/components/dashboard/PointsBalance';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import RewardsList from '@/components/dashboard/RewardsList';
import Link from 'next/link';
import { Metadata } from 'next';

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  date: string;
  description: string;
}

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  image?: string;
}

interface User {
  name: string;
  level: string;
  nextLevel: string;
  progress: number;
}

export const metadata: Metadata = {
  title: 'Kullanıcı Paneli | Cafe Sadakat Sistemi',
  description: 'Cafe sadakat sisteminde puanlarınızı takip edin ve ödüllerinizi kullanın',
};

export default function DashboardPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [user, setUser] = useState<User>({ name: 'Ahmet Yılmaz', level: 'Gold', nextLevel: 'Platinum', progress: 70 });

  useEffect(() => {
    // TODO: API entegrasyonu yapılacak
    // Şimdilik dummy data
    setPoints(350);
    setTransactions([
      { id: 1, type: 'earn', points: 50, date: '2024-05-10', description: 'Cortado Siparişi' },
      { id: 2, type: 'earn', points: 35, date: '2024-05-08', description: 'Filtre Kahve Siparişi' },
      { id: 3, type: 'redeem', points: -100, date: '2024-05-05', description: 'Ücretsiz Kahve Ödülü' },
      { id: 4, type: 'earn', points: 65, date: '2024-05-03', description: 'Brunch Menü Siparişi' },
      { id: 5, type: 'earn', points: 50, date: '2024-04-30', description: 'Flat White Siparişi' },
    ]);
    setRewards([
      { id: 1, name: 'Ücretsiz Kahve', points: 100, description: 'Herhangi bir kahve içeceği ücretsiz', image: '/images/free-coffee.jpg' },
      { id: 2, name: 'Ev Yapımı Kurabiye', points: 50, description: 'Kahvenizin yanında lezzetli kurabiye', image: '/images/cookie.jpg' },
      { id: 3, name: 'Kahve Çekirdeği (250g)', points: 200, description: 'Ekvator menşeili, orta kavrulmuş', image: '/images/coffee-beans.jpg' },
      { id: 4, name: '%15 İndirim Kuponu', points: 150, description: 'Bir sonraki alışverişinizde geçerli', image: '/images/discount.jpg' },
      { id: 5, name: 'Özel Barista Deneyimi', points: 500, description: 'Baristamızla birlikte kahve yapımını öğrenin', image: '/images/barista.jpg' },
    ]);
  }, []);

  const handleRedeemReward = (rewardId: number) => {
    // TODO: API entegrasyonu yapılacak
    console.log('Ödül kullanıldı:', rewardId);
    alert(`${rewards.find(r => r.id === rewardId)?.name} ödülünüz başarıyla kullanıldı!`);
  };

  return (
    <div className="bg-coffee-50 min-h-screen pb-16">
      <div className="bg-coffee-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Sadakat Programı</h1>
              <p className="mt-2 text-coffee-200">Hoş geldiniz, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-coffee-200">Sadakat Seviyesi</p>
                  <p className="font-semibold text-lg">{user.level}</p>
                </div>
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-coffee-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{user.level}</span>
              <span>{user.nextLevel}</span>
            </div>
            <div className="w-full bg-coffee-900 rounded-full h-2.5">
              <div className="bg-cream-400 h-2.5 rounded-full" style={{ width: `${user.progress}%` }}></div>
            </div>
            <p className="text-xs mt-1 text-coffee-200">{500 - points} puan daha kazanın ve {user.nextLevel} seviyesine yükselin</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <PointsBalance points={points} />
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 bg-coffee-700 text-white">
                <h2 className="text-xl font-serif font-semibold">QR Kod ile Hızlı İşlem</h2>
              </div>
              <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <p className="text-coffee-800 mb-2">Kasada göstermek için QR kodunuz:</p>
                  <p className="text-sm text-coffee-600">Çalışana göstererek hızlıca puan kazanabilir veya ödüllerinizi kullanabilirsiniz.</p>
                </div>
                <div className="bg-coffee-100 h-32 w-32 flex items-center justify-center rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-coffee-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5m-2 8h6v6H3v-6m2 2v2h2v-2H5Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-coffee-700 text-white flex justify-between items-center">
                <h2 className="text-xl font-serif font-semibold">İşlem Geçmişi</h2>
                <button className="text-sm underline">Tümünü Gör</button>
              </div>
              <div className="p-4">
                <TransactionHistory transactions={transactions} />
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 bg-coffee-700 text-white">
                <h2 className="text-xl font-serif font-semibold">Hızlı İşlemler</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link 
                  href="/dashboard/profile" 
                  className="flex items-center p-3 bg-coffee-50 rounded-lg hover:bg-coffee-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-coffee-800">Profilim</h3>
                    <p className="text-sm text-coffee-600">Hesap bilgilerinizi yönetin</p>
                  </div>
                </Link>
                
                <Link 
                  href="/dashboard/favorites" 
                  className="flex items-center p-3 bg-coffee-50 rounded-lg hover:bg-coffee-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-coffee-800">Favorilerim</h3>
                    <p className="text-sm text-coffee-600">Favori kahveleriniz ve ürünleriniz</p>
                  </div>
                </Link>
                
                <Link 
                  href="/dashboard/orders" 
                  className="flex items-center p-3 bg-coffee-50 rounded-lg hover:bg-coffee-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2m-9-1a2 2 0 0 1 4 0v1h-4Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-coffee-800">Siparişlerim</h3>
                    <p className="text-sm text-coffee-600">Önceki siparişlerinizi görüntüleyin</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-coffee-700 text-white flex justify-between items-center">
                <h2 className="text-xl font-serif font-semibold">Ödül Kataloğu</h2>
                <button className="text-sm underline">Tümünü Gör</button>
              </div>
              <div className="p-4">
                <RewardsList rewards={rewards} onRedeem={handleRedeemReward} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 