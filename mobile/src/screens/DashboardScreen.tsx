import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  RefreshControl,
  Image,
  Dimensions
} from 'react-native';
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
import HomeScreen from './HomeScreen';

type Props = BottomTabScreenProps<TabParamList, 'Dashboard'>;

const { width } = Dimensions.get('window');

// Seviye hesaplama utility fonksiyonu - Web ile aynı
const calculateUserLevel = (points: number) => {
  let userLevel = 'Bronze';
  let nextLevel = 'Silver';
  let requiredPoints = 250;
  let currentLevelPoints = 0;
  
  if (points >= 1000) {
    userLevel = 'Platinum';
    nextLevel = 'Diamond';
    requiredPoints = 2000;
    currentLevelPoints = 1000;
  } else if (points >= 500) {
    userLevel = 'Gold';
    nextLevel = 'Platinum';
    requiredPoints = 1000;
    currentLevelPoints = 500;
  } else if (points >= 250) {
    userLevel = 'Silver';
    nextLevel = 'Gold';
    requiredPoints = 500;
    currentLevelPoints = 250;
  }
  
  const progressPercentage = Math.min(((points - currentLevelPoints) / (requiredPoints - currentLevelPoints)) * 100, 100);
  
  return {
    userLevel,
    nextLevel,
    requiredPoints,
    currentLevelPoints,
    progressPercentage,
    remainingPoints: Math.max(0, requiredPoints - points)
  };
};

const DashboardScreen = ({ navigation }: Props) => {
  const parentNavigation = useNavigation<any>();
  const { state: cartState } = useCart();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, token, isAuthenticated, refreshUser, logout, refreshAuth } = useAuth();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        // Giriş yapılmamışsa sadece bilgilendirme göster
        setLoading(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeDashboard();
    setRefreshing(false);
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

  const levelInfo = calculateUserLevel(points);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Dashboard yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!token) {
    return <HomeScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f97316']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hoş geldiniz</Text>
            <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
          </View>
          
          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelEmoji}>
              {levelInfo.userLevel === 'Platinum' ? '💎' : 
               levelInfo.userLevel === 'Gold' ? '🏆' : 
               levelInfo.userLevel === 'Silver' ? '🥈' : '🥉'}
            </Text>
            <Text style={styles.levelText}>{levelInfo.userLevel} Üye</Text>
          </View>
        </View>

        {/* Points Card */}
        <View style={styles.section}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <Text style={styles.pointsTitle}>Puan Bakiyeniz</Text>
              <TouchableOpacity style={styles.historyButton}>
                <Text style={styles.historyButtonText}>Geçmiş</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pointsContent}>
              <Text style={styles.pointsAmount}>{points.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>AI Puan</Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                {levelInfo.nextLevel}'e {levelInfo.remainingPoints} puan
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${levelInfo.progressPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => parentNavigation.navigate('Menu')}
            >
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionTitle}>Sipariş Ver</Text>
              <Text style={styles.actionSubtitle}>Menüyü keşfet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => parentNavigation.navigate('Favorites')}
            >
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionTitle}>Favorilerim</Text>
              <Text style={styles.actionSubtitle}>Beğendiklerim</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödüller</Text>
          <View style={styles.rewardsContainer}>
            {rewards.slice(0, 3).map((reward, index) => (
              <TouchableOpacity
                key={`reward-${reward.id || index}`}
                style={styles.rewardCard}
                onPress={() => handleRedeemReward(reward.id)}
                disabled={points < reward.points}
              >
                <View style={styles.rewardContent}>
                  <Text style={styles.rewardTitle}>{reward.name}</Text>
                  <Text style={styles.rewardPoints}>{reward.points} puan</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
                <View style={[
                  styles.rewardButton,
                  points < reward.points && styles.rewardButtonDisabled
                ]}>
                  <Text style={[
                    styles.rewardButtonText,
                    points < reward.points && styles.rewardButtonTextDisabled
                  ]}>
                    {points >= reward.points ? 'Kullan' : 'Yetersiz'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>
            <View style={styles.transactionsContainer}>
              {transactions.slice(0, 5).map((transaction, index) => (
                <View key={`transaction-${transaction.id || Date.now()}-${index}`} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>
                      {transaction.type === 'earn' ? '💰' : '🎁'}
                    </Text>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'earn' ? '#22c55e' : '#f97316' }
                  ]}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
  heroSection: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  pointsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  historyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsContent: {
    marginBottom: 10,
  },
  pointsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#374151',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  actionCard: {
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
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#374151',
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardCard: {
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
  rewardContent: {
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#374151',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#374151',
  },
  rewardButton: {
    backgroundColor: '#f97316',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  rewardButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  rewardButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  rewardButtonTextDisabled: {
    color: '#374151',
  },
  transactionsContainer: {
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionIcon: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
  },
  transactionIconText: {
    fontSize: 24,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  transactionDate: {
    fontSize: 12,
    color: '#374151',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 