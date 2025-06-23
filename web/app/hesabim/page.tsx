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

// Seviye hesaplama utility fonksiyonu
const calculateUserLevel = (points: number) => {
  let userLevel = 'Bronz';
  let nextLevel = 'Silver';
  let requiredPoints = 250;
  let currentLevelPoints = 0;
  
  if (points >= 1000) {
    userLevel = 'Platinum';
    nextLevel = 'Diamond';
    requiredPoints = 2000;
    currentLevelPoints = 1000;
  } else if (points >= 500) {
    userLevel = 'Gold';
    nextLevel = 'Platinum';
    requiredPoints = 1000;
    currentLevelPoints = 500;
  } else if (points >= 250) {
    userLevel = 'Silver';
    nextLevel = 'Gold';
    requiredPoints = 500;
    currentLevelPoints = 250;
  }
  
  const progressPercentage = Math.min(((points - currentLevelPoints) / (requiredPoints - currentLevelPoints)) * 100, 100);
  
  return {
    userLevel,
    nextLevel,
    requiredPoints,
    currentLevelPoints,
    progressPercentage,
    remainingPoints: Math.max(0, requiredPoints - points)
  };
};

export default function HesabimPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [user, setUser] = useState<User>({ name: 'Ahmet Yılmaz', level: 'Gold', nextLevel: 'Platinum', progress: 70 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeHesabim = async () => {
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
        console.log('=== HESABIM DEBUG ===');
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

        // Seviye hesaplama
        const currentPoints = userData.points || 0;
        const levelInfo = calculateUserLevel(currentPoints);

        setUser({
          name: userData.name || 'Kullanıcı',
          level: levelInfo.userLevel,
          nextLevel: levelInfo.nextLevel,
          progress: levelInfo.progressPercentage
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

      } catch (err: unknown) {
        console.error('Hesabim data loading error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu';
        setError(errorMessage);
        
        // Token geçersizse login'e yönlendir
        if (errorMessage.includes('401') || errorMessage.includes('token')) {
          AuthHelpers.logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeHesabim();
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ödül kullanılırken hata oluştu';
      alert(errorMessage);
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
    <div className="bg-gradient-to-br from-coffee-50 to-cream-100 min-h-screen">
      {/* Header Section - Temizlenmiş ve düzenlenmiş */}
      <div className="bg-gradient-to-r from-coffee-800 to-coffee-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Kullanıcı Bilgileri */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
                Hoş Geldiniz, {user.name}
              </h1>
              <p className="text-coffee-200 text-lg">
                Sadakat programınızda {points} puan biriktirdiniz
              </p>
            </div>

            {/* Seviye Kartı */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-coffee-200 text-sm">Mevcut Seviyeniz</p>
                      <p className="text-2xl font-bold">{user.level}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-coffee-200 text-sm mb-1">Toplam Puanınız</p>
                  <div className="text-3xl font-bold text-cream-300">{points}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-coffee-200">{user.level}</span>
                  <span className="text-coffee-200">{user.nextLevel}</span>
                </div>
                <div className="w-full bg-coffee-900/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-cream-400 to-yellow-400 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${user.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-coffee-200 text-center">
                  {(() => {
                    const levelInfo = calculateUserLevel(points);
                    return levelInfo.remainingPoints > 0 
                      ? `${levelInfo.remainingPoints} puan daha ile ${user.nextLevel} seviyesine yükseleceksiniz`
                      : `Tebrikler! ${user.level} seviyesindesiniz!`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik Bölümü - Yeniden düzenlenmiş */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Sol Sütun - Ana İçerik */}
            <div className="xl:col-span-3 space-y-8">
              {/* Puan Bakiyesi */}
              <div className="transform hover:scale-105 transition-transform duration-200">
                <PointsBalance points={points} />
              </div>
              
              {/* İçerik Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Kod Kartı - İyileştirilmiş */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-coffee-700 to-coffee-800 px-6 py-5">
                    <h3 className="text-xl font-serif font-semibold text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5m-2 8h6v6H3v-6m2 2v2h2v-2H5Z"/>
                      </svg>
                      QR Kod
                    </h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="bg-gradient-to-br from-coffee-100 to-cream-200 h-40 w-40 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-coffee-700" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5m-2 8h6v6H3v-6m2 2v2h2v-2H5Z"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm">Kasada göstererek hızlıca puan kazanın</p>
                  </div>
                </div>

                {/* İşlem Geçmişi Özeti */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-coffee-700 to-coffee-800 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-serif font-semibold text-white">Son İşlemler</h3>
                    <button className="text-cream-300 hover:text-white text-sm underline transition-colors">
                      Tümünü Gör
                    </button>
                  </div>
                  <div className="p-4">
                    <TransactionHistory transactions={transactions.slice(0, 3)} />
                    {transactions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                        <p>Henüz işlem bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Sütun - Yan Panel */}
            <div className="space-y-8">
              {/* Hızlı İşlemler - İyileştirilmiş */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-coffee-700 to-coffee-800 px-6 py-5">
                  <h3 className="text-xl font-serif font-semibold text-white">Hızlı İşlemler</h3>
                </div>
                <div className="p-6 space-y-3">
                  <Link 
                                          href="/hesabim/profile" 
                    className="group flex items-center p-4 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-xl hover:from-coffee-100 hover:to-cream-200 transition-all duration-200 border border-transparent hover:border-coffee-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-coffee-600 to-coffee-700 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Profilim</h4>
                      <p className="text-sm text-gray-600">Hesap bilgilerinizi yönetin</p>
                    </div>
                  </Link>
                  
                  <Link 
                                          href="/hesabim/favorites" 
                    className="group flex items-center p-4 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-xl hover:from-coffee-100 hover:to-cream-200 transition-all duration-200 border border-transparent hover:border-coffee-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Favorilerim</h4>
                      <p className="text-sm text-gray-600">Favori ürünleriniz</p>
                    </div>
                  </Link>
                  
                  <Link 
                                          href="/hesabim/orders" 
                    className="group flex items-center p-4 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-xl hover:from-coffee-100 hover:to-cream-200 transition-all duration-200 border border-transparent hover:border-coffee-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2m-9-1a2 2 0 0 1 4 0v1h-4Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Siparişlerim</h4>
                      <p className="text-sm text-gray-600">Sipariş geçmişiniz</p>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Ödül Kataloğu - İyileştirilmiş */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-coffee-700 to-coffee-800 px-6 py-5 flex justify-between items-center">
                  <h3 className="text-xl font-serif font-semibold text-white">Ödül Kataloğu</h3>
                  <button className="text-cream-300 hover:text-white text-sm underline transition-colors">
                    Tümünü Gör
                  </button>
                </div>
                <div className="p-4">
                  <RewardsList rewards={rewards} onRedeem={handleRedeemReward} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 