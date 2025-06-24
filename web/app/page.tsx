'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

const coffeeMenu = [
  { id: 1, name: 'Türk Kahvesi', price: '45 ₺', category: 'Klasik', emoji: '☕' },
  { id: 2, name: 'Flat White', price: '60 ₺', category: 'Espresso Bazlı', emoji: '🥛' },
  { id: 3, name: 'Filtre Kahve', price: '55 ₺', category: 'Filtre', emoji: '☕' },
  { id: 4, name: 'Cold Brew', price: '65 ₺', category: 'Soğuk İçecekler', emoji: '🧊' },
];

const testimonials = [
  { 
    id: 1, 
    name: 'Ahmet Yılmaz', 
    text: 'AI önerileri sayesinde daha önce hiç denemediğim kahveleri keşfettim. Artık her seferinde mükemmel lezzet!', 
    rating: 5,
    title: 'Sadık Müşteri'
  },
  { 
    id: 2, 
    name: 'Ayşe Kaya', 
    text: 'Akıllı sipariş sistemi tercihlerimi öğrendi. Sadece bir tıkla her zaman favori kahvem hazır!', 
    rating: 5,
    title: 'Premium Üye'
  },
  { 
    id: 3, 
    name: 'Mehmet Demir', 
    text: 'AI destekli sadakat programı ile kişiselleştirilmiş indirimler alıyorum. Teknoloji ve lezzet bir arada!', 
    rating: 5,
    title: 'Elmas Üye'
  },
];

const features = [
  {
    emoji: '🤖',
    title: 'AI Kahve Önerileri',
    description: 'Yapay zeka teknolojisi ile kişisel tercihlerinize uygun kahve önerileri alın',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    emoji: '⚡',
    title: 'Akıllı Sipariş',
    description: 'Tercihlerinizi öğrenen sistem ile hızlı ve kolay sipariş deneyimi',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    emoji: '🎁',
    title: 'Kişiselleştirilmiş Ödüller',
    description: 'AI destekli sadakat programı ile size özel indirimler ve avantajlar',
    gradient: 'from-orange-500 to-red-500'
  }
];

// Unsplash resim URL'leri - cafe/coffee temalı
const getCoffeeImage = (index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
  ];
  return images[index % images.length];
};

const getHeroImage = () => {
  return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=1080&fit=crop';
};

const getLoyaltyImage = () => {
  return 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop';
};

const getInstagramImage = (index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop'
  ];
  return images[index % images.length];
};

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay" 
            style={{ 
              backgroundImage: `url('${getHeroImage()}')`,
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <span className="text-3xl mr-3">🤖</span>
            <span className="text-lg font-semibold">AI Destekli Kahve Teknolojisi</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent leading-tight">
            AI Destekli<br />Kahve Deneyimi
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed">
            Yapay zeka teknolojisi ile kişiselleştirilmiş kahve önerileri ve mükemmel lezzet deneyimi. 
            Geleceğin kahve kültürünü bugün yaşayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link 
              href="/menu" 
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              🍴 Menüyü Keşfet
            </Link>
            {isLoading ? (
              <div className="px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yükleniyor...</span>
                </div>
              </div>
            ) : user ? (
              <Link 
                href="/hesabim" 
                className="px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl hover:bg-white/30 transition-all duration-300 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                👤 Hesabım
              </Link>
            ) : (
              <Link 
                href="/kayit" 
                className="px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl hover:bg-white/30 transition-all duration-300 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🚀 AI Deneyimini Başlat
              </Link>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>AI Destekli Öneriler</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Akıllı Sipariş Sistemi</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Kişiselleştirilmiş Deneyim</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mb-6">
              <span className="text-xl mr-2">⭐</span>
              <span className="text-sm font-semibold text-orange-800">Özellikler</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI ile Yeni Nesil Kahve Deneyimi
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Teknoloji ve geleneksel kahve kültürünü harmanlayarak size eşsiz bir deneyim sunuyoruz
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-white/90">Servis Edilen Kahve</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Mutlu Müşteri</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/90">AI Doğruluk Oranı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/90">AI Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Menu Preview */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mb-6">
              <span className="text-xl mr-2">☕</span>
              <span className="text-sm font-semibold text-orange-800">Menü Önizleme</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">AI Tarafından Önerilen Kahveler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Yapay zeka algoritması ile sizin için özel olarak seçilmiş en popüler kahve çeşitleri
            </p>
            <Link 
              href="/menu" 
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2">📖</span>
              Tüm Menüyü Gör
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coffeeMenu.map((item, index) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={getCoffeeImage(index)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-coffee.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {item.category}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{item.price}</span>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-4 py-2 mb-6">
              <span className="text-xl mr-2">💬</span>
              <span className="text-sm font-semibold text-orange-800">Müşteri Yorumları</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Misafirlerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI destekli kahve deneyimimizi yaşayan müşterilerimizin gerçek yorumları
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden min-h-[300px]">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out ${
                    index === activeTestimonial 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-2xl">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl">{testimonial.name}</h3>
                        <p className="text-gray-300 text-lg">{testimonial.title}</p>
                        <div className="flex items-center mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xl">⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                                         <p className="text-xl italic leading-relaxed text-gray-200">&ldquo;{testimonial.text}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Yorum ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Program CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mb-6 w-fit">
                  <span className="text-xl mr-2">🎁</span>
                  <span className="text-sm font-semibold text-orange-800">Sadakat Programı</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  AI Destekli Sadakat Programımıza Katılın
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Yapay zeka destekli sadakat programı ile her siparişinizde puan kazanın, 
                  kişiselleştirilmiş öneriler alın ve özel avantajlardan yararlanın.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Her 1₺ harcamada 1 puan kazanın</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">AI destekli kişisel öneriler</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Özel indirimler ve kampanyalar</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/kayit" 
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-center font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    🚀 Hemen Üye Ol
                  </Link>
                  <Link 
                    href="/sadakat-programi" 
                    className="px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 text-center font-bold hover:shadow-lg transform hover:-translate-y-1"
                  >
                    📖 Daha Fazla Bilgi
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[400px]">
                <img
                  src={getLoyaltyImage()}
                  alt="Sadakat Programı"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-loyalty.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-xl mr-2">📸</span>
              <span className="text-sm font-semibold text-pink-800">Sosyal Medya</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">Instagram&rsquo;da Bizi Takip Edin</h2>
            <p className="text-xl text-gray-300 mb-8">@cafepoweredbyai</p>
            <a 
              href="https://instagram.com/cafepoweredbyai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2">📱</span>
              Takip Et
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <a 
                href="https://instagram.com/cafepoweredbyai" 
                target="_blank" 
                rel="noopener noreferrer"
                key={index} 
                className="aspect-square relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={getInstagramImage(index)}
                  alt={`Instagram Post ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-instagram.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-sm font-semibold">Instagram&rsquo;da Gör</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <div className="text-6xl mb-8">🚀</div>
            <h2 className="text-5xl font-bold mb-6">
              Geleceğin Kahve Deneyimini Bugün Yaşayın
            </h2>
            <p className="text-xl mb-12 leading-relaxed opacity-90">
              AI destekli teknoloji, premium kahve kalitesi ve kişiselleştirilmiş hizmet. 
              Size özel kahve yolculuğunuza hemen başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/menu"
                className="bg-white text-orange-600 px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                ☕ Kahve Keşfine Başla
              </Link>
              <Link
                href="/kayit"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🎁 Ücretsiz Üye Ol
              </Link>
            </div>
            <div className="mt-8 flex justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Ücretsiz üyelik</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Anında AI önerileri</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Premium kahve kalitesi</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
