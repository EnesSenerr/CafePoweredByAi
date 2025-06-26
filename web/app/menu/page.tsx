'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMenuItems, getMenuCategories } from '../api';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular?: boolean;
  available: boolean;
  stock: number;
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  preparationTime?: number;
}

// Varsayılan menü resimleri
const getDefaultImage = (category: string, name: string) => {
  const images = {
    'Kahve': [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ],
    'Espresso': [
      'https://images.unsplash.com/photo-1510707577035-a116dda6b2b1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519082274554-1ca37fb8abb7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop'
    ],
    'Latte': [
      'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
    ],
    'Çay': [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop'
    ],
    'Soğuk İçecekler': [
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502462041640-173d867996a2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
    ],
    'Tatlılar': [
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    ],
    'Atıştırmalıklar': [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
    ]
  };
  
  const categoryImages = images[category as keyof typeof images] || images['Kahve'];
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return categoryImages[hash % categoryImages.length];
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tümü"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await getMenuItems({ available: true });
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Menu items yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getMenuCategories();
      const apiCategories = response.data || [];
      setCategories(["Tümü", ...apiCategories]);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const filteredItems = selectedCategory === "Tümü" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-2xl mr-2">☕</span>
              <span className="text-sm font-medium">AI Destekli Kahve Menüsü</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Menümüz
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              En taze malzemeler ve özenle seçilmiş kahve çekirdekleri ile hazırlanan özel lezzetlerimizi keşfedin
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🌟</span>
                <span className="text-lg">Premium Kalite</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🚚</span>
                <span className="text-lg">Hızlı Teslimat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md shadow-lg z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Menü yükleniyor...</p>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Henüz menü öğesi bulunmuyor</h3>
            <p className="text-gray-600">Lütkin daha sonra tekrar kontrol edin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={item.image || getDefaultImage(item.category, item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    width={200}
                    height={200}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultImage(item.category, item.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isPopular && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <span className="mr-1">⭐</span>
                        Popüler
                      </div>
                    )}
                    {item.stock === 0 && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                        Tükendi
                      </div>
                    )}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-lg font-bold px-3 py-1 rounded-full">
                    {item.price}₺
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Extra Info */}
                  {(item.preparationTime || item.calories || (item.allergens && item.allergens.length > 0)) && (
                    <div className="space-y-2 mb-4">
                      {item.preparationTime && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">⏱</span>
                          </div>
                          <span className="font-medium">{item.preparationTime} dakika</span>
                        </div>
                      )}
                      {item.calories && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">🔥</span>
                          </div>
                          <span className="font-medium">{item.calories} kcal</span>
                        </div>
                      )}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs">⚠</span>
                          </div>
                          <div>
                            <span className="font-medium text-red-600">Alerjenler:</span>
                            <span className="text-gray-600 ml-1">{item.allergens.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Category and Action */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    
                    <button 
                      className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-semibold ${
                        item.stock === 0 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      }`}
                      disabled={item.stock === 0}
                    >
                      {item.stock === 0 ? (
                        <>
                          <span className="mr-1">😞</span>
                          Tükendi
                        </>
                      ) : (
                        <>
                          <span className="mr-1">🛒</span>
                          Sepete Ekle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && selectedCategory !== "Tümü" && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bu kategoride ürün bulunmuyor</h3>
            <p className="text-gray-600 mb-6">Diğer kategorileri kontrol etmeyi deneyin.</p>
            <button
              onClick={() => setSelectedCategory("Tümü")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold"
            >
              Tüm Ürünleri Gör
            </button>
          </div>
        )}
      </div>

      {/* Special Features Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🌟 Özel Özelliklerimiz</h2>
            <p className="text-gray-300 text-lg">AI destekli kahve deneyimimizin avantajlarını keşfedin</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Önerileri</h3>
              <p className="text-gray-300 text-sm">Tercihlerinize göre kişiselleştirilmiş menü önerileri</p>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Hızlı Hazırlık</h3>
              <p className="text-gray-300 text-sm">Gelişmiş teknoloji ile minimum bekleme süresi</p>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Kalite Garantisi</h3>
              <p className="text-gray-300 text-sm">Her fincanda aynı mükemmel lezzet standardı</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-100 via-red-50 to-pink-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kahve Yolculuğunuzu Başlatın
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Sadakat programımıza üye olun, her siparişinizde puan kazanın ve AI destekli kişiselleştirilmiş 
              önerilerle kahve deneyiminizi bir üst seviyeye taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kayit"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🎁 Ücretsiz Üye Ol
              </Link>
              <Link
                href="/sadakat-programi"
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1"
              >
                📊 Sadakat Programını İncele
              </Link>
            </div>
            <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Anında puan kazanma</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>AI özel öneriler</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Özel indirimler</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 