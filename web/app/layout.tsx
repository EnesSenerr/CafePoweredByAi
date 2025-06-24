import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Poppins } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';

// Fontları yapılandır
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "AI Cafe | Premium Kahve Deneyimi",
  description: "En kaliteli kahve çekirdeklerinden özenle hazırlanan kahveler ve özel sadakat programımızla premium kahve deneyimi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>

        <footer className="bg-coffee-900 text-coffee-100 mt-16 pt-12 pb-6">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-4">AI Cafe</h3>
                <p className="text-coffee-200 mb-4">
                  Premium kahve deneyimi ve özel sadakat programımızla kahve tutkunlarını ağırlıyoruz.
                </p>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/aicafe" className="text-coffee-200 hover:text-white" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                    </svg>
                  </a>
                  <a href="https://instagram.com/aicafe" className="text-coffee-200 hover:text-white" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com/aicafe" className="text-coffee-200 hover:text-white" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-4">Sayfalar</h3>
                <ul className="space-y-2">
                  <li><a href="/menu" className="text-coffee-200 hover:text-white">Menü</a></li>
                  <li><a href="/hakkimizda" className="text-coffee-200 hover:text-white">Hakkımızda</a></li>
                  <li><a href="/sadakat-programi" className="text-coffee-200 hover:text-white">Sadakat Programı</a></li>
                  <li><a href="/iletisim" className="text-coffee-200 hover:text-white">İletişim</a></li>
                  <li><a href="/auth/register" className="text-coffee-200 hover:text-white">Üye Ol</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-4">İletişim</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-coffee-300 mt-1">📍</div>
                    <p className="text-coffee-200">
                      Bağdat Caddesi No:123<br />
                      Kadıköy, İstanbul
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-coffee-300">📞</div>
                    <p className="text-coffee-200">0216 123 45 67</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-coffee-300">✉️</div>
                    <a href="mailto:info@aicafe.com" className="text-coffee-200 hover:text-white">
                      info@aicafe.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-coffee-800 mt-8 pt-8 text-center text-coffee-300">
              © 2024 AI Cafe. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
