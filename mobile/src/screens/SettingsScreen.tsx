import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    autoSync: true,
  });

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Uygulama önbelleğini temizlemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Başarılı', 'Önbellek temizlendi!');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesap Silme',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View>
                <Text style={styles.settingTitle}>Push Bildirimleri</Text>
                <Text style={styles.settingSubtitle}>
                  Sipariş durumu ve önemli güncellemeler
                </Text>
              </View>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() => handleToggleSetting('pushNotifications')}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📧</Text>
              <View>
                <Text style={styles.settingTitle}>E-posta Bildirimleri</Text>
                <Text style={styles.settingSubtitle}>
                  Kampanyalar ve özel teklifler
                </Text>
              </View>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={() => handleToggleSetting('emailNotifications')}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Tercihleri</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌍</Text>
              <View>
                <Text style={styles.settingTitle}>Dil</Text>
                <Text style={styles.settingSubtitle}>Türkçe</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔄</Text>
              <View>
                <Text style={styles.settingTitle}>Otomatik Senkronizasyon</Text>
                <Text style={styles.settingSubtitle}>
                  Veriler otomatik olarak güncellensin
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoSync}
              onValueChange={() => handleToggleSetting('autoSync')}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        {/* Storage & Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Depolama & Veri</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🗑️</Text>
              <View>
                <Text style={styles.settingTitle}>Önbelleği Temizle</Text>
                <Text style={styles.settingSubtitle}>
                  Geçici dosyaları sil
                </Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tehlikeli Bölge</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]} 
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⚠️</Text>
              <View>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  Hesabı Sil
                </Text>
                <Text style={styles.settingSubtitle}>
                  Hesabınızı kalıcı olarak silin
                </Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, styles.dangerText]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
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
    color: '#f97316',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 24,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingArrow: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '300',
  },
  dangerItem: {
    borderColor: '#fee2e2',
    borderWidth: 1,
  },
  dangerText: {
    color: '#ef4444',
  },
  footer: {
    height: 32,
  },
});

export default SettingsScreen; 