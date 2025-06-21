'use client';

import { useState } from 'react';

export default function LoyaltyProgramPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'levels' | 'rewards'>('overview');

  const loyaltyLevels = [
    {
      name: 'Bronz',
      minPoints: 0,
      maxPoints: 249,
      color: 'from-amber-600 to-amber-800',
      benefits: ['%5 indirim', 'Doğum günü sürprizi', 'Mobil sipariş']
    },
    {
      name: 'Silver',
      minPoints: 250,
      maxPoints: 499,
      color: 'from-gray-400 to-gray-600',
      benefits: ['%10 indirim', 'Ücretsiz wifi', 'Öncelikli servis', 'Özel etkinlik davetleri']
    },
    {
      name: 'Gold',
      minPoints: 500,
      maxPoints: 999,
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['%15 indirim', 'Ücretsiz içecek upgrade', 'Kişisel AI önerileri', 'VIP etkinlikler']
    },
    {
      name: 'Platinum',
      minPoints: 1000,
      maxPoints: 1999,
      color: 'from-purple-400 to-purple-600',
      benefits: ['%20 indirim', 'Aylık ücretsiz kahve', 'AI barista danışmanlığı', 'Özel menü erişimi']
    },
    {
      name: 'Diamond',
      minPoints: 2000,
      maxPoints: 9999,
      color: 'from-blue-400 to-blue-600',
      benefits: ['%25 indirim', 'Sınırsız upgrade', 'Kişisel AI asistan', 'Beta özellik erişimi']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Sadakat Programı</h1>
            <p className="text-xl text-coffee-100 mb-8">
              AI destekli kahve deneyiminizi daha da özel kılan avantajlar
            </p>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl mr-3">🤖</span>
              <span className="text-lg">Yapay zeka ile kişiselleştirilmiş ödüller</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: '📊' },
              { key: 'levels', label: 'Seviyeler', icon: '🏆' },
              { key: 'rewards', label: 'Ödüller', icon: '🎁' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-coffee-600 text-white'
                    : 'text-coffee-600 hover:bg-coffee-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto">
            {/* AI Focused Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  AI Destekli Kahve Deneyimi
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  AI Cafe'de asıl odağımız, yapay zeka teknolojisi ile size mükemmel kahve deneyimi sunmaktır. 
                  Sadakat programımız bu deneyimi destekleyen ek avantajlar sunar.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center text-white">
                      🤖
                    </div>
                    <span className="text-gray-700">AI ile kişiselleştirilmiş kahve önerileri</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center text-white">
                      📱
                    </div>
                    <span className="text-gray-700">Akıllı sipariş sistemi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center text-white">
                      ⚡
                    </div>
                    <span className="text-gray-700">Otomatik ödül sistemi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center text-white">
                      📊
                    </div>
                    <span className="text-gray-700">Tercihlere göre dinamik indirimler</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Sipariş Verin</h4>
                      <p className="text-gray-600 text-sm">Her 1₺ harcamanız için 1 puan kazanın</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">AI Analizi</h4>
                      <p className="text-gray-600 text-sm">Sistem tercihlerinizi öğrenir ve öneriler geliştirir</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Ödüller Kazanın</h4>
                      <p className="text-gray-600 text-sm">Kişiselleştirilmiş indirimler ve özel avantajlar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-coffee-600 mb-2">1₺ = 1</div>
                <div className="text-gray-600">Puan</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-coffee-600 mb-2">5</div>
                <div className="text-gray-600">Seviye</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-coffee-600 mb-2">%25</div>
                <div className="text-gray-600">Max İndirim</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-coffee-600 mb-2">∞</div>
                <div className="text-gray-600">AI Öneri</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Seviye Sistemi</h2>
              <p className="text-gray-600 text-lg">Daha fazla sipariş verin, daha iyi avantajlar kazanın</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loyaltyLevels.map((level, index) => (
                <div key={level.name} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={`h-3 bg-gradient-to-r ${level.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{level.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {level.minPoints} - {level.maxPoints === 9999 ? '∞' : level.maxPoints} puan
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {level.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-coffee-600 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Destekli Ödüller</h2>
              <p className="text-gray-600 text-lg">Yapay zeka ile kişiselleştirilmiş ödül sistemi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-lg flex items-center justify-center text-white text-xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Kişiselleştirilmiş İndirimler</h3>
                    <p className="text-gray-600">AI favori ürünlerinize özel indirimler sunar</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Favori kahvenize</span>
                    <span className="font-medium text-coffee-600">%15 indirim</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Sık sipariş verdiğiniz saatte</span>
                    <span className="font-medium text-coffee-600">%10 ekstra</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Yeni ürün denemesi</span>
                    <span className="font-medium text-coffee-600">%20 indirim</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Asistan Hizmetleri</h3>
                    <p className="text-gray-600">Kişisel kahve danışmanınız</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Günlük kahve önerisi</span>
                    <span className="font-medium text-green-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Beslenme danışmanlığı</span>
                    <span className="font-medium text-green-600">Premium</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Özel etkinlik bildirimleri</span>
                    <span className="font-medium text-green-600">VIP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Rewards */}
            <div className="bg-gradient-to-r from-coffee-600 to-coffee-800 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Özel Deneyimler</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">☕</div>
                  <h4 className="font-bold mb-2">AI Barista Workshopu</h4>
                  <p className="text-coffee-100 text-sm">Yapay zeka destekli kahve hazırlama teknikleri</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎪</div>
                  <h4 className="font-bold mb-2">Teknoloji Etkinlikleri</h4>
                  <p className="text-coffee-100 text-sm">AI ve kahve teknolojisi buluşmaları</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌟</div>
                  <h4 className="font-bold mb-2">Beta Test Programı</h4>
                  <p className="text-coffee-100 text-sm">Yeni AI özelliklerini ilk deneyenler olun</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl shadow-lg p-8 border border-coffee-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hemen Başlayın!</h3>
            <p className="text-gray-700 mb-6">
              AI destekli kahve deneyimini yaşamak ve sadakat programından faydalanmak için üye olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/register" 
                className="bg-coffee-600 text-white px-8 py-3 rounded-lg hover:bg-coffee-700 transition-colors duration-200 font-medium"
              >
                Ücretsiz Üye Ol
              </a>
              <a 
                href="/menu" 
                className="border border-coffee-600 text-coffee-600 px-8 py-3 rounded-lg hover:bg-coffee-50 transition-colors duration-200 font-medium"
              >
                Menüyü İncele
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 