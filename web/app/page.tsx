'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Cafe Powered By AI</h1>
            <p className="text-lg text-gray-600 mb-6">
              Kahve keyfini yapay zeka ile birleştiren, keyif ve teknolojinin buluştuğu nokta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/login" className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-center">
                Giriş Yap
              </Link>
              <Link href="/auth/register" className="px-6 py-3 border border-amber-600 text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors text-center">
                Kayıt Ol
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-amber-600 p-8 flex items-center justify-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Neler Sunuyoruz?</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">✨</span> Kişiye özel kahve önerileri
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✨</span> Puan kazanma ve harcama
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✨</span> Sadakat programı
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✨</span> Özel indirimler ve sürprizler
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
