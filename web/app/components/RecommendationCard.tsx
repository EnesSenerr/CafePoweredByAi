"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import Image from 'next/image';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular: boolean;
  score: number;
  reason: string;
}

const RecommendationCard = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  // Modal için state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReasons, setModalReasons] = useState<string[]>([]);
  const [modalProduct, setModalProduct] = useState<string>("");

  useEffect(() => {
    if (user) fetchRecommendations();
    // Favoriler localStorage'dan yükleniyor
    const favs = localStorage.getItem('ai-cafe-favorites');
    setFavorites(favs ? JSON.parse(favs) : []);
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      console.log("[DEBUG] Token:", token);
      const res = await fetch("/api/recommendations/collaborative?limit=6", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[DEBUG] API yanıtı status:", res.status);
      const data = await res.json();
      console.log("[DEBUG] API yanıtı body:", data);
      if (data.success) setRecommendations(data.data);
      else setError("Öneriler yüklenemedi. [API: success=false]");
    } catch (e) {
      console.error("[DEBUG] API fetch error:", e);
      setError("Öneriler yüklenemedi. [fetch error]");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('ai-cafe-favorites', JSON.stringify(updated));
  };

  // Modal açma fonksiyonu
  const openReasonsModal = (reasons: string, productName: string) => {
    setModalReasons(reasons.split(',').map(r => r.trim()));
    setModalProduct(productName);
    setModalOpen(true);
  };

  // Modal kapama fonksiyonu
  const closeModal = () => {
    setModalOpen(false);
    setModalReasons([]);
    setModalProduct("");
  };

  if (!user) return null;
  if (loading) return <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 mb-8 animate-pulse">Yükleniyor...</div>;
  if (error) return <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 mb-8 text-center text-gray-600 dark:text-gray-300">{error}</div>;
  if (recommendations.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-purple-900 dark:via-gray-900 dark:to-blue-900 rounded-3xl shadow-2xl overflow-visible mb-12 border-4 border-purple-500 dark:border-purple-700 animate-pulse-slow">
      {/* Vurgulu etiket */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg border-2 border-white dark:border-gray-900 text-lg font-bold tracking-wide">
          <span className="text-2xl mr-2">✨</span>
          Senin İçin AI Önerileri
        </div>
      </div>
      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      <div className="p-8 pt-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-full px-6 py-3 mb-4 shadow-md border border-purple-300 dark:border-purple-700">
            <span className="text-3xl mr-3">🤖</span>
            <span className="text-xl font-extrabold text-purple-800 dark:text-purple-200 drop-shadow">AI Barista&apos;dan Sana Özel Kahve Önerileri</span>
          </div>
          <h3 className="text-4xl font-extrabold text-purple-700 dark:text-purple-200 mb-3 drop-shadow">Senin İçin Seçtiklerimiz</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">Kahve tutkunlarına özel, kafe atmosferinde öneriler</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div key={item.id} className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-lg group">
              {/* Ürün görseli */}
              <div className="w-full h-36 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={200} height={200} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-5xl text-gray-300 dark:text-gray-700">☕</span>
                )}
              </div>
              {/* Favori butonu */}
              <button
                className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 transition-colors ${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                onClick={() => toggleFavorite(item.id)}
                title={favorites.includes(item.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              >
                {favorites.includes(item.id) ? (
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                )}
              </button>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                </div>
                {item.isPopular && (
                  <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full">Popüler</span>
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.price} ₺</span>
                {/* Neden önerildi? Buton ve modal */}
                <button
                  className="text-xs text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-800 transition-transform"
                  onClick={() => openReasonsModal(item.reason, item.name)}
                  title="Tüm nedenleri gör"
                  type="button"
                >
                  Neden önerildi?
                </button>
              </div>
              <div className="mt-3">
                <Link href={`/menu?item=${item.id}`} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium text-center block shadow-md">
                  Sipariş Ver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
              onClick={closeModal}
              aria-label="Kapat"
              type="button"
            >
              ×
            </button>
            <h4 className="text-lg font-bold mb-3 text-purple-700 dark:text-purple-300">{modalProduct} için öneri nedenleri</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200">
              {modalReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard; 