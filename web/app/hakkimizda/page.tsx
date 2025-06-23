'use client';

import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & Baş Barista',
      description: '15 yıllık deneyimi ile kahve kültürünün öncülerinden',
      icon: '👨‍💼',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Ayşe Demir',
      role: 'Operasyon Müdürü',
      description: 'Müşteri deneyimi konusunda uzman, ekip lideri',
      icon: '👩‍💼',
      gradient: 'from-pink-500 to-red-600'
    },
    {
      name: 'Mehmet Kaya',
      role: 'AI Teknoloji Uzmanı',
      description: 'AI destekli sistemlerin geliştiricisi ve teknik sorumlu',
      icon: '👨‍💻',
      gradient: 'from-green-500 to-blue-600'
    }
  ];

  const values = [
    {
      title: 'Premium Kalite',
      description: 'En iyi kahve çekirdeklerini seçiyor, her adımda kalite kontrolü yapıyoruz. Mükemmellik standardımızdan asla ödün vermiyoruz.',
      icon: '⭐',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Sürdürülebilirlik',
      description: 'Çevre dostu yaklaşımımızla, adil ticaret kahveleri kullanıyor ve geri dönüştürülebilir ambalajları tercih ediyoruz.',
      icon: '🌿',
      gradient: 'from-green-400 to-green-600'
    },
    {
      title: 'AI İnovasyonu',
      description: 'Yapay zeka destekli sadakat programımız ve modern teknolojiler ile müşteri deneyimini sürekli geliştiriyoruz.',
      icon: '🤖',
      gradient: 'from-purple-400 to-blue-600'
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
              <span className="text-2xl mr-2">🏢</span>
              <span className="text-sm font-medium">AI Destekli Kahve Deneyimi</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Hakkımızda
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              2015&rsquo;ten beri, yapay zeka teknolojisi ile desteklenen kaliteli kahve deneyimi ve 
              sıcak atmosfer sunarak kahve severler için öncü bir buluşma noktası oluyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-lg">8+ Yıl Deneyim</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">❤️</span>
                <span className="text-lg">10K+ Mutlu Müşteri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop"
                    alt="Kafemizin iç görünümü"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 hidden">
                    <div className="text-center">
                      <div className="text-6xl mb-4">☕</div>
                      <p className="text-gray-600 font-medium">Kafemizin Atmosferi</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 h-32 w-32 rounded-3xl opacity-80"></div>
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-blue-400 to-purple-500 h-24 w-24 rounded-2xl opacity-60"></div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2">
                  <span className="text-xl mr-2">📖</span>
                  <span className="text-sm font-semibold text-orange-800">Hikayemiz</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Tutkuyla Başlayan<br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Bir Yolculuk
                  </span>
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-gray-800">Cafe PoweredByAi</strong>, kahve tutkunu iki arkadaşın hayali ile başladı. 
                    2015 yılında küçük bir dükkanda başlayan yolculuğumuz, bugün şehrin 
                    en sevilen ve teknolojik olarak en gelişmiş kahve mekanlarından biri haline geldi.
                  </p>
                  <p className="text-lg">
                    Her sabah, dünyanın farklı köşelerinden özenle seçilmiş en taze kahve çekirdeklerini 
                    sanatkarlık anlayışıyla işliyoruz. Amacımız sadece mükemmel kahve sunmak değil, 
                    aynı zamanda misafirlerimize sıcak, samimi ve teknolojik bir ortam sağlamak.
                  </p>
                  <p className="text-lg">
                    <strong className="text-gray-800">2023 yılında</strong> devrim niteliğinde bir adım atarak, 
                    yapay zeka teknolojisi ile geleneksel kahve kültürünü birleştirdik. 
                    AI destekli sadakat programımızla müşteri deneyimini tamamen yeniden tanımladık.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">📊 Sayılarla Başarımız</h2>
              <p className="text-gray-300 text-lg">8 yıllık yolculuğumuzda elde ettiğimiz başarılar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-3">☕</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">500K+</div>
                <div className="text-gray-300 text-sm">Servis Edilen Kahve</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-3">👥</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-gray-300 text-sm">Mutlu Müşteri</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-3">🏆</div>
                <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-gray-300 text-sm">Kalite Ödülü</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-3">🤖</div>
                <div className="text-3xl font-bold text-purple-400 mb-2">%98</div>
                <div className="text-gray-300 text-sm">AI Doğruluk Oranı</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">💎</span>
                <span className="text-sm font-semibold text-purple-800">Değerlerimiz</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Bizi Özel Kılan Değerler
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Kahve kültürüne olan tutkumuz, teknolojik inovasyon anlayışımız ve 
                müşteri memnuniyeti odaklı yaklaşımımız işimizin temelini oluşturuyor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r ${value.gradient}`}></div>
                  <div className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">👥</span>
                <span className="text-sm font-semibold text-orange-800">Ekibimiz</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tutkulu Ekibimiz
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Deneyimli baristalarımız, teknoloji uzmanlarımız ve samimi ekibimizle 
                size en iyi hizmeti sunmaya odaklanıyoruz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r ${member.gradient}`}></div>
                  <div className="p-8 text-center">
                    <div className={`w-24 h-24 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <span className="text-4xl">{member.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2">
                  <span className="text-xl mr-2">🚀</span>
                  <span className="text-sm font-semibold text-blue-800">Teknolojik İnovasyon</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  AI ile Geleceğin<br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kahve Deneyimi
                  </span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-gray-800">2023 yılında</strong> sektörde bir ilke imza atarak, 
                    yapay zeka teknolojisini kahve deneyimine entegre ettik. 
                    Bu devrimsel yaklaşım, müşterilerimize tamamen kişiselleştirilmiş bir deneyim sunuyor.
                  </p>
                  <p className="text-lg">
                    AI destekli sistemimiz, tercihlerinizi öğrenir, sipariş geçmişinizi analiz eder ve 
                    size özel öneriler sunar. Sadakat programımız da bu akıllı teknoloji ile desteklenir.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Kişisel Öneriler</h4>
                    <p className="text-gray-600 text-sm">AI algoritması ile özel menü önerileri</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hızlı Servis</h4>
                    <p className="text-gray-600 text-sm">Akıllı sipariş yönetimi ile minimum bekleme</p>
                  </div>
                </div>
              </div>

              {/* Innovation Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=600&h=400&fit=crop"
                    alt="AI teknolojisi"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 hidden">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <p className="text-gray-600 font-medium">AI Teknolojisi</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-purple-400 to-blue-500 h-32 w-32 rounded-3xl opacity-80"></div>
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-400 to-purple-500 h-24 w-24 rounded-2xl opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-100 via-red-50 to-pink-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">☕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bizi Ziyaret Edin
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Sıcak atmosferimizde AI destekli kahve deneyimini yaşamak ve 
              hikayemizin devamına tanıklık etmek için bekliyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🍴 Menümüzü İnceleyin
              </Link>
              <Link
                href="/iletisim"
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1"
              >
                📍 İletişim Bilgileri
              </Link>
            </div>
            <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Sıcak atmosfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>AI destekli deneyim</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Premium kalite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 