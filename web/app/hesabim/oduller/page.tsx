'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getRewards, redeemPoints } from '../../api';
import Link from 'next/link';

interface Reward {
  _id: string;
  name: string;
  description: string;
  pointCost: number;
  category: string;
  isActive: boolean;
  quantity: number;
  redemptionCount: number;
  expiryDate: string;
  image?: string;
  createdAt: string;
}

export default function RewardsPage() {
  const { user, token, refreshUser } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await getRewards();
      console.log('Rewards response:', response);
      // Backend'ten direkt array geliyorsa
      setRewards(Array.isArray(response) ? response : response.rewards || []);
    } catch (error) {
      console.error('Ödüller yüklenirken hata:', error);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string, pointCost: number) => {
    if (!token || !user) return;
    
    if (user.points! < pointCost) {
      alert('Yetersiz puan! Bu ödülü alabilmek için daha fazla puana ihtiyacınız var.');
      return;
    }

    if (confirm(`Bu ödülü ${pointCost} puan karşılığında almak istediğinizden emin misiniz?`)) {
      setRedeeming(rewardId);
      try {
        await redeemPoints(token, rewardId);
        await refreshUser(); // Puanları güncelle
        alert('Ödül başarıyla alındı! Ödülünüz hesabınıza tanımlandı.');
      } catch (error) {
        console.error('Ödül alınırken hata:', error);
        alert('Ödül alınırken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setRedeeming(null);
      }
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (selectedCategory === 'all') return reward.isActive;
    return reward.isActive && reward.category === selectedCategory;
  });

  const categories = [...new Set(rewards.map(reward => reward.category))];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kahve': return '☕';
      case 'yiyecek': return '🍽️';
      case 'tatlı': return '🧁';
      case 'içecek': return '🥤';
      case 'özel': return '⭐';
      default: return '🎁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kahve': return 'from-amber-500 to-orange-600';
      case 'yiyecek': return 'from-green-500 to-emerald-600';
      case 'tatlı': return 'from-pink-500 to-rose-600';
      case 'içecek': return 'from-blue-500 to-cyan-600';
      case 'özel': return 'from-purple-500 to-indigo-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Ödüller yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-2xl mr-2">🏆</span>
              <span className="text-sm font-medium">Puan Sistemi</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Ödüllerim
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Puanlarınızla harika ödüller kazanın, özel indirimlerden yararlanın ve premium deneyimler yaşayın
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-lg">Hedefe Odaklı</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">💎</span>
                <span className="text-lg font-bold">{user?.points || 0} Puan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🎯
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{filteredRewards.length}</div>
                <div className="text-gray-600">Mevcut Ödül</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ⚡
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {filteredRewards.filter(r => (user?.points || 0) >= r.pointCost).length}
                </div>
                <div className="text-gray-600">Alabileceğiniz Ödül</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🏆
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {filteredRewards.length > 0 ? Math.min(...filteredRewards.map(r => r.pointCost)) : 0}
                </div>
                <div className="text-gray-600">En Düşük Puan</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 mb-8">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Kategori Filtresi</h3>
                  <p className="text-gray-600">İstediğiniz kategorideki ödülleri görüntüleyin</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎁 Tümü ({rewards.filter(r => r.isActive).length})
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getCategoryIcon(category)} {category} ({rewards.filter(r => r.isActive && r.category === category).length})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rewards Grid */}
          {filteredRewards.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600"></div>
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6">
                  😔
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Henüz Ödül Yok</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Seçtiğiniz kategoride aktif ödül bulunmuyor. Daha fazla puan kazanmak için sipariş verin!
                </p>
                <Link 
                  href="/menu"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🍽️ Menüyü İncele
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRewards.map((reward) => (
                <div key={reward._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(reward.category)}`}></div>
                  
                  {/* Reward Header */}
                  <div className={`bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative`}>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <span className="text-2xl">{getCategoryIcon(reward.category)}</span>
                      </div>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(reward.category)} rounded-2xl flex items-center justify-center text-white text-2xl mb-4`}>
                      🎁
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.name}</h3>
                    <div className="inline-flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
                      <span className="text-sm font-semibold text-gray-700">{reward.category}</span>
                    </div>
                  </div>

                  {/* Reward Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">{reward.description}</p>
                    
                    {/* Point Cost */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Gerekli Puan</div>
                          <div className="text-2xl font-bold text-orange-600">{reward.pointCost}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Mevcut Puanınız</div>
                          <div className={`text-xl font-bold ${(user?.points || 0) >= reward.pointCost ? 'text-green-600' : 'text-red-600'}`}>
                            {user?.points || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>İlerleme</span>
                        <span>{Math.min(((user?.points || 0) / reward.pointCost) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            (user?.points || 0) >= reward.pointCost 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${Math.min(((user?.points || 0) / reward.pointCost) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Kalan Stok</div>
                        <div className="font-bold text-gray-900">{reward.quantity}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Kullanım</div>
                        <div className="font-bold text-gray-900">{reward.redemptionCount}</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleRedeemReward(reward._id, reward.pointCost)}
                      disabled={
                        (user?.points || 0) < reward.pointCost || 
                        redeeming === reward._id || 
                        reward.quantity <= 0
                      }
                      className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                        (user?.points || 0) >= reward.pointCost && reward.quantity > 0
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {redeeming === reward._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Ödül Alınıyor...</span>
                        </div>
                      ) : (user?.points || 0) < reward.pointCost ? (
                        `❌ Yetersiz Puan (${reward.pointCost - (user?.points || 0)} eksik)`
                      ) : reward.quantity <= 0 ? (
                        '🔒 Stokta Yok'
                      ) : (
                        `🎁 Ödülü Al (${reward.pointCost} puan)`
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How to Earn Points */}
          <div className="mt-12 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-4 py-2 mb-4">
                  <span className="text-xl mr-2">💡</span>
                  <span className="text-sm font-semibold text-green-800">Puan Kazanma Rehberi</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nasıl Daha Fazla Puan Kazanabilirsiniz?
                </h3>
                <p className="text-gray-600">Her siparişinizle puan kazanın ve harika ödüllere ulaşın</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                    🛒
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Sipariş Verin</h4>
                  <p className="text-sm text-gray-600 mb-3">Her 1₺ harcama = 1 puan</p>
                  <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full inline-block">
                    Temel Kazanç
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                    🎯
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Hedefleri Tamamlayın</h4>
                  <p className="text-sm text-gray-600 mb-3">Haftalık hedefler ile bonus puan</p>
                  <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full inline-block">
                    Bonus Kazanç
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                    🌟
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Özel Etkinlikler</h4>
                  <p className="text-sm text-gray-600 mb-3">Kampanyalarda 2x puan kazanın</p>
                  <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full inline-block">
                    Çarpan Kazanç
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 