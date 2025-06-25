import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = BottomTabScreenProps<TabParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  const parentNavigation = useNavigation<any>();
  const { state: cartState } = useCart();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated, refreshUser, logout, refreshAuth } = useAuth();

  // Seviye sistemi hesaplamaları
  const calculateLoyaltyLevel = (points: number) => {
    if (points >= 15000) return { level: 'Platinum', next: null, current: 15000 };
    if (points >= 5000) return { level: 'Gold', next: 15000, current: 5000 };
    if (points >= 1000) return { level: 'Silver', next: 5000, current: 1000 };
    return { level: 'Bronze', next: 1000, current: 0 };
  };

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Hata', 'Oturum bilgisi bulunamadı');
        return;
      }

      // Kullanıcı bilgilerini güncelle
      await refreshAuth();
      
      // User güncellendiğinde points'i güncelle
      if (user) {
        setPoints(user.points || 0);
      }
      
      const [rewardsData] = await Promise.all([
        getRewards()
      ]);

      setRewards(rewardsData.data || []);

      try {
        const historyData = await getPointHistory(token);
        if (historyData?.data?.transactions) {
          setTransactions(historyData.data.transactions);
        }
      } catch (historyError) {
        console.warn('İşlem geçmişi yüklenemedi:', historyError);
        setTransactions([]);
      }

    } catch (error: any) {
      console.error('Dashboard yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Hata', 'Oturum bilgisi bulunamadı');
        return;
      }

      setLoading(true);
      
      // Ödül kullanma işlemi
      const response = await redeemPoints(token, rewardId.toString());
      
      if (response.success) {
        Alert.alert(
          'Başarılı!',
          `Ödül başarıyla kullanıldı! ${response.message || ''}`,
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Dashboard'u yenile
                initializeDashboard();
              }
            }
          ]
        );
      } else {
        Alert.alert('Hata', response.message || 'Ödül kullanılırken hata oluştu');
      }
    } catch (error: any) {
      console.error('Ödül kullanım hatası:', error);
      let errorMessage = 'Ödül kullanılırken hata oluştu';
      
      if (error.message?.includes('insufficient points')) {
        errorMessage = 'Yetersiz puan';
      } else if (error.message?.includes('reward not found')) {
        errorMessage = 'Ödül bulunamadı';
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Oturumu kapatmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation otomatik olarak AuthGuard tarafından yönlendirilecek
            } catch (error) {
              console.error('Logout hatası:', error);
              Alert.alert('Hata', 'Çıkış yaparken hata oluştu');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Dashboard yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              try {
                setLoading(true);
                const token = await AsyncStorage.getItem('authToken');
                
                if (!token) {
                  Alert.alert('Hata', 'Oturum bilgisi bulunamadı');
                  return;
                }

                // Kullanıcı bilgilerini güncelle
                await refreshAuth();
                
                // User güncellendiğinde points'i güncelle
                if (user) {
                  setPoints(user.points || 0);
                }
                
                const [rewardsData] = await Promise.all([
                  getRewards()
                ]);

                setRewards(rewardsData.data || []);

                try {
                  const historyData = await getPointHistory(token);
                  if (historyData?.data?.transactions) {
                    setTransactions(historyData.data.transactions);
                  }
                } catch (historyError) {
                  setTransactions([]);
                }

              } catch (error: any) {
                console.error('Dashboard refresh hatası:', error);
                Alert.alert('Hata', 'Veriler yüklenirken hata oluştu');
              } finally {
                setLoading(false);
              }
            }}
            colors={['#f97316']}
            tintColor="#f97316"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.profileButton} onPress={() => parentNavigation.navigate('Profile')}>
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
            nextLevelPoints={calculateLoyaltyLevel(points).next || 0}
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
              onPress={() => parentNavigation.navigate('OrderHistory')}
            >
              <Text style={styles.quickActionIcon}>📦</Text>
              <Text style={styles.quickActionText}>Siparişlerim</Text>
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
          <RewardsList 
            rewards={rewards} 
            onRedeem={handleRedeemReward}
            onRewardPress={(rewardId) => parentNavigation.navigate('RewardsDetail', { rewardId })}
          />
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