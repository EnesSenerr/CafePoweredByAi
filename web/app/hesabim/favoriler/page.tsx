'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  addedDate: string;
  orderCount: number;
  rating: number;
}

export default function FavoritesPage() {
  const { } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo veriler
  useEffect(() => {
    // API çağrısı simülasyonu
    setTimeout(() => {
      setFavorites([
        {
          id: '1',
          name: 'Cappuccino',
          price: 28.00,
          category: 'Kahve',
          description: 'Espresso, buharda ısıtılmış süt ve süt köpüğünün mükemmel harmonisi.',
          addedDate: '2024-01-15',
          orderCount: 12,
          rating: 5
        },
        {
          id: '2',
          name: 'Americano',
          price: 25.50,
          category: 'Kahve',
          description: 'Sade espresso üzerine sıcak su eklenerek hazırlanır.',
          addedDate: '2024-01-10',
          orderCount: 8,
          rating: 4
        },
        {
          id: '3',
          name: 'Tiramisu',
          price: 45.00,
          category: 'Tatlı',
          description: 'İtalyan klasiği: mascarpone peyniri, ladyfinger bisküvi ve espresso ile.',
          addedDate: '2024-01-08',
          orderCount: 5,
          rating: 5
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const handleAddToCart = (item: FavoriteItem) => {
    // Sepete ekleme mantığı
    console.log('Sepete eklendi:', item.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Favorileriniz yükleniyor...</p>
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
              <span className="text-2xl mr-2">❤️</span>
              <span className="text-sm font-medium">Kişisel Tercihler</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Favori Ürünlerim
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              En sevdiğiniz ürünleri buradan kolayca tekrar sipariş edebilir, yeni favoriler keşfedebilirsiniz
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">⚡</span>
                <span className="text-lg">Hızlı Sipariş</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-lg">Kişisel Seçimler</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ❤️
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{favorites.length}</div>
                <div className="text-gray-600">Favori Ürün</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  📊
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {favorites.reduce((sum, item) => sum + item.orderCount, 0)}
                </div>
                <div className="text-gray-600">Toplam Sipariş</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  💰
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {(favorites.reduce((sum, item) => sum + (item.price * item.orderCount), 0)).toFixed(0)} ₺
                </div>
                <div className="text-gray-600">Toplam Harcama</div>
              </div>
            </div>
          </div>

          {/* Favoriler Listesi */}
          <div className="space-y-6">
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6">
                    😔
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Henüz favori ürününüz yok
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Beğendiğiniz ürünleri favorilere ekleyerek hızlıca tekrar sipariş verebilirsiniz
                  </p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🍽️ Menüyü İncele
                  </button>
                </div>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-6 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                            {item.category === 'Kahve' ? '☕' : item.category === 'Tatlı' ? '🧁' : '🍽️'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-3 py-1">
                                <span className="text-sm font-semibold text-orange-800">{item.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xl ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  ⭐
                                </span>
                              ))}
                              <span className="text-gray-600 ml-2">({item.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-lg leading-relaxed">{item.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Favorilere eklendi: {new Date(item.addedDate).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>{item.orderCount} kez sipariş edildi</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {item.price.toFixed(2)} ₺
                          </div>
                          <div className="text-sm text-gray-500">Birim fiyat</div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                          >
                            🛒 Sepete Ekle
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            ❌ Favorilerden Çıkar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Öneriler */}
          {favorites.length > 0 && (
            <div className="mt-12 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-4">
                    <span className="text-xl mr-2">💡</span>
                    <span className="text-sm font-semibold text-purple-800">Size Özel Öneriler</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    AI Destekli Önerilerimiz
                  </h3>
                  <p className="text-gray-600">Favori tercihlerinize göre özel öneriler</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                      🎯
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Favori Kombinasyonunuz</h4>
                    <p className="text-sm text-gray-600 mb-3">Cappuccino + Tiramisu = %10 İndirim</p>
                    <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full inline-block">
                      Özel Fırsat
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                      🔥
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Bu Hafta Popüler</h4>
                    <p className="text-sm text-gray-600 mb-3">Cold Brew - Yeni tatmaya ne dersiniz?</p>
                    <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full inline-block">
                      Trend
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                      🏆
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Puan Kazanın</h4>
                    <p className="text-sm text-gray-600 mb-3">3 sipariş daha = 50 bonus puan</p>
                    <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full inline-block">
                      Hediye
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 