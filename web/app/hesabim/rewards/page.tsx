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

  const getDiscountText = (reward: Reward) => {
    if (reward.name.includes('%')) {
      return reward.name.split(' - ')[0]; // "%20 İndirim" gibi
    } else if (reward.name.includes('₺')) {
      return reward.name.split(' - ')[0]; // "10₺ İndirim" gibi
    } else if (reward.name.includes('Ücretsiz')) {
      return 'Ücretsiz Ürün';
    } else {
      return 'Özel İndirim';
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ödüllerim</h1>
              <p className="text-coffee-100 text-lg">Puanlarınızla harika ödüller kazanın</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">
                  {user?.points || 0}
                </div>
                <div className="text-sm text-coffee-100">Mevcut Puanım</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-coffee-800 mb-1">{filteredRewards.length}</div>
              <div className="text-gray-600">Mevcut Ödül</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {filteredRewards.filter(r => (user?.points || 0) >= r.pointCost).length}
              </div>
              <div className="text-gray-600">Alabileceğiniz Ödül</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {Math.min(...filteredRewards.map(r => r.pointCost)) || 0}
              </div>
              <div className="text-gray-600">En Düşük Puan</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kategori Filtresi</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-coffee-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎁 Tümü ({rewards.filter(r => r.isActive).length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-coffee-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)} {category} ({rewards.filter(r => r.isActive && r.category === category).length})
                </button>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600"></div>
              <p className="mt-4 text-gray-600">Ödüller yükleniyor...</p>
            </div>
          ) : filteredRewards.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz Ödül Yok</h3>
              <p className="text-gray-600 mb-6">
                Seçtiğiniz kategoride aktif ödül bulunmuyor. Daha fazla puan kazanmak için sipariş verin!
              </p>
              <Link 
                href="/menu" 
                className="bg-coffee-600 text-white px-6 py-3 rounded-lg hover:bg-coffee-700 transition-colors"
              >
                Menüyü İncele
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => {
                const canRedeem = (user?.points || 0) >= reward.pointCost;
                const isRedeemingThis = redeeming === reward._id;
                const daysLeft = Math.ceil((new Date(reward.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const stockLeft = reward.quantity - reward.redemptionCount;
                
                return (
                  <div
                    key={reward._id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      canRedeem ? 'hover:-translate-y-1' : 'opacity-75'
                    }`}
                  >
                    {/* Reward Header */}
                    <div className={`bg-gradient-to-r ${getCategoryColor(reward.category)} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(reward.category)}</span>
                          <span className="text-white font-medium">{reward.category}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white font-bold">{reward.pointCost} Puan</span>
                        </div>
                      </div>
                    </div>

                    {/* Reward Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{reward.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {getDiscountText(reward)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süresi dolmuş'}
                        </div>
                      </div>

                      {/* Stock Stats */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Stok Durumu</span>
                          <span>{stockLeft}/{reward.quantity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-coffee-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((stockLeft / reward.quantity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleRedeemReward(reward._id, reward.pointCost)}
                        disabled={!canRedeem || isRedeemingThis || stockLeft <= 0 || daysLeft <= 0}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                          canRedeem && stockLeft > 0 && daysLeft > 0
                            ? 'bg-coffee-600 text-white hover:bg-coffee-700 transform hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isRedeemingThis ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Alınıyor...
                          </span>
                        ) : !canRedeem ? (
                          `${reward.pointCost - (user?.points || 0)} puan eksik`
                        ) : stockLeft <= 0 ? (
                          'Stokta yok'
                        ) : daysLeft <= 0 ? (
                          'Süresi dolmuş'
                        ) : (
                          'Ödülü Al'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* How to Earn Points */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nasıl Puan Kazanırım?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🛒</div>
                <h4 className="font-semibold mb-2">Sipariş Ver</h4>
                <p className="text-gray-600 text-sm">Her 1₺ harcamanda 1 puan kazanın</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎂</div>
                <h4 className="font-semibold mb-2">Doğum Günü</h4>
                <p className="text-gray-600 text-sm">Doğum gününüzde özel bonus puanlar</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">⭐</div>
                <h4 className="font-semibold mb-2">Özel Kampanyalar</h4>
                <p className="text-gray-600 text-sm">Kampanyalı ürünlerden ekstra puan</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/menu" 
                className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-8 py-3 rounded-lg hover:from-coffee-700 hover:to-coffee-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
              >
                Hemen Sipariş Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 