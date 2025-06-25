import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RewardsDetail'>;

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  image?: string;
  category: string;
  isActive: boolean;
}

const RewardsDetailScreen = ({ navigation, route }: Props) => {
  const { rewardId } = route.params;
  const { token, user } = useAuth();
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewardDetail();
  }, [rewardId]);

  const loadRewardDetail = async () => {
    try {
      setLoading(true);
      // Mock reward data - gerçek uygulamada API'den gelecek
      const mockReward: Reward = {
        id: rewardId,
        title: 'Ücretsiz Kahve',
        description: 'Herhangi bir kahve çeşidini ücretsiz alın',
        pointsRequired: 500,
        category: 'drink',
        isActive: true,
      };
      setReward(mockReward);
    } catch (error) {
      console.error('Ödül detayı yüklenirken hata:', error);
      Alert.alert('Hata', 'Ödül detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = () => {
    if (!reward || !user) return;

    const userPoints = user.points || 0;
    if (userPoints < reward.pointsRequired) {
      Alert.alert(
        'Yetersiz Puan',
        `Bu ödül için ${reward.pointsRequired} puan gerekiyor. Mevcut puanınız: ${userPoints}`
      );
      return;
    }

    Alert.alert(
      'Ödül Kullan',
      `${reward.title} ödülünü ${reward.pointsRequired} puan karşılığında kullanmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kullan',
          onPress: () => {
            Alert.alert('Başarılı!', 'Ödülünüz başarıyla kullanıldı!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return '🍽️';
      case 'drink': return '☕';
      case 'dessert': return '🍰';
      case 'discount': return '💰';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return '#f97316';
      case 'drink': return '#8b5cf6';
      case 'dessert': return '#ec4899';
      case 'discount': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Ödül detayı yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!reward) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ödül bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userPoints = user?.points || 0;
  const canRedeem = userPoints >= reward.pointsRequired && reward.isActive;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödül Detayı</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Reward Image */}
        <View style={styles.imageContainer}>
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>
              {getCategoryIcon(reward.category)}
            </Text>
          </View>
          
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(reward.category) }]}>
            <Text style={styles.categoryText}>
              {getCategoryIcon(reward.category)} {reward.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Reward Info */}
        <View style={styles.infoSection}>
          <Text style={styles.rewardTitle}>{reward.title}</Text>
          <Text style={styles.rewardDescription}>{reward.description}</Text>
          
          <View style={styles.pointsContainer}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Gerekli Puan</Text>
              <Text style={styles.pointsValue}>{reward.pointsRequired} Puan</Text>
            </View>
            <View style={styles.userPointsInfo}>
              <Text style={styles.userPointsLabel}>Mevcut Puanınız</Text>
              <Text style={[
                styles.userPointsValue,
                { color: canRedeem ? '#10b981' : '#ef4444' }
              ]}>
                {userPoints} Puan
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              !canRedeem && styles.redeemButtonDisabled
            ]}
            onPress={handleRedeem}
            disabled={!canRedeem}
          >
            <Text style={[
              styles.redeemButtonText,
              !canRedeem && styles.redeemButtonTextDisabled
            ]}>
              {!reward.isActive ? '❌ Ödül Aktif Değil' :
               userPoints < reward.pointsRequired ? '⚠️ Yetersiz Puan' :
               '🎁 Ödülü Kullan'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
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
  headerBackButton: {
    padding: 8,
  },
  headerBackText: {
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
  imageContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointsInfo: {
    flex: 1,
    marginRight: 16,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f97316',
  },
  userPointsInfo: {
    flex: 1,
  },
  userPointsLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userPointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  redeemButton: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  redeemButtonTextDisabled: {
    color: '#9ca3af',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RewardsDetailScreen; 