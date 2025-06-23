'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      title: 'Adres',
      content: ['Cumhuriyet Mah. Kahve Sokak No: 42', 'Beyoğlu / İstanbul', '34360'],
      icon: '📍',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Telefon',
      content: ['+90 555 123 45 67', '+90 212 123 45 67'],
      icon: '📞',
      gradient: 'from-green-500 to-green-600',
      links: ['tel:+905551234567', 'tel:+902121234567']
    },
    {
      title: 'E-posta',
      content: ['info@cafepoweredbyai.com', 'rezervasyon@cafepoweredbyai.com'],
      icon: '✉️',
      gradient: 'from-purple-500 to-purple-600',
      links: ['mailto:info@cafepoweredbyai.com', 'mailto:rezervasyon@cafepoweredbyai.com']
    },
    {
      title: 'Çalışma Saatleri',
      content: ['Pazartesi - Cuma: 07:00 - 22:00', 'Cumartesi: 08:00 - 23:00', 'Pazar: 09:00 - 21:00'],
      icon: '🕐',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const socialMedia = [
    { name: 'Twitter', icon: '🐦', url: '#', color: 'from-blue-400 to-blue-600' },
    { name: 'Instagram', icon: '📸', url: '#', color: 'from-pink-400 to-red-500' },
    { name: 'Facebook', icon: '📘', url: '#', color: 'from-blue-600 to-indigo-600' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: 'from-blue-700 to-blue-800' }
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
              <span className="text-2xl mr-2">📞</span>
              <span className="text-sm font-medium">7/24 İletişim Hattı</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              İletişim
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sorularınız, önerileriniz veya rezervasyon taleplerınız için bizimle iletişime geçin. 
              AI destekli müşteri hizmetimizle size en iyi desteği sunmaya hazırız.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">⚡</span>
                <span className="text-lg">Hızlı Yanıt</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🤖</span>
                <span className="text-lg">AI Destekli</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-4">
                    <span className="text-xl mr-2">📢</span>
                    <span className="text-sm font-semibold text-blue-800">İletişim Bilgileri</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Bizimle İletişime Geçin
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    AI destekli müşteri deneyimimizle size en iyi hizmeti sunmaya hazırız.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    >
                      <div className={`h-1 bg-gradient-to-r ${info.gradient}`}></div>
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            <span className="text-2xl">{info.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                            <div className="space-y-1">
                              {info.content.map((item, idx) => (
                                <p key={idx} className="text-gray-600 leading-relaxed">
                                  {info.links && info.links[idx] ? (
                                    <a 
                                      href={info.links[idx]} 
                                      className="hover:text-orange-600 transition-colors duration-200 font-medium"
                                    >
                                      {item}
                                    </a>
                                  ) : (
                                    item
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4 text-center">🌟 Bizi Takip Edin</h3>
                  <p className="text-gray-300 text-center mb-6">
                    Sosyal medya hesaplarımızdan güncel haberlerimizi takip edin
                  </p>
                  <div className="flex justify-center space-x-4">
                    {socialMedia.map((social, index) => (
                      <a 
                        key={index}
                        href={social.url} 
                        className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        <span className="text-xl">{social.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">💬</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Mesaj Gönder
                    </h2>
                    <p className="text-gray-600">
                      Formunu doldur, hemen geri dönüş yapalım
                    </p>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl text-white">✅</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Teşekkürler!</h3>
                      <p className="text-gray-600 text-lg">
                        Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                            Ad Soyad <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                            placeholder="Adınız ve soyadınız"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                            E-posta <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                            placeholder="ornek@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                            placeholder="+90 555 123 45 67"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">
                            Konu <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-gray-900 bg-gray-50 hover:bg-white"
                          >
                            <option value="">Konu seçin</option>
                            <option value="genel">💬 Genel Bilgi</option>
                            <option value="rezervasyon">📅 Rezervasyon</option>
                            <option value="sikayet">😞 Şikayet</option>
                            <option value="oneri">💡 Öneri</option>
                            <option value="catering">🍽️ Catering Hizmetleri</option>
                            <option value="iş-birligi">🤝 İş Birliği</option>
                            <option value="ai-destek">🤖 AI Destek</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                          Mesaj <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                          placeholder="Mesajınızı buraya yazın..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Gönderiliyor...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <span>📤</span>
                            <span>Mesaj Gönder</span>
                          </div>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">⚡ Hızlı İletişim</h2>
              <p className="text-gray-600 text-lg">Acil durumlar için direkt iletişim kanalları</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Acil Hattı</h3>
                <p className="text-gray-600 mb-4">7/24 acil destek hizmeti</p>
                <a href="tel:+905551234567" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold">
                  Hemen Ara
                </a>
              </div>
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Hızlı mesajlaşma</p>
                <a href="https://wa.me/905551234567" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold">
                  Mesaj Gönder
                </a>
              </div>
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Chatbot</h3>
                <p className="text-gray-600 mb-4">Anlık otomatik yanıtlar</p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold">
                  Sohbet Başlat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mb-4">
                <span className="text-xl mr-2">📍</span>
                <span className="text-sm font-semibold text-orange-800">Konum</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Bizi Ziyaret Edin
              </h2>
              <p className="text-gray-600 text-lg">
                İstanbul&rsquo;un kalbinde, size özel AI destekli kahve deneyimi
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 h-96 rounded-3xl flex items-center justify-center shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="text-6xl mb-6">🗺️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Interaktif Harita</h3>
                <p className="text-gray-600 text-lg mb-2">Cumhuriyet Mah. Kahve Sokak No: 42</p>
                <p className="text-gray-600">Beyoğlu/İstanbul</p>
                <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold">
                  🧭 Yol Tarifi Al
                </button>
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
              Kahve Deneyiminize Başlayın
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Menümüzü inceleyin ve AI destekli sadakat programımıza katılarak 
              özel avantajlardan yararlanın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🍴 Menümüzü İnceleyin
              </Link>
              <Link
                href="/sadakat-programi"
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1"
              >
                🎁 Sadakat Programı
              </Link>
            </div>
            <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>7/24 destek</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>AI destekli hizmet</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Hızlı yanıt garantisi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 