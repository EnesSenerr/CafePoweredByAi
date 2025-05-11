import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cafe Sadakat Sistemi",
  description: "Kahve keyfinizi puanlara dönüştürün",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-primary-600">
                Cafe Sadakat
              </a>
              <div className="space-x-4">
                <a href="/auth/login" className="text-gray-600 hover:text-primary-600">
                  Giriş Yap
                </a>
                <a href="/auth/register" className="text-gray-600 hover:text-primary-600">
                  Kayıt Ol
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Hakkımızda</h3>
                <p className="text-gray-600">
                  Cafe Sadakat Sistemi ile müşterilerimize en iyi deneyimi sunuyoruz.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">İletişim</h3>
                <p className="text-gray-600">
                  Email: info@cafesadakat.com<br />
                  Tel: (555) 123-4567
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Sosyal Medya</h3>
                <div className="space-x-4">
                  <a href="#" className="text-gray-600 hover:text-primary-600">Instagram</a>
                  <a href="#" className="text-gray-600 hover:text-primary-600">Twitter</a>
                  <a href="#" className="text-gray-600 hover:text-primary-600">Facebook</a>
                </div>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-gray-600">
              © 2024 Cafe Sadakat Sistemi. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
