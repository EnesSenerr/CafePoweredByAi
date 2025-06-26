"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

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

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/recommendations/collaborative?limit=6", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecommendations(data.data);
      else setError("Öneriler yüklenemedi.");
    } catch (e) {
      setError("Öneriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading) return <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 animate-pulse">Yükleniyor...</div>;
  if (error) return <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center text-gray-600">{error}</div>;
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-3">
            <span className="text-xl mr-2">☕</span>
            <span className="text-sm font-semibold text-purple-800">AI Barista'dan Sana Özel Kahve Önerileri</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Senin İçin Seçtiklerimiz</h3>
          <p className="text-gray-600">Kahve tutkunlarına özel, kafe atmosferinde öneriler</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                </div>
                {item.isPopular && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Popüler</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{item.price} ₺</span>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">{item.reason}</span>
              </div>
              <div className="mt-3">
                <Link href={`/menu?item=${item.id}`} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium text-center block">Sipariş Ver</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard; 