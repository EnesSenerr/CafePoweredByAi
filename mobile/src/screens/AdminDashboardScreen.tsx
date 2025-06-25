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
import { AdminGuard } from '../components/navigation/RoleGuard';
import { CustomCard, LoadingState } from '../components/ui';
import { useRole } from '../hooks/useRole';
import { lightHaptic } from '../utils/haptics';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with spacing

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  newUsersToday: number;
  completedOrdersToday: number;
  revenueToday: number;
}

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getRoleDisplayName, getUserRole } = useRole();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    newUsersToday: 0,
    completedOrdersToday: 0,
    revenueToday: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch dashboard stats
      // const response = await api.getAdminDashboardStats();
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1250,
        totalOrders: 3420,
        totalRevenue: 125000,
        pendingOrders: 12,
        lowStockItems: 5,
        newUsersToday: 8,
        completedOrdersToday: 45,
        revenueToday: 2850,
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

  const formatCurrency = (amount: number): string => {
    return `₺${amount.toLocaleString('tr-TR')}`;
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
    <AdminGuard>
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
            <Text style={styles.title}>Admin Paneli</Text>
            <Text style={styles.subtitle}>
              Hoş geldiniz, {getRoleDisplayName()}
            </Text>
          </View>

          {/* Today's Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bugünün Özeti</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Yeni Üyeler"
                value={stats.newUsersToday}
                icon="👥"
                color="#22c55e"
              />
              <StatCard
                title="Tamamlanan Siparişler"
                value={stats.completedOrdersToday}
                icon="✅"
                color="#3b82f6"
              />
              <StatCard
                title="Günlük Ciro"
                value={formatCurrency(stats.revenueToday)}
                icon="💰"
                color="#f59e0b"
              />
              <StatCard
                title="Bekleyen Siparişler"
                value={stats.pendingOrders}
                subtitle="Acil"
                icon="⏰"
                color="#ef4444"
                onPress={() => handleCardPress('OrderManagement')}
              />
            </View>
          </View>

          {/* Overall Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Toplam Müşteri"
                value={stats.totalUsers.toLocaleString('tr-TR')}
                icon="👤"
                color="#8b5cf6"
                onPress={() => handleCardPress('UserManagement')}
              />
              <StatCard
                title="Toplam Sipariş"
                value={stats.totalOrders.toLocaleString('tr-TR')}
                icon="📦"
                color="#06b6d4"
              />
              <StatCard
                title="Toplam Ciro"
                value={formatCurrency(stats.totalRevenue)}
                icon="📈"
                color="#10b981"
                onPress={() => handleCardPress('Reports')}
              />
              <StatCard
                title="Düşük Stok"
                value={stats.lowStockItems}
                subtitle="Ürün"
                icon="⚠️"
                color="#f97316"
                onPress={() => handleCardPress('StockManagement')}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            <View style={styles.actionsContainer}>
              <QuickActionCard
                title="Kullanıcı Yönetimi"
                description="Müşteri ve çalışan hesaplarını yönetin"
                icon="👥"
                route="UserManagement"
              />
              <QuickActionCard
                title="Menü Yönetimi"
                description="Ürünleri ve fiyatları düzenleyin"
                icon="🍽️"
                route="MenuManagement"
              />
              <QuickActionCard
                title="Sipariş Yönetimi"
                description="Siparişleri takip edin ve yönetin"
                icon="📋"
                route="OrderManagement"
              />
              <QuickActionCard
                title="Raporlar"
                description="Satış ve performans raporlarını görün"
                icon="📊"
                route="Reports"
              />
              <QuickActionCard
                title="Stok Yönetimi"
                description="Envanter durumunu kontrol edin"
                icon="📦"
                route="StockManagement"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AdminGuard>
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
});

export default AdminDashboardScreen; 