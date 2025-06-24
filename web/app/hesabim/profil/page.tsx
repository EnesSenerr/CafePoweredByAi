'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { updateProfile, uploadProfileImage, changePassword } from '../../api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  profileImage?: string;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
}

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    profileImage: '',
    preferences: {
      newsletter: true,
      smsNotifications: false,
      pushNotifications: true,
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Kullanıcı verilerini form'a yükle
  useEffect(() => {
    if (user) {
      console.log('Kullanıcı profil resmi URL:', user.profileImage);
      setFormData({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        profileImage: user.profileImage || '',
        preferences: user.preferences || {
          newsletter: true,
          smsNotifications: false,
          pushNotifications: true,
        }
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      await updateProfile(token, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        preferences: formData.preferences,
      });
      
      // Kullanıcı bilgilerini yenile
      await refreshUser();
      setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        profileImage: user.profileImage || '',
        preferences: user.preferences || {
          newsletter: true,
          smsNotifications: false,
          pushNotifications: true,
        }
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Dosya türü kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin.');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadProfileImage(token, file);
      console.log('Profil resmi yükleme response:', response);
      console.log('Yeni profil resmi URL:', response.profileImageUrl);
      setProfileImage(response.profileImageUrl);
      await refreshUser();
      alert('Profil resmi başarıyla güncellendi!');
    } catch (error) {
      console.error('Resim yüklenirken hata:', error);
      alert('Resim yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!token) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(token, passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Şifre başarıyla değiştirildi!');
    } catch (error) {
      console.error('Şifre değiştirilirken hata:', error);
      alert('Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-2xl mr-2">👤</span>
              <span className="text-sm font-medium">Kişisel Ayarlar</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Profil Ayarları
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Kişisel bilgilerinizi, tercihlerinizi ve güvenlik ayarlarınızı düzenleyin
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">🔒</span>
                <span className="text-lg">Güvenli Profil</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">⚙️</span>
                <span className="text-lg">Kişiselleştirme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 mb-8">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileImage ? (
                    <img 
                      src={profileImage.startsWith('http') ? profileImage : `http://localhost:5000${profileImage}`} 
                      alt="Profil Resmi" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        console.error('Profil resmi yüklenemedi:', profileImage);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.profile-fallback')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold profile-fallback ${profileImage ? 'hidden' : ''}`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    📸
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Profil Fotoğrafı</h3>
                  <p className="text-gray-600">Profil fotoğrafınızı güncelleyin. Maksimum dosya boyutu 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 mb-8">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h3>
                  <p className="text-gray-600">Temel hesap bilgilerinizi düzenleyin</p>
                </div>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isEditing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isEditing ? '❌ İptal' : '✏️ Düzenle'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing 
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                        : 'border-gray-200 bg-gray-50'
                    } transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing 
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                        : 'border-gray-200 bg-gray-50'
                    } transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing 
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                        : 'border-gray-200 bg-gray-50'
                    } transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing 
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                        : 'border-gray-200 bg-gray-50'
                    } transition-all duration-200`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 mb-8">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Bildirim Tercihleri</h3>
                <p className="text-gray-600">Hangi bildirimleri almak istediğinizi belirleyin</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                      📧
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">E-posta Bülteni</h4>
                      <p className="text-sm text-gray-600">Yeni ürünler ve kampanyalar hakkında bilgi alın</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.newsletter}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, newsletter: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
                      📱
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">SMS Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Sipariş durumu ve önemli güncellemeler</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.smsNotifications}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, smsNotifications: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                      🔔
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Push Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Mobil uygulama bildirimleri</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.pushNotifications}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, pushNotifications: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Güvenlik</h3>
                <p className="text-gray-600">Hesap güvenliğinizi yönetin</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                      🔐
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Şifre Değiştir</h4>
                      <p className="text-sm text-gray-600">Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Şifre Değiştir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-t-3xl"></div>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🔐
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Şifre Değiştir</h3>
                <p className="text-gray-600">Güvenliğiniz için güçlü bir şifre seçin</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="Mevcut şifrenizi girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="En az 6 karakter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? '⏳ Değiştiriliyor...' : '🔐 Şifre Değiştir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 