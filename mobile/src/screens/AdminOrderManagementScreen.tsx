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
import { useAuth } from '../contexts/AuthContext';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { CustomCard, LoadingState, EmptyState } from '../components/ui';

interface OrderItem {
  id: string;
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
  customerName?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'ready', label: 'Hazır' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal Edildi' },
];

const AdminOrderManagementScreen: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders(token);
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Siparişler yüklenemedi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      if (!token) throw new Error('Yetkilendirme hatası: Token bulunamadı');
      await updateOrderStatus(token, order.id, newStatus);
      loadOrders();
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Sipariş durumu güncellenemedi');
    }
  };

  const handleDeleteOrder = (order: Order) => {
    Alert.alert(
      'Siparişi Sil',
      `Sipariş #${order.id.slice(-8)} silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!token) throw new Error('Yetkilendirme hatası: Token bulunamadı');
              await deleteOrder(token, order.id);
              loadOrders();
            } catch (err: any) {
              Alert.alert('Hata', err.message || 'Sipariş silinemedi');
            }
          },
        },
      ]
    );
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

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <CustomCard style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Sipariş #{order.id.slice(-8)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          {order.customerName && <Text style={styles.customerName}>Müşteri: {order.customerName}</Text>}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}> 
          <Text style={styles.statusText}>{statusOptions.find(opt => opt.value === order.status)?.label || order.status}</Text>
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
        <View style={styles.actionsRow}>
          {/* Durum Değiştir */}
          {statusOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.statusActionBtn, order.status === opt.value && styles.selectedStatusBtn]}
              onPress={() => handleStatusChange(order, opt.value)}
              disabled={order.status === opt.value}
            >
              <Text style={[styles.statusActionText, order.status === opt.value && styles.selectedStatusText]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          {/* Sil */}
          <TouchableOpacity onPress={() => handleDeleteOrder(order)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomCard>
  );

  if (loading) {
    return <LoadingState message="Siparişler yükleniyor..." />;
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#dc2626', fontSize: 16, marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity onPress={loadOrders} style={{ backgroundColor: '#f97316', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading || refreshing}
            onRefresh={loadOrders}
            colors={['#f97316']}
            tintColor="#f97316"
          />
        }
        ListEmptyComponent={<EmptyState message="Henüz sipariş yok" icon="📦" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
  orderDate: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  customerName: {
    color: '#334155',
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  orderItems: {
    marginTop: 8,
    marginBottom: 8,
  },
  itemText: {
    color: '#0f172a',
    fontSize: 14,
  },
  moreItemsText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f97316',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  statusActionBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  selectedStatusBtn: {
    backgroundColor: '#f97316',
  },
  statusActionText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 13,
  },
  selectedStatusText: {
    color: '#fff',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default AdminOrderManagementScreen; 