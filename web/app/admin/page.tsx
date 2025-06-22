'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SystemStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeEmployees: number;
}

interface ContentItem {
  id: number;
  type: 'announcement' | 'promotion' | 'menu_update';
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'users' | 'ai-data'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const [systemStats] = useState<SystemStats>({
    totalUsers: 1247,
    totalOrders: 5632,
    totalRevenue: 142750,
    activeEmployees: 12
  });

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 1,
      type: 'announcement',
      title: 'Yeni AI Kahve Oneri Sistemi',
      content: 'Yapay zeka destekli kisisellestirilmis kahve onerilerimiz aktif!',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Hafta Sonu Indirimi',
      content: 'Tum kahvelerde %20 indirim! Cumartesi ve Pazar gecerli.',
      isActive: true,
      createdAt: '2024-01-14'
    }
  ]);

  useEffect(() => {
    // Auth yüklenmesini bekle
    if (authLoading) {
      return;
    }
    
    // Kullanıcı yoksa login'e yönlendir
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Admin değilse dashboard'a yönlendir
    if (user.role !== 'admin') {
      console.log('User role:', user.role, 'Expected: admin');
      router.push('/dashboard');
      return;
    }
    
    console.log('Admin access granted for user:', user);
    setIsLoading(false);
  }, [user, authLoading, router]);

  const toggleContentStatus = (id: number) => {
    setContentItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Yukleniyor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '' },
    { key: 'menu', label: 'Menu Yonetimi', icon: '' },
    { key: 'users', label: 'Kullanici Yonetimi', icon: '' },
          { key: 'analytics', label: 'Analitik', icon: '' },
      { key: 'settings', label: 'Ayarlar', icon: '' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Admin Paneli</h1>
          <p className="text-red-100 text-lg">Sistem yonetimi ve AI veri analizi</p>
          <div className="mt-4 bg-red-600/30 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm">Rol: </span>
            <span className="font-medium capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-red-600 text-white'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{systemStats.totalUsers}</div>
                <div className="text-gray-600">Toplam Kullanici</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{systemStats.totalOrders}</div>
                <div className="text-gray-600">Toplam Siparis</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">₺{systemStats.totalRevenue.toLocaleString()}</div>
                <div className="text-gray-600">Toplam Gelir</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{systemStats.activeEmployees}</div>
                <div className="text-gray-600">Aktif Calisan</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Paneli Aktif</h3>
              <p className="text-gray-600 mb-6">
                AI entegrasyonu tamamlandiktan sonra tam ozellikli admin paneli kullanima acilacak.
                Su anda temel sistem istatistikleri ve icerik yonetimi mevcut.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Icerik Yonetimi</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Yeni Icerik Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {contentItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mb-2">{item.content}</p>
                        <p className="text-gray-500 text-sm">Olusturulma: {item.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleContentStatus(item.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          item.isActive 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {item.isActive ? 'Deaktif Et' : 'Aktif Et'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Kullanici Yonetimi</h3>
              <p className="text-gray-600">AI entegrasyonu sonrasi aktif olacak.</p>
            </div>
          </div>
        )}

        {activeTab === 'ai-data' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Veri Analizi</h3>
                <p className="text-gray-600 mb-6">AI entegrasyonu sonrasi tam kapsamli veri analizi araclari aktif olacak.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">%85</div>
                    <div className="text-blue-800 text-sm">AI Oneriler Basari Orani</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2.3x</div>
                    <div className="text-green-800 text-sm">Satis Artisi</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">97%</div>
                    <div className="text-purple-800 text-sm">Musteri Memnuniyeti</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Gercek Zamanli AI Istatistikleri</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aktif AI Modeller</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gunluk Tahmin Sayisi</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Dogruluk Orani</span>
                    <span className="font-medium">92.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 