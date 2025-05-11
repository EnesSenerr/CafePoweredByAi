import PointBalance from '../components/PointBalance';
import TransactionHistory from '../components/TransactionHistory';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontrol Paneli | Cafe Powered By AI',
  description: 'Cafe Powered By AI kullanıcı kontrol paneli'
};

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-800 mb-8">Hoş Geldiniz, [Kullanıcı]</h1>
      
      <div className="grid md:grid-cols-12 gap-8">
        {/* Sol Sütun */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-amber-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Profil Bilgileri</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold text-xl">
                  ES
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Enes Şener</h3>
                  <p className="text-gray-500">enes@ornek.com</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Üyelik Seviyesi:</span>
                  <span className="font-semibold text-amber-700">Altın</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Üyelik Tarihi:</span>
                  <span>10 Mayıs 2023</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-amber-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Hızlı İşlemler</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                QR Kodu Görüntüle
              </button>
              <button className="w-full py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                Arkadaşını Davet Et
              </button>
              <button className="w-full py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                Ödülleri Görüntüle
              </button>
            </div>
          </div>
        </div>
        
        {/* Sağ Sütun */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-amber-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Puan Durumu</h2>
            </div>
            <div className="p-6">
              <PointBalance currentPoints={750} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-amber-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">İşlem Geçmişi</h2>
              <button className="text-amber-200 hover:text-white text-sm">Tümünü Gör</button>
            </div>
            <div className="p-6">
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 