'use client';

import { useState } from 'react';
import Link from 'next/link';
import CTASection from '../components/CTASection';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
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

  return (
    <div className="min-h-screen bg-coffee-50">
      {/* Hero Section */}
      <div className="bg-coffee-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              İletişim
            </h1>
            <p className="text-xl text-coffee-200 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya rezervasyon taleplerınız için 
              bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                  Bizimle İletişime Geçin
                </h2>

                {/* Contact Cards */}
                <div className="space-y-6">
                  
                  {/* Address */}
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-coffee-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
                      <p className="text-gray-800 font-medium">
                        Cumhuriyet Mah. Kahve Sokak No: 42<br />
                        Beyoğlu / İstanbul<br />
                        34360
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-coffee-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
                      <p className="text-gray-800 font-medium">
                        <a href="tel:+905551234567" className="hover:text-coffee-700 transition-colors">
                          +90 555 123 45 67
                        </a>
                      </p>
                      <p className="text-gray-800 font-medium">
                        <a href="tel:+902121234567" className="hover:text-coffee-700 transition-colors">
                          +90 212 123 45 67
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-coffee-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">E-posta</h3>
                      <p className="text-gray-800 font-medium">
                        <a href="mailto:info@cafepoweredbyai.com" className="hover:text-coffee-700 transition-colors">
                          info@cafepoweredbyai.com
                        </a>
                      </p>
                      <p className="text-gray-800 font-medium">
                        <a href="mailto:rezervasyon@cafepoweredbyai.com" className="hover:text-coffee-700 transition-colors">
                          rezervasyon@cafepoweredbyai.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-coffee-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Çalışma Saatleri</h3>
                      <div className="text-gray-800 font-medium space-y-1">
                        <p>Pazartesi - Cuma: 07:00 - 22:00</p>
                        <p>Cumartesi: 08:00 - 23:00</p>
                        <p>Pazar: 09:00 - 21:00</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Bizi Takip Edin</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-coffee-700 rounded-full flex items-center justify-center text-white hover:bg-coffee-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-coffee-700 rounded-full flex items-center justify-center text-white hover:bg-coffee-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-coffee-700 rounded-full flex items-center justify-center text-white hover:bg-coffee-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-coffee-700 rounded-full flex items-center justify-center text-white hover:bg-coffee-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                  Mesaj Gönder
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Teşekkürler!</h3>
                    <p className="text-gray-600">Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                          Ad Soyad *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors text-gray-900 placeholder-gray-600"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors text-gray-900 placeholder-gray-600"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors text-gray-900 placeholder-gray-600"
                          placeholder="+90 555 123 45 67"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                          Konu *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors text-gray-900"
                        >
                          <option value="">Konu seçin</option>
                          <option value="genel">Genel Bilgi</option>
                          <option value="rezervasyon">Rezervasyon</option>
                          <option value="sikayet">Şikayet</option>
                          <option value="oneri">Öneri</option>
                          <option value="catering">Catering Hizmetleri</option>
                          <option value="iş-birligi">İş Birliği</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                        Mesaj *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors resize-none text-gray-900 placeholder-gray-600"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-coffee-700 text-white py-3 px-6 rounded-lg hover:bg-coffee-800 transition-colors font-semibold"
                    >
                      Mesaj Gönder
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Map Section Placeholder */}
      <div className="bg-coffee-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
              Konumumuz
            </h2>
            <div className="bg-coffee-200 h-96 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-500 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p className="text-coffee-700 text-lg">Harita yakında yüklenecek</p>
                <p className="text-coffee-600">Cumhuriyet Mah. Kahve Sokak No: 42, Beyoğlu/İstanbul</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection 
        title="Kahve Deneyiminize Başlayın"
        description="Menümüzü inceleyin ve sadakat programımıza katılarak özel avantajlardan yararlanın."
        primaryButtonText="Menümüzü İnceleyin"
        primaryButtonHref="/menu"
        secondaryButtonText="Dashboard"
        secondaryButtonHref="/dashboard"
      />
    </div>
  );
} 