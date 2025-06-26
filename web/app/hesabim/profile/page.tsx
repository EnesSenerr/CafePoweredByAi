'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { updateProfile, uploadProfileImage, changePassword } from '../../api';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Profil Ayarları</h1>
          <p className="text-coffee-100 text-lg">Kişisel bilgilerinizi düzenleyin</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profileImage ? (
                  <Image 
                    src={profileImage.startsWith('http') ? profileImage : `http://localhost:5000${profileImage}`} 
                    alt="Profil Resmi" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    width={96}
                    height={96}
                    onError={(e) => {
                      console.error('Profil resmi yüklenemedi:', profileImage);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.profile-fallback')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-24 h-24 bg-gradient-to-br from-coffee-600 to-coffee-800 rounded-full flex items-center justify-center text-white text-3xl font-bold profile-fallback ${profileImage ? 'hidden' : ''}`}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="absolute -bottom-2 -right-2 bg-coffee-600 text-white w-8 h-8 rounded-full hover:bg-coffee-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? '...' : '📷'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Kullanıcı'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-coffee-600 font-medium">Premium Üye</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Kişisel Bilgiler</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors duration-200"
                >
                  <span className="ml-2">Düzenle</span>
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50"
                  >
                    İptal
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{formData.name || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{formData.email || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="+90 5XX XXX XX XX"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{formData.phone || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Bildirim Tercihleri</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">E-posta Bülteni</h4>
                  <p className="text-sm text-gray-500">Güncel kampanya ve haberlerden haberdar olun</p>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coffee-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
                  <p className="text-sm text-gray-500">Sipariş durumu ve önemli bildirimler</p>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coffee-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Push Bildirimleri</h4>
                  <p className="text-sm text-gray-500">Mobil uygulama bildirimleri</p>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coffee-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Güvenlik</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Şifre Değiştir</h4>
                    <p className="text-sm text-gray-500">Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin</p>
                  </div>
                  <div className="text-coffee-600">→</div>
                </div>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h4>
                    <p className="text-sm text-gray-500">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
                  </div>
                  <div className="text-coffee-600">→</div>
                </div>
              </button>

              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Hesabı Sil</h4>
                    <p className="text-sm text-red-400">Bu işlem geri alınamaz</p>
                  </div>
                  <div>→</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Şifre Değiştir</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 bg-coffee-600 text-white py-3 rounded-lg hover:bg-coffee-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={loading}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 