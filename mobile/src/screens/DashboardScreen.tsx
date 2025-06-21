import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PointsBalance from '../components/dashboard/PointsBalance';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import RewardsList from '../components/dashboard/RewardsList';
import { AuthHelpers, AuthTokenManager } from '../services/auth';
import { getUserProfile, getRewards, getPointHistory, redeemPoints } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Auth kontrolü
        const isAuth = await AuthHelpers.isAuthenticated();
        if (!isAuth) {
          navigation.replace('Login');
          return;
        }

        const token = await AuthTokenManager.getToken();
        const currentUser = await AuthHelpers.getCurrentUser();
        
        if (!token || !currentUser) {
          navigation.replace('Login');
          return;
        }

        setLoading(true);
        
        // Paralel API çağrıları
        const [profileData, rewardsData] = await Promise.all([
          getUserProfile(token),
          getRewards()
        ]);

        // Kullanıcı bilgilerini güncelle
        setUser(profileData.user);
        setPoints(profileData.user.points || 0);
        
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
          await AuthHelpers.logout();
          navigation.replace('Login');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigation]);

  const handleRedeemReward = async (rewardId: number) => {
    const token = await AuthTokenManager.getToken();
    const currentUser = await AuthHelpers.getCurrentUser();
    
    if (!token || !currentUser) {
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
            await AuthHelpers.logout();
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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Hoş Geldiniz{user ? `, ${user.name}` : ''}</Text>
          <Text style={styles.subtitle}>Sadakat programınızda bugün neler var?</Text>
        </View>

        <View style={styles.section}>
          <PointsBalance points={points} />
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
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
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
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
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
});

export default DashboardScreen; 