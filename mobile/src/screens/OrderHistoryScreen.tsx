import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderHistory'>;

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

const OrderHistoryScreen = ({ navigation }: Props) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getOrders(token);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      Alert.alert('Hata', 'Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Beklemede';
      case 'preparing': return '👨‍🍳 Hazırlanıyor';
      case 'ready': return '✅ Hazır';
      case 'completed': return '🎉 Tamamlandı';
      case 'cancelled': return '❌ İptal Edildi';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#10b981';
      case 'completed': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
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

  const formatPrice = (price: number) => {
    return `${price} ₺`;
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(order)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Sipariş #{order.id.slice(-8)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItemsText}>
            +{order.items.length - 2} ürün daha
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
        <Text style={styles.viewDetailText}>Detayları Gör ›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Siparişler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Sipariş Geçmişi</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadOrders}
            colors={['#f97316']}
            tintColor="#f97316"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Henüz siparişiniz yok</Text>
            <Text style={styles.emptySubtitle}>
              Menüden sipariş vererek geçmişinizi oluşturmaya başlayın
            </Text>
            <TouchableOpacity
              style={styles.browseMenuButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.browseMenuText}>🍽️ Menüyü Görüntüle</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  moreItemsText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  viewDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  browseMenuButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseMenuText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen; 