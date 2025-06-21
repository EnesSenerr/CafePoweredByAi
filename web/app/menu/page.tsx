'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // Kahveler
  {
    id: 1,
    name: "Espresso",
    description: "İtalyan geleneksel espresso, yoğun ve aromalı",
    price: 25,
    category: "Kahveler",
    popular: true
  },
  {
    id: 2,
    name: "Americano",
    description: "Espresso ve sıcak su ile hazırlanan hafif kahve",
    price: 30,
    category: "Kahveler"
  },
  {
    id: 3,
    name: "Cappuccino",
    description: "Espresso, süt ve süt köpüğü ile hazırlanan klasik",
    price: 35,
    category: "Kahveler",
    popular: true
  },
  {
    id: 4,
    name: "Latte",
    description: "Espresso ve bolca süt ile hazırlanan yumuşak kahve",
    price: 38,
    category: "Kahveler"
  },
  {
    id: 5,
    name: "Mocha",
    description: "Espresso, çikolata ve süt ile hazırlanan tatlı kahve",
    price: 42,
    category: "Kahveler"
  },
  
  // Soğuk İçecekler
  {
    id: 6,
    name: "Buzlu Americano",
    description: "Soğuk americano, ferahlatıcı ve güçlü",
    price: 32,
    category: "Soğuk İçecekler"
  },
  {
    id: 7,
    name: "Frappe",
    description: "Blender'da hazırlanan köpüklü soğuk kahve",
    price: 40,
    category: "Soğuk İçecekler",
    popular: true
  },
  {
    id: 8,
    name: "Soğuk Brew",
    description: "12 saat soğuk demlenen özel kahve",
    price: 45,
    category: "Soğuk İçecekler"
  },
  
  // Tatlılar
  {
    id: 9,
    name: "Cheesecake",
    description: "Ev yapımı New York usulü cheesecake",
    price: 55,
    category: "Tatlılar",
    popular: true
  },
  {
    id: 10,
    name: "Tiramisu",
    description: "İtalyan klasiği, kahve aromalı tatlı",
    price: 50,
    category: "Tatlılar"
  },
  {
    id: 11,
    name: "Brownie",
    description: "Çikolatalı brownie, vanilyalı dondurma ile",
    price: 45,
    category: "Tatlılar"
  },
  
  // Atıştırmalıklar
  {
    id: 12,
    name: "Croissant",
    description: "Fransız usulü tereyağlı croissant",
    price: 20,
    category: "Atıştırmalıklar"
  },
  {
    id: 13,
    name: "Sandviç",
    description: "Taze malzemeler ile hazırlanan sandviç",
    price: 35,
    category: "Atıştırmalıklar"
  }
];

const categories = ["Tümü", "Kahveler", "Soğuk İçecekler", "Tatlılar", "Atıştırmalıklar"];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-coffee-100 flex items-center justify-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
                {item.popular && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Popüler
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
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-coffee-600 bg-coffee-100 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  
                  <button className="px-4 py-2 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800 transition-colors text-sm font-medium">
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-coffee-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Kahve Deneyiminizi Başlatın
          </h2>
          <p className="text-coffee-100 mb-8 max-w-2xl mx-auto font-medium">
            Sadakat programımıza üye olun, her siparişinizde puan kazanın ve 
            özel indirimlerden yararlanın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-cream-400 text-coffee-800 rounded-lg hover:bg-cream-300 transition-colors font-semibold"
            >
              Üye Ol
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-coffee-800 transition-colors font-semibold"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 