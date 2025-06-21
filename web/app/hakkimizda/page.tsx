'use client';

import Link from 'next/link';
import CTASection from '../components/CTASection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-coffee-50">
      {/* Hero Section */}
      <div className="bg-coffee-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-coffee-100 leading-relaxed font-medium">
              2015'ten beri, kaliteli kahve ve sıcak bir atmosfer sunarak 
              kahve severler için bir buluşma noktası oluyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="bg-coffee-100 h-96 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-coffee-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 3H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12.5c.83 0 1.5-.67 1.5-1.5V4.5c0-.83-.67-1.5-1.5-1.5zm-1 15.5h-11V5.5h11v13z" />
                  </svg>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-cream-400 h-24 w-24 rounded-xl"></div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                  Hikayemiz
                </h2>
                <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                  Cafe PoweredByAi, kahve tutkunu iki arkadaşın hayali ile başladı. 
                  2015 yılında küçük bir dükkanda başlayan yolculuğumuz, bugün şehrin 
                  en sevilen kahve mekanlarından biri haline geldi.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                  Her sabah, en taze kahve çekirdeklerini özenle seçiyor, her fincan 
                  kahvemizi sanatkarlık anlayışıyla hazırlıyoruz. Amacımız sadece 
                  mükemmel kahve sunmak değil, aynı zamanda misafirlerimize sıcak 
                  ve samimi bir ortam sağlamak.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed font-medium">
                  Modern teknoloji ile geleneksel kahve kültürünü birleştirerek, 
                  AI destekli sadakat programımızla müşteri deneyimini bir üst seviyeye 
                  taşıyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Değerlerimiz
              </h2>
              <p className="text-gray-800 text-xl max-w-3xl mx-auto font-medium">
                Kahve kültürüne olan tutkumuz ve müşteri memnuniyeti odaklı yaklaşımımız 
                işimizin temelini oluşturuyor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Kalite */}
              <div className="text-center p-8 bg-coffee-50 rounded-xl">
                <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Kalite</h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  En iyi kahve çekirdeklerini seçiyor, her adımda kalite kontrolü 
                  yapıyoruz. Mükemmellik standardımızdan asla ödün vermiyoruz.
                </p>
              </div>

              {/* Sürdürülebilirlik */}
              <div className="text-center p-8 bg-coffee-50 rounded-xl">
                <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.75.66C7.5 16.65 9.47 11.95 17 10zm-4.19-1.43l.56-1.19C14.28 3.4 15.67 1.92 17.11 1l-.74-1.42C14.44 1.13 12.7 3.08 11.76 5.83l-.13.48s-.4.28-.47.35l-.31.31-.63-.29c-.5-.23-1.01-.46-1.52-.69l.74-1.42c.56.25 1.12.5 1.68.74zM6.3 5.6c-2.48 1.35-4.45 3.54-5.66 6.27l1.69.88c1.07-2.42 2.79-4.35 4.97-5.53z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sürdürülebilirlik</h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  Çevre dostu yaklaşımımızla, adil ticaret kahveleri kullanıyor ve 
                  geri dönüştürülebilir ambalajları tercih ediyoruz.
                </p>
              </div>

              {/* İnovasyon */}
              <div className="text-center p-8 bg-coffee-50 rounded-xl">
                <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">İnovasyon</h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  AI destekli sadakat programımız ve modern teknolojiler ile 
                  müşteri deneyimini sürekli geliştiriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Ekibimiz
              </h2>
              <p className="text-gray-700 text-xl max-w-3xl mx-auto">
                Deneyimli barista'larımız ve samimi ekibimizle size en iyi hizmeti 
                sunmaya odaklanıyoruz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ahmet Yılmaz</h3>
                <p className="text-coffee-700 mb-4">Kurucu & Baş Barista</p>
                <p className="text-gray-600 text-sm">
                  15 yıllık deneyimi ile kahve kültürünün öncülerinden
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ayşe Demir</h3>
                <p className="text-coffee-700 mb-4">Operasyon Müdürü</p>
                <p className="text-gray-600 text-sm">
                  Müşteri deneyimi konusunda uzman, ekip lideri
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-coffee-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mehmet Kaya</h3>
                <p className="text-coffee-700 mb-4">Teknoloji Uzmanı</p>
                <p className="text-gray-600 text-sm">
                  AI destekli sistemlerin geliştiricisi ve teknik sorumlu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection 
        title="Bizi Ziyaret Edin"
        description="Sıcak atmosferimizde kahve keyfi yapmak ve hikayemizin devamına tanıklık etmek için bekliyoruz."
        primaryButtonText="Menümüzü İnceleyin"
        primaryButtonHref="/menu"
        secondaryButtonText="İletişim"
        secondaryButtonHref="/iletisim"
      />
    </div>
  );
} 