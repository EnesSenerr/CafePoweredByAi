'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-primary-900 mb-6">
            Cafe Sadakat Sistemi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Her kahvenizde puan kazanın, ödüllerinizi kullanın ve daha fazlasını keşfedin!
          </p>
          <div className="space-x-4">
            <Link 
              href="/auth/register" 
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Hemen Başla
            </Link>
            <Link 
              href="/auth/login" 
              className="inline-block px-8 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Puan Kazanın</h3>
            <p className="text-gray-600">Her siparişinizde puan kazanın ve sadakat programımızın bir parçası olun.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Ödüllerinizi Kullanın</h3>
            <p className="text-gray-600">Kazandığınız puanları lezzetli ödüller için kullanın.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Özel Teklifler</h3>
            <p className="text-gray-600">Size özel indirimler ve kampanyalardan haberdar olun.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
