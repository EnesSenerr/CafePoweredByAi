'use client';

import { useState, useEffect } from 'react';
import PointsBalance from '../../components/dashboard/PointsBalance';
import TransactionHistory from '../../components/dashboard/TransactionHistory';
import RewardsList from '../../components/dashboard/RewardsList';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { getRewards, getPointHistory, redeemPoints } from '../api';
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
  const { user, token, isLoading } = useAuth();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userLevel, setUserLevel] = useState<User>({ name: 'Kullanıcı', level: 'Bronz', nextLevel: 'Silver', progress: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Auth kontrolü - ayrı useEffect
  useEffect(() => {
    if (!isLoading) {
      const hasStorageToken = localStorage.getItem('authToken');
      
      if (!user && !hasStorageToken) {
        // Kesinlikle auth yok, redirect et
        router.push('/auth/login');
        return;
      }
      
      if (!user && hasStorageToken) {
        // Token var ama user yok, AuthContext henüz yüklenmiş olabilir - biraz bekle
        const timeoutId = setTimeout(() => {
          if (!user) {
            router.push('/auth/login');
          }
        }, 1500);
        
        return () => clearTimeout(timeoutId);
      }
      
      // User var, auth tamamlandı
      setAuthChecked(true);
    }
  }, [user, isLoading, router]);

  // Data loading - sadece auth tamamlandıktan sonra
  useEffect(() => {
    if (!authChecked || !user || !token) {
      return;
    }

    const loadData = async () => {
      try {
        setDataLoading(true);
        
        // Kullanıcı verilerini ayarla
        const currentPoints = user.points || 0;
        const levelInfo = calculateUserLevel(currentPoints);

        setUserLevel({
          name: user.name || 'Kullanıcı',
          level: levelInfo.userLevel,
          nextLevel: levelInfo.nextLevel,
          progress: levelInfo.progressPercentage
        });
        
        setPoints(currentPoints);
        
        // Paralel API çağrıları
        const [rewardsData] = await Promise.all([
          getRewards().catch(() => ({ data: [] }))
        ]);

        // Ödülleri güncelle
        setRewards(rewardsData.data || []);

        // Point history (opsiyonel)
        if (token) {
          try {
            const historyData = await getPointHistory(token);
            if (historyData && historyData.data) {
              const transactions = historyData.data.transactions || [];
              
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
            }
          } catch (historyError) {
            console.log('Point history API error:', historyError);
            setTransactions([]);
          }
        }

      } catch (err: unknown) {
        console.error('Hesabim data loading error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu';
        setError(errorMessage);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [authChecked, user, token]);

  const handleRedeemReward = async (rewardId: number) => {
    if (!token) {
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

  // Auth loading durumunda loading göster
  if (isLoading || !authChecked) {
    return (
      <div className="bg-coffee-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-800 mx-auto"></div>
          <p className="mt-4 text-coffee-800 text-lg">Kimlik doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  // Data loading durumunda loading göster
  if (dataLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <span className="text-2xl mr-3">👤</span>
              <span className="text-lg font-semibold">Hesap Yönetimi</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Hoş Geldiniz, {userLevel.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Sadakat programınızda <span className="font-bold text-yellow-200">{points} puan</span> biriktirdiniz
            </p>
            
            {/* Seviye Kartı */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white/80 text-sm">Mevcut Seviyeniz</p>
                    <p className="text-2xl font-bold">{userLevel.level}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Toplam Puanınız</p>
                  <div className="text-4xl font-bold text-yellow-200">{points}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-white/80">
                  <span>{userLevel.level}</span>
                  <span>{userLevel.nextLevel}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-4 rounded-full transition-all duration-500 shadow-inner" 
                    style={{ width: `${userLevel.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/80 text-center">
                  {(() => {
                    const levelInfo = calculateUserLevel(points);
                    return levelInfo.remainingPoints > 0 
                      ? `${levelInfo.remainingPoints} puan daha ile ${userLevel.nextLevel} seviyesine yükseleceksiniz`
                      : `Tebrikler! ${userLevel.level} seviyesindesiniz!`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sol Sütun - Ana İçerik */}
              <div className="lg:col-span-2 space-y-8">
                {/* Puan Bakiyesi */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <PointsBalance points={points} />
                </div>
                
                {/* İçerik Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* QR Kod Kartı */}
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5m-2 8h6v6H3v-6m2 2v2h2v-2H5Z"/>
                        </svg>
                        QR Kod
                      </h3>
                    </div>
                    <div className="p-8 text-center">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 w-40 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5m-2 8h6v6H3v-6m2 2v2h2v-2H5Z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Kasada göstererek hızlıca puan kazanın</p>
                      <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold">
                        QR Kodu Göster
                      </button>
                    </div>
                  </div>

                  {/* İşlem Geçmişi Özeti */}
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Son İşlemler</h3>
                      <button className="text-green-100 hover:text-white text-sm underline transition-colors font-medium">
                        Tümünü Gör
                      </button>
                    </div>
                    <div className="p-6">
                      <TransactionHistory transactions={transactions.slice(0, 3)} />
                      {transactions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                          </svg>
                          <p className="font-medium">Henüz işlem bulunmuyor</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sağ Sütun - Yan Panel */}
              <div className="space-y-8">
                {/* Hızlı İşlemler */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-6">
                    <h3 className="text-xl font-bold text-white">Hızlı İşlemler</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <Link 
                      href="/hesabim/profile" 
                      className="group flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl hover:from-orange-100 hover:to-red-100 transition-all duration-200 border border-transparent hover:border-orange-200 hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Profilim</h4>
                        <p className="text-sm text-gray-600">Hesap bilgilerinizi yönetin</p>
                      </div>
                    </Link>
                    
                    <Link 
                      href="/hesabim/favorites" 
                      className="group flex items-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl hover:from-pink-100 hover:to-rose-100 transition-all duration-200 border border-transparent hover:border-pink-200 hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Favorilerim</h4>
                        <p className="text-sm text-gray-600">Favori ürünleriniz</p>
                      </div>
                    </Link>
                    
                    <Link 
                      href="/hesabim/orders" 
                      className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2m-9-1a2 2 0 0 1 4 0v1h-4Z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Siparişlerim</h4>
                        <p className="text-sm text-gray-600">Sipariş geçmişiniz</p>
                      </div>
                    </Link>
                    
                    <Link 
                      href="/hesabim/rewards" 
                      className="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200 border border-transparent hover:border-purple-200 hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 16L3 5l5.5-5L12 4l3.5-4L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1-2.1L12 8l-3.1-1.5-2.1 2.1L7.7 14z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Ödüllerim</h4>
                        <p className="text-sm text-gray-600">Puan karşılığı ödüller</p>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Ödül Kataloğu */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Ödül Kataloğu</h3>
                    <button className="text-purple-100 hover:text-white text-sm underline transition-colors font-medium">
                      Tümünü Gör
                    </button>
                  </div>
                  <div className="p-6">
                    <RewardsList rewards={rewards.slice(0, 2)} onRedeem={handleRedeemReward} />
                    {rewards.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                        </svg>
                        <p className="font-medium">Henüz ödül bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 