'use client';

import { useState } from 'react';

export default function LoyaltyProgramPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'levels' | 'rewards' | 'how-it-works'>('overview');

  const loyaltyLevels = [
    {
      name: 'Bronz',
      minPoints: 0,
      maxPoints: 249,
      color: 'from-amber-500 to-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      icon: '🥉',
      benefits: ['%5 indirim', 'Doğum günü sürprizi', 'Mobil sipariş önceliği']
    },
    {
      name: 'Gümüş',
      minPoints: 250,
      maxPoints: 499,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      icon: '🥈',
      benefits: ['%10 indirim', 'Ücretsiz wifi', 'Öncelikli servis', 'Özel etkinlik davetleri']
    },
    {
      name: 'Altın',
      minPoints: 500,
      maxPoints: 999,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      icon: '🥇',
      benefits: ['%15 indirim', 'Ücretsiz içecek upgrade', 'Kişisel AI önerileri', 'VIP etkinlikler']
    },
    {
      name: 'Platin',
      minPoints: 1000,
      maxPoints: 1999,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: '💎',
      benefits: ['%20 indirim', 'Aylık ücretsiz kahve', 'AI barista danışmanlığı', 'Özel menü erişimi']
    },
    {
      name: 'Elmas',
      minPoints: 2000,
      maxPoints: 9999,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      icon: '💠',
      benefits: ['%25 indirim', 'Sınırsız upgrade', 'Kişisel AI asistan', 'Beta özellik erişimi']
    }
  ];

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
              <span className="text-sm font-medium">AI Destekli Sadakat Programı</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Sadakat Programı
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Yapay zeka teknolojisi ile kişiselleştirilmiş kahve deneyimi ve benzersiz ödüller
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🤖</span>
                <span className="text-lg">AI Kişiselleştirme</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🎁</span>
                <span className="text-lg">Özel Ödüller</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap space-x-1 bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: '📊' },
              { key: 'levels', label: 'Seviyeler', icon: '🏆' },
              { key: 'rewards', label: 'Ödüller', icon: '🎁' },
              { key: 'how-it-works', label: 'Nasıl Çalışır', icon: '❓' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold mb-1">1₺ = 1</div>
                <div className="text-blue-100">Puan</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold mb-1">5</div>
                <div className="text-purple-100">Seviye</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2">💸</div>
                <div className="text-3xl font-bold mb-1">%25</div>
                <div className="text-green-100">Max İndirim</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2">🤖</div>
                <div className="text-3xl font-bold mb-1">∞</div>
                <div className="text-orange-100">AI Öneri</div>
              </div>
            </div>

            {/* AI Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2">
                  <span className="text-xl mr-2">🚀</span>
                  <span className="text-sm font-semibold text-orange-800">AI Destekli Teknoloji</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Geleceğin Kahve <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Deneyimi
                  </span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  AI Cafede yapay zeka teknolojisi ile size özel kahve deneyimi sunuyoruz. 
                  Her siparişiniz, sistem tarafından analiz edilerek gelecekteki deneyiminiz kişiselleştiriliyor.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: '🧠', title: 'Akıllı Öneri Sistemi', desc: 'Tercihlerinize göre kişiselleştirilmiş kahve önerileri' },
                    { icon: '⚡', title: 'Hızlı Sipariş', desc: 'AI destekli otomatik sipariş tamamlama' },
                    { icon: '🎯', title: 'Hedefli İndirimler', desc: 'Sevdiğiniz ürünlere özel dinamik indirimler' },
                    { icon: '📊', title: 'Gelişmiş Analitik', desc: 'Kahve alışkanlıklarınızın detaylı analizi' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-xl">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                      ☕
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Nasıl Çalışır?</h3>
                    <p className="text-gray-600">3 basit adımda başlayın</p>
                  </div>
                  <div className="space-y-6">
                    {[
                      { step: '1', title: 'Sipariş Verin', desc: 'Her harcama için puan kazanın', color: 'from-blue-500 to-blue-600' },
                      { step: '2', title: 'AI Öğrenir', desc: 'Sistem tercihlerinizi analiz eder', color: 'from-purple-500 to-purple-600' },
                      { step: '3', title: 'Ödül Alın', desc: 'Kişisel öneriler ve indirimler', color: 'from-green-500 to-green-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">🏆</span>
                <span className="text-sm font-semibold text-amber-800">Seviye Sistemi</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Sadakat Seviyeleri</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Daha fazla sipariş verin, daha yüksek seviyelere çıkın ve eşsiz avantajlar kazanın
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loyaltyLevels.map((level) => (
                <div key={level.name} className={`${level.bgColor} rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white`}>
                  <div className={`h-2 bg-gradient-to-r ${level.color}`}></div>
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-3">{level.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.name}</h3>
                      <div className="bg-white/80 rounded-lg px-3 py-1 inline-block">
                        <span className="text-sm font-medium text-gray-700">
                          {level.minPoints} - {level.maxPoints === 9999 ? '∞' : level.maxPoints} puan
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {level.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-white/60 rounded-lg p-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                          <span className="text-gray-800 font-medium text-sm">{benefit}</span>
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">🎁</span>
                <span className="text-sm font-semibold text-purple-800">Ödül Sistemi</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Destekli Ödüller</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Yapay zeka teknolojisi ile size özel hazırlanmış ödüller ve avantajlar
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 border border-blue-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Kişiselleştirilmiş İndirimler</h3>
                    <p className="text-gray-600">AI favori ürünlerinizi öğrenir ve özel fırsatlar sunar</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Favori kahvenize özel', discount: '%15 indirim', icon: '☕' },
                    { title: 'Rush saatlerinde', discount: '%10 ekstra', icon: '⏰' },
                    { title: 'Yeni ürün keşfi', discount: '%20 indirim', icon: '🆕' },
                    { title: 'Haftalık hedef bonusu', discount: '%25 indirim', icon: '🎯' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-gray-700 font-medium">{item.title}</span>
                      </div>
                      <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg text-sm">{item.discount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8 border border-purple-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Asistan Hizmetleri</h3>
                    <p className="text-gray-600">Kişisel kahve uzmanınız 7/24 hizmetinizde</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Günlük kahve önerisi', status: 'Tüm üyeler', icon: '📱', color: 'green' },
                    { title: 'Beslenme danışmanlığı', status: 'Silver+', icon: '🥗', color: 'purple' },
                    { title: 'Özel etkinlik bildirimleri', status: 'Gold+', icon: '🎪', color: 'yellow' },
                    { title: 'Kişisel barista danışmanlığı', status: 'Platinum+', icon: '👨‍🍳', color: 'blue' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-gray-700 font-medium">{item.title}</span>
                      </div>
                      <span className={`font-medium px-3 py-1 rounded-lg text-sm ${
                        item.color === 'green' ? 'text-green-600 bg-green-100' :
                        item.color === 'purple' ? 'text-purple-600 bg-purple-100' :
                        item.color === 'yellow' ? 'text-yellow-600 bg-yellow-100' :
                        'text-blue-600 bg-blue-100'
                      }`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Experiences */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🌟 Özel Deneyimler</h3>
                  <p className="text-white/90 text-lg">Sadece üyelerimize özel eşsiz etkinlikler</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: '🎓', title: 'AI Barista Akademisi', desc: 'Profesyonel kahve hazırlama teknikleri' },
                    { icon: '🔬', title: 'Teknoloji Buluşmaları', desc: 'AI ve kahve teknolojisi seminerleri' },
                    { icon: '🚀', title: 'Beta Test Programı', desc: 'Yeni özellikleri ilk deneyenler kulübü' }
                  ].map((item, index) => (
                    <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">❓</span>
                <span className="text-sm font-semibold text-green-800">Nasıl Çalışır</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Adım Adım Rehber</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                AI destekli sadakat programımız 4 basit adımda çalışır
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  icon: '📝',
                  title: 'Üye Olun',
                  desc: 'Hızlı kayıt ile programımıza katılın',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'from-blue-50 to-blue-100'
                },
                {
                  step: '02',
                  icon: '☕',
                  title: 'Sipariş Verin',
                  desc: 'Her 1₺ harcamanız için 1 puan kazanın',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'from-green-50 to-green-100'
                },
                {
                  step: '03',
                  icon: '🤖',
                  title: 'AI Analizi',
                  desc: 'Sistem tercihlerinizi öğrenir ve analiz eder',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'from-purple-50 to-purple-100'
                },
                {
                  step: '04',
                  icon: '🎁',
                  title: 'Ödül Kazanın',
                  desc: 'Kişisel öneriler ve özel indirimler alın',
                  color: 'from-orange-500 to-red-500',
                  bgColor: 'from-orange-50 to-red-50'
                }
              ].map((item, index) => (
                <div key={index} className={`bg-gradient-to-br ${item.bgColor} rounded-3xl p-8 text-center border border-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Technical Benefits */}
            <div className="mt-16 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 text-white">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">🔥 Teknolojik Avantajlar</h3>
                <p className="text-gray-300 text-lg">AI teknolojisinin gücüyle desteklenen özellikler</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '⚡', title: 'Hızlı İşlem', desc: 'Milisaniyeler içinde puan hesaplama' },
                  { icon: '🔒', title: 'Güvenli Sistem', desc: 'Blockchain tabanlı puan güvenliği' },
                  { icon: '📊', title: 'Gerçek Zamanlı', desc: 'Anlık puan güncellemeleri' },
                  { icon: '🎯', title: 'Akıllı Hedefleme', desc: 'Kişisel tercihlere göre optimizasyon' },
                  { icon: '🔄', title: 'Otomatik Sync', desc: 'Tüm cihazlarınızda senkronizasyon' },
                  { icon: '📱', title: 'Mobil Entegrasyon', desc: 'iOS ve Android uygulamaları' }
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-orange-100 via-red-50 to-pink-100 rounded-3xl shadow-xl p-10 text-center border border-orange-200">
            <div className="mb-6">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Hemen Başlayın!</h3>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
                AI destekli kahve deneyimini yaşamak ve sadakat programından faydalanmak için 
                hemen üye olun. İlk siparişinizde %20 hoş geldin indirimi!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/register" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🎁 Ücretsiz Üye Ol
              </a>
              <a 
                href="/menu" 
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1"
              >
                ☕ Menüyü İncele
              </a>
            </div>
            <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Ücretsiz kayıt</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Anında puan kazanma</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>AI özel öneriler</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 