'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CTASection from '../components/CTASection';
import { getMenuItems, getMenuCategories } from '../api';

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
      // Sadece aktif olan menü itemlarını al
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
    <div className="min-h-screen bg-coffee-50">
      {/* Header */}
      <div className="bg-coffee-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Menümüz
            </h1>
            <p className="text-xl text-coffee-100 max-w-2xl mx-auto font-medium">
              En taze malzemeler ve özenle seçilmiş kahve çekirdekleri ile hazırlanan 
              özel lezzetlerimizi keşfedin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-colors font-semibold ${
                  selectedCategory === category
                    ? 'bg-coffee-700 text-white shadow-md'
                    : 'bg-coffee-100 text-coffee-900 hover:bg-coffee-200 border-2 border-coffee-300'
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
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-700 mx-auto mb-4"></div>
              <p className="text-coffee-600">Menü yükleniyor...</p>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz menü öğesi bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-coffee-100 flex items-center justify-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
                {item.isPopular && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Popüler
                  </div>
                )}
                {item.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Tükendi
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-rose-600">{item.price}₺</span>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Extra Info */}
                <div className="space-y-2 mb-4 text-xs text-gray-600">
                  {item.preparationTime && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{item.preparationTime} dk</span>
                    </div>
                  )}
                  {item.calories && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.calories} kcal</span>
                    </div>
                  )}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="text-red-600">
                      <span className="font-medium">Alerjenler:</span> {item.allergens.join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-coffee-600 bg-coffee-100 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      item.stock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-coffee-700 text-white hover:bg-coffee-800'
                    }`}
                    disabled={item.stock === 0}
                  >
                    {item.stock === 0 ? 'Tükendi' : 'Sepete Ekle'}
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && selectedCategory !== "Tümü" && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <CTASection 
        title="Kahve Deneyiminizi Başlatın"
        description="Sadakat programımıza üye olun, her siparişinizde puan kazanın ve özel indirimlerden yararlanın."
        primaryButtonText="Sipariş Ver"
        primaryButtonHref="/menu"
        secondaryButtonText="Dashboard"
        secondaryButtonHref="/dashboard"
      />
    </div>
  );
} 