'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const coffeeMenu = [
  { id: 1, name: 'Türk Kahvesi', price: '45 ₺', image: '/images/turkish-coffee.jpg', category: 'Klasik' },
  { id: 2, name: 'Flat White', price: '60 ₺', image: '/images/flat-white.jpg', category: 'Espresso Bazlı' },
  { id: 3, name: 'Filtre Kahve', price: '55 ₺', image: '/images/filter-coffee.jpg', category: 'Filtre' },
  { id: 4, name: 'Cold Brew', price: '65 ₺', image: '/images/cold-brew.jpg', category: 'Soğuk İçecekler' },
];

const testimonials = [
  { id: 1, name: 'Ahmet Yılmaz', text: 'Bu kafeye her geldiğimde kendimi evimde gibi hissediyorum. Türk kahvesi özellikle harika!', avatar: '/images/avatar-1.jpg' },
  { id: 2, name: 'Ayşe Kaya', text: 'Sadakat programı sayesinde her ay birkaç kahve bedavaya geliyor. Üstelik baristalar çok ilgili.', avatar: '/images/avatar-2.jpg' },
  { id: 3, name: 'Mehmet Demir', text: 'AI Cafe\'nin organik çekirdeklerini çok seviyorum. Sürdürülebilirliğe verdikleri önem takdire şayan.', avatar: '/images/avatar-3.jpg' },
];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-coffee-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col justify-center items-center text-center text-white">
        <div className="absolute inset-0 bg-black z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('/images/cafe-hero.jpg')", 
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
            Premium Kahve Deneyimi
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Özenle seçilen çekirdeklerden, uzman baristalar tarafından hazırlanan eşsiz kahveler
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="px-8 py-3 bg-coffee-600 text-white rounded-full hover:bg-coffee-700 transition-colors text-lg"
            >
              Menüyü Keşfet
            </Link>
            <Link 
              href="/auth/register" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Sadakat Programına Katıl
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-coffee-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-coffee-900 text-center mb-16">Sizin İçin Sunduklarımız</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-coffee-800">Premium Kahveler</h3>
              <p className="text-coffee-700 font-medium">Dünya'nın farklı bölgelerinden özenle seçtiğimiz kahve çekirdekleri ve özel harmanlarımız</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-coffee-800">Sadakat Programı</h3>
              <p className="text-coffee-700 font-medium">Her siparişinizde puan kazanın ve bu puanlarla bedava kahveler, tatlılar kazanın</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="w-20 h-20 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m0 8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5M3 13h8v-2H3v2m0 7h8v-2H3v2M3 8h8V6H3v2m10.1 9.5h1.4v-3.8l2.1 3.8h1.7L15.5 14h-1.4v3.9l-2.1-3.9h-1.7l2.8 5.5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-coffee-800">Özel Deneyimler</h3>
              <p className="text-coffee-700 font-medium">Kahve tadım etkinlikleri, barista eğitimleri ve özel atölye çalışmalarımız</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Menu Preview */}
      <section className="py-20 coffee-texture">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-coffee-900">Popüler Kahvelerimiz</h2>
            <Link 
              href="/menu" 
              className="mt-4 md:mt-0 px-6 py-2 bg-coffee-700 text-white rounded-full hover:bg-coffee-800 transition-colors"
            >
              Tüm Menüyü Gör
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coffeeMenu.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                <div className="relative h-60 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ 
                      backgroundImage: `url(${item.image})`, 
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <div className="absolute top-2 right-2 bg-coffee-800 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-coffee-900 mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-700">{item.price}</span>
                    <button className="px-3 py-1 bg-coffee-600 text-white rounded-lg hover:bg-coffee-700 transition-colors">
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
      <section className="py-20 bg-coffee-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">Misafirlerimiz Ne Diyor?</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden h-64">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out ${
                    index === activeTestimonial 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="bg-coffee-700 p-8 rounded-xl">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-coffee-400">
                        <div 
                          className="w-full h-full bg-cover"
                          style={{ 
                            backgroundImage: `url(${testimonial.avatar})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        ></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl">{testimonial.name}</h3>
                        <p className="text-coffee-200">Sadık Müşteri</p>
                      </div>
                    </div>
                    <p className="text-lg italic">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial ? 'bg-white' : 'bg-coffee-600'
                  }`}
                  aria-label={`Yorum ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Program CTA */}
      <section className="py-20 bg-coffee-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 mb-6">Sadakat Programımıza Katılın</h2>
                <p className="text-coffee-700 mb-8">
                  Kahve Dünyası Sadakat Programı ile her siparişinizde puan kazanın, 
                  özel avantajlardan yararlanın ve bedava kahveler için puanlarınızı kullanın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/auth/register" 
                    className="px-8 py-3 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800 transition-colors text-center"
                  >
                    Hemen Üye Ol
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="px-8 py-3 border border-coffee-700 text-coffee-700 rounded-lg hover:bg-coffee-50 transition-colors text-center"
                  >
                    Daha Fazla Bilgi
                  </Link>
                </div>
              </div>
              <div 
                className="relative min-h-[300px] bg-cover bg-center" 
                style={{ 
                  backgroundImage: "url('/images/loyalty-card.jpg')", 
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-coffee-900 text-center mb-4">Instagram'da Bizi Takip Edin</h2>
          <p className="text-coffee-600 text-center mb-12">@kahvedunyasi</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <a 
                href="#" 
                key={item} 
                className="aspect-square relative group overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ 
                    backgroundImage: `url('/images/insta-${item}.jpg')`, 
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                ></div>
                <div className="absolute inset-0 bg-coffee-900/0 group-hover:bg-coffee-900/70 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
