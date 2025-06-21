'use client';

import { useState, useEffect } from 'react';
import PointsBalance from '@/components/dashboard/PointsBalance';
import TransactionHistory from '../../components/dashboard/TransactionHistory';
import RewardsList from '@/components/dashboard/RewardsList';
import Link from 'next/link';
import { AuthHelpers, AuthTokenManager } from '../utils/auth';
import { getUserProfile, getRewards, getPointHistory, redeemPoints } from '../api';
import { useRouter } from 'next/navigation';

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

// Bu sayfa client component olduğu için metadata burada tanımlanmıyor

export default function DashboardPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [user, setUser] = useState<User>({ name: 'Ahmet Yılmaz', level: 'Gold', nextLevel: 'Platinum', progress: 70 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      // Auth kontrolü
      if (!AuthHelpers.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      const token = AuthTokenManager.getToken();
      const currentUser = AuthHelpers.getCurrentUser();
      
      if (!token || !currentUser) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        
        // Debug bilgisi
        console.log('=== DASHBOARD DEBUG ===');
        console.log('Token:', token);
        console.log('Current User:', currentUser);
        
        // Paralel API çağrıları
        const [profileData, rewardsData] = await Promise.all([
          getUserProfile(token),
          getRewards()
        ]);

        console.log('Profile Data:', profileData);
        console.log('Rewards Data:', rewardsData);

        // Kullanıcı profil bilgilerini güncelle
        // profileData format'ını esnek hale getir
        let userData;
        
        if (profileData && profileData.user) {
          // Eğer { user: {...} } formatında geliyorsa
          userData = profileData.user;
        } else if (profileData && profileData.id) {
          // Eğer direkt { id, name, email, ... } formatında geliyorsa
          userData = profileData;
        } else {
          throw new Error('Kullanıcı profil verisi alınamadı');
        }

        console.log('User Data:', userData);

        setUser({
          name: userData.name || 'Kullanıcı',
          level: 'Gold', // Backend'den gelmeyen bilgiler için fallback
          nextLevel: 'Platinum',
          progress: Math.min((userData.points || 0) / 500 * 100, 100)
        });
        
        setPoints(userData.points || 0);
        
        // Ödülleri güncelle
        setRewards(rewardsData.data || []);

        // Point history (eğer varsa)
        try {
          const historyData = await getPointHistory(token);
          if (historyData && historyData.data) {
            // Backend'den gelen format: data.transactions
            const transactions = historyData.data.transactions || [];
            
            // Frontend format'ına dönüştür
            const formattedTransactions = Array.isArray(transactions) 
              ? transactions.map(tx => ({
                  id: tx._id || tx.id,
                  type: tx.type,
                  points: tx.amount || tx.points,
                  date: tx.createdAt || tx.date,
                  description: tx.description
                }))
              : [];
            
            setTransactions(formattedTransactions);
          } else {
            setTransactions([]);
          }
        } catch (historyError) {
          console.log('Point history API error:', historyError);
          // Point history yoksa boş array
          setTransactions([]);
        }

      } catch (err: any) {
        console.error('Dashboard data loading error:', err);
        setError(err.message || 'Veriler yüklenirken hata oluştu');
        
        // Token geçersizse login'e yönlendir
        if (err.message?.includes('401') || err.message?.includes('token')) {
          AuthHelpers.logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  const handleRedeemReward = async (rewardId: number) => {
    const token = AuthTokenManager.getToken();
    const currentUser = AuthHelpers.getCurrentUser();
    
    if (!token || !currentUser) {
      alert('Lütfen tekrar giriş yapın');
      return;
    }

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      alert('Ödül bulunamadı');
      return;
    }

    if (points < reward.points) {
      alert('Yeterli puanınız bulunmuyor');
      return;
    }

    try {
      const result = await redeemPoints(token, rewardId.toString());
      
      // Başarılı ise puan bakiyesini güncelle
      setPoints(result.data.currentBalance);
      
      // Transaction history'ye ekle
      const newTransaction: Transaction = {
        id: Date.now(),
        type: 'redeem',
        points: -reward.points,
        date: new Date().toISOString().split('T')[0],
        description: `${reward.name} ödülü kullanıldı`
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      alert(`${reward.name} ödülünüz başarıyla kullanıldı!`);
    } catch (err: any) {
      alert(err.message || 'Ödül kullanılırken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="bg-coffee-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-800 mx-auto"></div>
          <p className="mt-4 text-coffee-800 text-lg">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-coffee-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-coffee-800 text-white px-4 py-2 rounded hover:bg-coffee-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-xs mt-1 text-coffee-100 font-medium">{500 - points} puan daha kazanın ve {user.nextLevel} seviyesine yükselin</p>
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
                  <p className="text-gray-900 font-semibold mb-2">Kasada göstermek için QR kodunuz:</p>
                  <p className="text-sm text-gray-700">Çalışana göstererek hızlıca puan kazanabilir veya ödüllerinizi kullanabilirsiniz.</p>
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
                    <h3 className="font-semibold text-gray-900">Profilim</h3>
                    <p className="text-sm text-gray-700">Hesap bilgilerinizi yönetin</p>
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
                    <h3 className="font-semibold text-gray-900">Favorilerim</h3>
                    <p className="text-sm text-gray-700">Favori kahveleriniz ve ürünleriniz</p>
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
                    <h3 className="font-semibold text-gray-900">Siparişlerim</h3>
                    <p className="text-sm text-gray-700">Önceki siparişlerinizi görüntüleyin</p>
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