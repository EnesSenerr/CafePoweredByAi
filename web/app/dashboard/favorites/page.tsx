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
  const { user } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Favorileriniz yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Favori Ürünlerim
            </h1>
            <p className="text-gray-600">
              En sevdiğiniz ürünleri tekrar sipariş etmek için tek tıklayın
            </p>
          </div>
        </div>

        {/* Favoriler Listesi */}
        <div className="grid gap-6">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz favori ürününüz yok
              </h3>
              <p className="text-gray-600 mb-6">
                Beğendiğiniz ürünleri favorilere ekleyerek hızlıca tekrar sipariş verebilirsiniz
              </p>
              <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors">
                Menüyü İncele
              </button>
            </div>
          ) : (
            favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-amber-600 font-medium">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={i < item.rating ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Favorilere eklendi: {new Date(item.addedDate).toLocaleDateString('tr-TR')}</span>
                      <span>•</span>
                      <span>{item.orderCount} kez sipariş edildi</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {item.price.toFixed(2)} ₺
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Sepete Ekle
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        Favorilerden Çıkar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Öneriler */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Size Özel Öneriler
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Favori Kombinasyonunuz</h4>
                <p className="text-sm text-gray-600">Cappuccino + Tiramisu = %10 İndirim</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Bu Hafta Popüler</h4>
                <p className="text-sm text-gray-600">Cold Brew - Yeni tatmaya ne dersiniz?</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Puan Kazanın</h4>
                <p className="text-sm text-gray-600">3 sipariş daha = 50 bonus puan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 