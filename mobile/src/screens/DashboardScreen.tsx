import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import PointsBalance from '../components/dashboard/PointsBalance';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import RewardsList from '../components/dashboard/RewardsList';
import LoyaltyLevel from '../components/dashboard/LoyaltyLevel';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getRewards, getPointHistory, redeemPoints } from '../services/api';
import { TabParamList } from '../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  const parentNavigation = useNavigation<any>();
  const { state: cartState } = useCart();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated, refreshUser, logout } = useAuth();

  // Seviye sistemi hesaplamaları
  const calculateLoyaltyLevel = (points: number) => {
    if (points >= 5000) return { level: 'Platinum', current: 5000, next: 5000 };
    if (points >= 2000) return { level: 'Gold', current: 2000, next: 5000 };
    if (points >= 500) return { level: 'Silver', current: 500, next: 2000 };
    return { level: 'Bronze', current: 0, next: 500 };
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Auth kontrolü
        if (!isAuthenticated || !token) {
          parentNavigation.replace('Login');
          return;
        }

        setLoading(true);
        
        // Kullanıcı verilerini ayarla
        if (user) {
          setPoints(user.points || 0);
        }
        
        // Paralel API çağrıları
        const [rewardsData] = await Promise.all([
          getRewards()
        ]);

        // Ödülleri güncelle
        setRewards(rewardsData.data || []);

        // Point history (eğer varsa)
        try {
          const historyData = await getPointHistory(token);
          if (historyData?.data?.transactions) {
            setTransactions(historyData.data.transactions);
          }
        } catch (historyError) {
          console.log('Point history hatası:', historyError);
          // Point history yoksa boş array
          setTransactions([]);
        }

      } catch (error: any) {
        console.error('Dashboard veri yükleme hatası:', error);
        Alert.alert('Hata', 'Veriler yüklenirken hata oluştu');
        
        // Token geçersizse login'e yönlendir
        if (error.message?.includes('401') || error.message?.includes('token')) {
          navigation.replace('Login');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigation, user, token, isAuthenticated]);

  const handleRedeemReward = async (rewardId: number) => {
    if (!token || !user) {
      Alert.alert('Hata', 'Lütfen tekrar giriş yapın');
      return;
    }

    const reward = rewards.find((r: any) => r.id === rewardId);
    if (!reward) {
      Alert.alert('Hata', 'Ödül bulunamadı');
      return;
    }

    if (points < reward.points) {
      Alert.alert('Yetersiz Puan', 'Bu ödül için yeterli puanınız bulunmuyor');
      return;
    }

    Alert.alert(
      'Ödül Kullan',
      `${reward.name} ödülünü kullanmak istediğinizden emin misiniz? (${reward.points} puan)`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kullan', 
          onPress: async () => {
            try {
              const result = await redeemPoints(token, rewardId.toString());
               
              // Başarılı ise puan bakiyesini güncelle
              setPoints(result.data.currentBalance);
              
              // Kullanıcı verilerini yenile
              await refreshUser();
              
              Alert.alert('Başarılı', `${reward.name} ödülünüz başarıyla kullanıldı!`);
            } catch (err: any) {
              Alert.alert('Hata', err.message || 'Ödül kullanılırken hata oluştu');
            }
          }
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.profileButtonText}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Hoş Geldiniz{user ? `, ${user.name}` : ''}</Text>
          <Text style={styles.subtitle}>Sadakat programınızda bugün neler var?</Text>
        </View>

        <View style={styles.section}>
          <LoyaltyLevel
            points={points}
            level={calculateLoyaltyLevel(points).level}
            nextLevelPoints={calculateLoyaltyLevel(points).next}
            currentLevelPoints={calculateLoyaltyLevel(points).current}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.quickActionIcon}>🍽️</Text>
              <Text style={styles.quickActionText}>Menü</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => parentNavigation.navigate('Cart')}
            >
              <Text style={styles.quickActionIcon}>🛒</Text>
              <Text style={styles.quickActionText}>
                Sepet {cartState.itemCount > 0 && `(${cartState.itemCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi</Text>
          <TransactionHistory transactions={transactions} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödül Kataloğu</Text>
          <RewardsList rewards={rewards} onRedeem={handleRedeemReward} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Daha açık ve temiz background
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151', // Daha koyu gri ile okunabilirlik artırıldı
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a', // Koyu renk ile okunabilirlik artırıldı
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  quickActionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});

export default DashboardScreen; 