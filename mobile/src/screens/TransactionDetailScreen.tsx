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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>;

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'expired';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
  rewardId?: string;
  referenceNumber?: string;
  status: 'completed' | 'pending' | 'failed';
}

const TransactionDetailScreen = ({ navigation, route }: Props) => {
  const { transactionId } = route.params;
  const { token } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactionDetail();
  }, [transactionId]);

  const loadTransactionDetail = async () => {
    try {
      setLoading(true);
      // Mock transaction data - gerçek uygulamada API'den gelecek
      const mockTransaction: Transaction = {
        id: transactionId,
        type: 'earned',
        amount: 150,
        description: 'Sipariş tamamlandı - Cappuccino ve Cheesecake',
        date: new Date().toISOString(),
        orderId: '12345',
        referenceNumber: `TXN${Date.now()}`,
        status: 'completed',
      };
      setTransaction(mockTransaction);
    } catch (error) {
      console.error('İşlem detayı yüklenirken hata:', error);
      Alert.alert('Hata', 'İşlem detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return '💰';
      case 'spent': return '🎁';
      case 'expired': return '⏰';
      default: return '📊';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return '#10b981';
      case 'spent': return '#f97316';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'earned': return 'Puan Kazandınız';
      case 'spent': return 'Puan Kullandınız';
      case 'expired': return 'Puan Süresi Doldu';
      default: return 'İşlem';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Beklemede';
      case 'failed': return 'Başarısız';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRelatedAction = () => {
    if (transaction?.orderId) {
      navigation.navigate('OrderDetail', { orderId: transaction.orderId });
    } else if (transaction?.rewardId) {
      navigation.navigate('RewardsDetail', { rewardId: transaction.rewardId });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>İşlem detayı yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>İşlem bulunamadı</Text>
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
        <Text style={styles.headerTitle}>İşlem Detayı</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Transaction Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.transactionIcon}>
            <Text style={styles.iconText}>
              {getTransactionIcon(transaction.type)}
            </Text>
          </View>
          
          <Text style={styles.typeText}>{getTypeText(transaction.type)}</Text>
          
          <Text style={[
            styles.amountText,
            { color: getTransactionColor(transaction.type) }
          ]}>
            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} Puan
          </Text>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(transaction.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusIcon(transaction.status)} {getStatusText(transaction.status)}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>İşlem Bilgileri</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>İşlem Numarası</Text>
              <Text style={styles.detailValue}>{transaction.id}</Text>
            </View>
            
            {transaction.referenceNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Referans Numarası</Text>
                <Text style={styles.detailValue}>{transaction.referenceNumber}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tarih ve Saat</Text>
              <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Açıklama</Text>
              <Text style={styles.detailValue}>{transaction.description}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Durum</Text>
              <Text style={[
                styles.detailValue,
                { color: getStatusColor(transaction.status) }
              ]}>
                {getStatusText(transaction.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Related Actions */}
        {(transaction.orderId || transaction.rewardId) && (
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>İlgili İşlemler</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRelatedAction}
            >
              <Text style={styles.actionButtonText}>
                {transaction.orderId ? '📦 Sipariş Detayını Görüntüle' : '🎁 Ödül Detayını Görüntüle'}
              </Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Yardıma mı ihtiyacınız var?</Text>
          
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => Alert.alert(
              'Yardım',
              'Bu işlemle ilgili sorularınız için destek ekibimizle iletişime geçebilirsiniz.',
              [{ text: 'Tamam' }]
            )}
          >
            <Text style={styles.helpButtonText}>💬 Destek Ekibiyle İletişime Geç</Text>
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
  summaryCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 36,
  },
  typeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 2,
    textAlign: 'right',
  },
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionArrow: {
    fontSize: 18,
    color: '#6b7280',
  },
  helpSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  helpButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

export default TransactionDetailScreen; 