import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Switch,
  Image,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

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

const ProfileScreen = ({ navigation }: Props) => {
  const { user, token, refreshUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
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
      Alert.alert('Başarılı', 'Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
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

  const handleImageUpload = async () => {
    try {
      // İzin kontrolü
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri erişim izni gereklidir.');
        return;
      }

      // Resim seçme
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        // TODO: uploadProfileImage API ile sunucuya yükle
        Alert.alert('Başarılı', 'Profil resmi güncellendi!');
      }
    } catch (error) {
      console.error('Resim yüklenirken hata:', error);
      Alert.alert('Hata', 'Resim yüklenirken bir hata oluştu.');
    }
  };

  const handlePasswordChange = async () => {
    if (!token) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(token, passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Başarılı', 'Şifre başarıyla değiştirildi!');
    } catch (error) {
      console.error('Şifre değiştirilirken hata:', error);
      Alert.alert('Hata', 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[ProfileScreen] Logout button pressed, calling logout...');
              await logout();
              console.log('[ProfileScreen] Logout completed successfully');
              navigation.replace('MainTabs');
            } catch (error) {
              console.error('[ProfileScreen] Çıkış yapılırken hata:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Ayarları</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleImageUpload}
              disabled={loading}
            >
              <Text style={styles.cameraButtonText}>📸</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileTitle}>Profil Fotoğrafı</Text>
          <Text style={styles.profileSubtitle}>
            Profil fotoğrafınızı güncelleyin
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <TouchableOpacity
              onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
              style={[
                styles.editButton,
                { backgroundColor: isEditing ? '#6b7280' : '#f97316' }
              ]}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? '❌ İptal' : '✏️ Düzenle'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                editable={isEditing}
                placeholder="Adınızı girin"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-posta</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                editable={isEditing}
                placeholder="E-posta adresinizi girin"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefon</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                editable={isEditing}
                placeholder="Telefon numaranızı girin"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Doğum Tarihi</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.birthDate}
                onChangeText={(text) => setFormData({...formData, birthDate: text})}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>💾 Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Tercihleri</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceIcon}>📧</Text>
              <View>
                <Text style={styles.preferenceTitle}>E-posta Bülteni</Text>
                <Text style={styles.preferenceSubtitle}>
                  Yeni ürünler ve kampanyalar hakkında bilgi alın
                </Text>
              </View>
            </View>
            <Switch
              value={formData.preferences.newsletter}
              onValueChange={(value) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, newsletter: value }
              })}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceIcon}>📱</Text>
              <View>
                <Text style={styles.preferenceTitle}>SMS Bildirimleri</Text>
                <Text style={styles.preferenceSubtitle}>
                  Sipariş durumu ve önemli güncellemeler
                </Text>
              </View>
            </View>
            <Switch
              value={formData.preferences.smsNotifications}
              onValueChange={(value) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, smsNotifications: value }
              })}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceIcon}>🔔</Text>
              <View>
                <Text style={styles.preferenceTitle}>Push Bildirimleri</Text>
                <Text style={styles.preferenceSubtitle}>
                  Mobil uygulama bildirimleri
                </Text>
              </View>
            </View>
            <Switch
              value={formData.preferences.pushNotifications}
              onValueChange={(value) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, pushNotifications: value }
              })}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Güvenlik</Text>
          
          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.securityLeft}>
              <Text style={styles.securityIcon}>🔐</Text>
              <View>
                <Text style={styles.securityTitle}>Şifre Değiştir</Text>
                <Text style={styles.securitySubtitle}>
                  Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
                </Text>
              </View>
            </View>
            <Text style={styles.securityArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.securityLeft}>
              <Text style={styles.securityIcon}>⚙️</Text>
              <View>
                <Text style={styles.securityTitle}>Uygulama Ayarları</Text>
                <Text style={styles.securitySubtitle}>
                  Bildirimler, dil ve diğer uygulama ayarları
                </Text>
              </View>
            </View>
            <Text style={styles.securityArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutLeft}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <View>
                <Text style={styles.logoutTitle}>Çıkış Yap</Text>
                <Text style={styles.logoutSubtitle}>
                  Hesabınızdan güvenli bir şekilde çıkış yapın
                </Text>
              </View>
            </View>
            <Text style={styles.logoutArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔐 Şifre Değiştir</Text>
              <Text style={styles.modalSubtitle}>
                Güvenliğiniz için güçlü bir şifre seçin
              </Text>
            </View>

            <View style={styles.modalInputs}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  secureTextEntry
                  placeholder="Mevcut şifrenizi girin"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  secureTextEntry
                  placeholder="En az 6 karakter"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                  secureTextEntry
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                <Text style={styles.modalCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handlePasswordChange}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>🔐 Şifre Değiştir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 60,
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  profileImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#f97316',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  cameraButtonText: {
    fontSize: 18,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f97316',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  securityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 14,
    color: '#92400e',
  },
  securityArrow: {
    fontSize: 24,
    color: '#92400e',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalInputs: {
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
  },
  logoutSubtitle: {
    fontSize: 14,
    color: '#dc2626',
  },
  logoutArrow: {
    fontSize: 24,
    color: '#dc2626',
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 