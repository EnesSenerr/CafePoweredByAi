'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../api';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  points: number;
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'users' | 'analytics' | 'settings'>('dashboard');
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    points: 0
  });
  const [usersLoading, setUsersLoading] = useState(false);
  
  // System stats
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalOrders: 234,
    totalRevenue: 45670,
    activeEmployees: 8
  });

  // Content items
  const [, setContentItems] = useState<ContentItem[]>([
    {
      id: 1,
      type: 'announcement',
      title: 'Yeni AI Özellikler',
      content: 'Yakında gelecek AI tabanlı kahve önerileri.',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Özel İndirim Kampanyası',
      content: '%20 indirim fırsatını kaçırmayın!',
      isActive: false,
      createdAt: '2024-01-10'
    }
  ]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
              router.push('/giris');
      return;
    }
    
    if (user.role !== 'admin') {
      console.log('User role:', user.role, 'Expected: admin');
              router.push('/hesabim');
      return;
    }
    
    console.log('Admin access granted for user:', user);
    setIsLoading(false);
  }, [user, authLoading, router]);

  // Kullanıcıları yükle
  const loadUsers = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    setUsersLoading(true);
    try {
      const response = await getUsers(token);
      setUsers(response.users);
      setSystemStats(prev => ({ ...prev, totalUsers: response.users.length }));
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Tab değiştiğinde kullanıcıları yükle
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  // Kullanıcı form işlemleri
  const handleUserSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      if (editingUser) {
        // Güncelle
        const updateData: Partial<UserFormData> = {
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
          phone: userFormData.phone,
          points: userFormData.points
        };
        
        if (userFormData.password) {
          updateData.password = userFormData.password;
        }

        await updateUser(token, editingUser.id, updateData);
      } else {
        // Yeni oluştur
        await createUser(token, userFormData);
      }
      
      await loadUsers();
      setShowUserModal(false);
      setEditingUser(null);
      resetUserForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert(`Hata: ${errorMessage}`);
    }
  };

  const handleUserEdit = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      points: user.points
    });
    setShowUserModal(true);
  };

  const handleUserDelete = async (userId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteUser(token, userId);
      await loadUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert(`Hata: ${errorMessage}`);
    }
  };

  const handleUserToggleStatus = async (userId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await toggleUserStatus(token, userId);
      await loadUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert(`Hata: ${errorMessage}`);
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
      phone: '',
      points: 0
    });
  };

  // Gelecekteki kullanım için ayrılmış
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleContentStatus = (id: number) => {
    setContentItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'employee': return 'Çalışan';
      case 'customer': return 'Müşteri';
      default: return role;
    }
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

        {activeTab === 'users' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  resetUserForm();
                  setShowUserModal(true);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yeni Kullanıcı Ekle
              </button>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Kullanıcılar yükleniyor...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kayıt Tarihi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.points} puan
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleUserEdit(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleUserToggleStatus(user.id)}
                              className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {user.isActive ? 'Deaktif Et' : 'Aktif Et'}
                            </button>
                            {user.id !== user.id && (
                              <button
                                onClick={() => handleUserDelete(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Sil
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Henüz kullanıcı bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diğer tab'ler için mevcut kod... */}
        {activeTab === 'menu' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Menü Yönetimi</h3>
              <p className="text-gray-600">Menu yonetimi için /calisan sayfasını kullanın.</p>
              <div className="mt-4">
                <a 
                  href="/calisan" 
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block"
                >
                  Menü Yönetimi Sayfasına Git
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analitik</h3>
              <p className="text-gray-600">AI entegrasyonu sonrasi tam kapsamli veri analizi araclari aktif olacak.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ayarlar</h3>
              <p className="text-gray-600">Sistem ayarlari yakinda aktif olacak.</p>
            </div>
          </div>
        )}
      </div>

      {/* Kullanıcı Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editingUser ? '(Değiştirilmeyecekse boş bırakın)' : '*'}
                </label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required={!editingUser}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="customer">Müşteri</option>
                  <option value="employee">Çalışan</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puan
                </label>
                <input
                  type="number"
                  value={userFormData.points}
                  onChange={(e) => setUserFormData({...userFormData, points: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                  resetUserForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUserSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingUser ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 