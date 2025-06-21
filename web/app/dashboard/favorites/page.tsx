'use client';

import { useState } from 'react';

interface FavoriteItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  isFavorite: boolean;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      name: "Cappuccino",
      category: "Sıcak İçecekler",
      price: 25,
      image: "/api/placeholder/200/200",
      description: "Kremalı köpük ve espresso ile hazırlanan klasik İtalyan kahvesi",
      rating: 4.8,
      isFavorite: true
    },
    {
      id: 2,
      name: "Tiramisu",
      category: "Tatlılar",
      price: 35,
      image: "/api/placeholder/200/200",
      description: "Geleneksel İtalyan tatlısı, kahve ve mascarpone ile",
      rating: 4.9,
      isFavorite: true
    },
    {
      id: 3,
      name: "Avokado Toast",
      category: "Atıştırmalıklar",
      price: 28,
      image: "/api/placeholder/200/200",
      description: "Taze avokado, lime ve chia tohumu ile",
      rating: 4.6,
      isFavorite: true
    },
    {
      id: 4,
      name: "Cold Brew",
      category: "Soğuk İçecekler",
      price: 22,
      image: "/api/placeholder/200/200",
      description: "12 saat soğuk demleme ile hazırlanan özel kahve",
      rating: 4.7,
      isFavorite: true
    }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const toggleFavorite = (id: number) => {
    setFavorites(favorites.map(item => 
      item.id === id 
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(item => item.category === filter);

  const categories = ['all', ...Array.from(new Set(favorites.map(item => item.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Favorilerim</h1>
          <p className="text-coffee-100 text-lg">Beğendiğiniz ürünler burada</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-coffee-600 mb-2">{favorites.length}</div>
            <div className="text-gray-600">Toplam Favori</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-coffee-600 mb-2">
              {Array.from(new Set(favorites.map(item => item.category))).length}
            </div>
            <div className="text-gray-600">Kategori</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-coffee-600 mb-2">
              {(favorites.reduce((sum, item) => sum + item.rating, 0) / favorites.length).toFixed(1)}
            </div>
            <div className="text-gray-600">Ortalama Puan</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  filter === category
                    ? 'bg-coffee-600 text-white'
                    : 'bg-white text-coffee-600 hover:bg-coffee-50'
                } border border-coffee-200`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="bg-white/90 backdrop-blur-sm text-red-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => removeFromFavorites(item.id)}
                      className="bg-white/90 backdrop-blur-sm text-gray-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-colors duration-200"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-coffee-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium text-gray-600">{item.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-coffee-600">₺{item.price}</div>
                    <button className="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors duration-200">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz favori ürününüz yok</h3>
            <p className="text-gray-600 mb-8">Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz</p>
            <button className="bg-coffee-600 text-white px-6 py-3 rounded-lg hover:bg-coffee-700 transition-colors duration-200">
              Menüyü Keşfet
            </button>
          </div>
        )}

        {/* Recommendations */}
        {favorites.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Size Önerebileceğimiz Ürünler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                  ☕
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Latte Macchiato</h3>
                <p className="text-gray-600 text-sm mb-4">Cappuccino seviyorsanız bunu da beğeneceksiniz</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-coffee-600">₺27</span>
                  <button className="text-coffee-600 hover:text-coffee-700">
                    Favorilere Ekle →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                  🧁
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cheesecake</h3>
                <p className="text-gray-600 text-sm mb-4">Tiramisu severler için özel öneri</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-coffee-600">₺32</span>
                  <button className="text-coffee-600 hover:text-coffee-700">
                    Favorilere Ekle →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                  🥗
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quinoa Salad</h3>
                <p className="text-gray-600 text-sm mb-4">Sağlıklı seçimler için ideal</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-coffee-600">₺30</span>
                  <button className="text-coffee-600 hover:text-coffee-700">
                    Favorilere Ekle →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 