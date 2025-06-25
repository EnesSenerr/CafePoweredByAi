import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EmployeeGuard } from '../components/navigation/RoleGuard';
import { CustomCard, LoadingState } from '../components/ui';
import { useRole } from '../hooks/useRole';
import { lightHaptic } from '../utils/haptics';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface EmployeeStats {
  pendingOrders: number;
  completedOrdersToday: number;
  lowStockItems: number;
  totalOrders: number;
  averageOrderTime: number;
  customerRating: number;
}

const EmployeeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getRoleDisplayName } = useRole();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<EmployeeStats>({
    pendingOrders: 0,
    completedOrdersToday: 0,
    lowStockItems: 0,
    totalOrders: 0,
    averageOrderTime: 0,
    customerRating: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        pendingOrders: 8,
        completedOrdersToday: 32,
        lowStockItems: 3,
        totalOrders: 156,
        averageOrderTime: 12,
        customerRating: 4.7,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleCardPress = async (route: string) => {
    await lightHaptic();
    navigation.navigate(route);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color: string;
    onPress?: () => void;
  }> = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { width: cardWidth }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <CustomCard style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
        </View>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </CustomCard>
    </TouchableOpacity>
  );

  const QuickActionCard: React.FC<{
    title: string;
    description: string;
    icon: string;
    route: string;
  }> = ({ title, description, icon, route }) => (
    <TouchableOpacity onPress={() => handleCardPress(route)}>
      <CustomCard style={styles.actionCard}>
        <View style={styles.actionContent}>
          <Text style={styles.actionIcon}>{icon}</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionDescription}>{description}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </CustomCard>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingState message="Dashboard yükleniyor..." />;
  }

  return (
    <EmployeeGuard>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Çalışan Paneli</Text>
            <Text style={styles.subtitle}>
              Hoş geldiniz, {getRoleDisplayName()}
            </Text>
          </View>

          {/* Today's Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bugünün Durumu</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Bekleyen Siparişler"
                value={stats.pendingOrders}
                subtitle="Acil"
                icon="⏰"
                color="#ef4444"
                onPress={() => handleCardPress('OrderProcessing')}
              />
              <StatCard
                title="Tamamlanan"
                value={stats.completedOrdersToday}
                subtitle="Bugün"
                icon="✅"
                color="#22c55e"
              />
              <StatCard
                title="Ortalama Süre"
                value={`${stats.averageOrderTime} dk`}
                subtitle="Sipariş"
                icon="⏱️"
                color="#3b82f6"
              />
              <StatCard
                title="Müşteri Puanı"
                value={stats.customerRating.toFixed(1)}
                subtitle="⭐ Ortalama"
                icon="👥"
                color="#f59e0b"
              />
            </View>
          </View>

          {/* Alerts */}
          {stats.lowStockItems > 0 && (
            <View style={styles.section}>
              <TouchableOpacity onPress={() => handleCardPress('StockManagement')}>
                <CustomCard style={styles.alertCard}>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertIcon}>⚠️</Text>
                    <View style={styles.alertText}>
                      <Text style={styles.alertTitle}>Düşük Stok Uyarısı</Text>
                      <Text style={styles.alertDescription}>
                        {stats.lowStockItems} ürünün stoğu azalıyor
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </CustomCard>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            <View style={styles.actionsContainer}>
              <QuickActionCard
                title="Sipariş İşleme"
                description="Bekleyen siparişleri görüntüle ve işle"
                icon="📋"
                route="OrderProcessing"
              />
              <QuickActionCard
                title="Stok Yönetimi"
                description="Envanter durumunu kontrol et"
                icon="📦"
                route="StockManagement"
              />
              <QuickActionCard
                title="Ödeme İşlemleri"
                description="Ödemeleri al ve kaydet"
                icon="💳"
                route="PaymentProcessing"
              />
              <QuickActionCard
                title="Müşteri Hizmetleri"
                description="Müşteri sorularını yanıtla"
                icon="🎧"
                route="CustomerService"
              />
            </View>
          </View>

          {/* Performance Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performans Özeti</Text>
            <CustomCard style={styles.performanceCard}>
              <View style={styles.performanceContent}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{stats.totalOrders}</Text>
                  <Text style={styles.performanceLabel}>Toplam Sipariş</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{stats.completedOrdersToday}</Text>
                  <Text style={styles.performanceLabel}>Bugün</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{stats.customerRating.toFixed(1)}</Text>
                  <Text style={styles.performanceLabel}>Puan</Text>
                </View>
              </View>
            </CustomCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </EmployeeGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 20,
  },
  statCard: {
    marginBottom: 20,
  },
  cardContent: {
    padding: 16,
    height: 120,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  alertCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#a16207',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  chevron: {
    fontSize: 24,
    color: '#d1d5db',
    fontWeight: '300',
  },
  performanceCard: {
    marginHorizontal: 20,
    padding: 20,
  },
  performanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
});

export default EmployeeDashboardScreen; 