import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EmployeeGuard } from '../components/navigation/RoleGuard';
import { CustomCard, CustomButton, LoadingState, EmptyState } from '../components/ui';
import { useRole } from '../hooks/useRole';
import { lightHaptic, successHaptic } from '../utils/haptics';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: number;
  estimatedTime: number; // minutes
  createdAt: string;
  notes?: string;
}

const OrderProcessingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getRoleDisplayName } = useRole();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('pending');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const response = await api.getOrders();
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          customerName: 'Ahmet Yılmaz',
          customerPhone: '+90 555 123 4567',
          items: [
            { id: '1', name: 'Americano', quantity: 2, price: 25 },
            { id: '2', name: 'Cheesecake', quantity: 1, price: 35 },
          ],
          totalAmount: 85,
          status: 'pending',
          orderType: 'dine-in',
          tableNumber: 5,
          estimatedTime: 15,
          createdAt: '2024-01-20T10:30:00Z',
          notes: 'Şeker olmadan lütfen',
        },
        {
          id: 'ORD-002',
          customerName: 'Fatma Kaya',
          items: [
            { id: '3', name: 'Latte', quantity: 1, price: 30 },
            { id: '4', name: 'Croissant', quantity: 2, price: 20 },
          ],
          totalAmount: 70,
          status: 'preparing',
          orderType: 'takeaway',
          estimatedTime: 8,
          createdAt: '2024-01-20T10:45:00Z',
        },
        {
          id: 'ORD-003',
          customerName: 'Mehmet Öz',
          customerPhone: '+90 555 987 6543',
          items: [
            { id: '5', name: 'Cappuccino', quantity: 1, price: 28 },
          ],
          totalAmount: 28,
          status: 'ready',
          orderType: 'takeaway',
          estimatedTime: 5,
          createdAt: '2024-01-20T11:00:00Z',
        },
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleOrderAction = async (order: Order, action: 'start' | 'ready' | 'complete' | 'cancel') => {
    await lightHaptic();
    
    let newStatus: Order['status'];
    let actionMessage: string;
    
    switch (action) {
      case 'start':
        newStatus = 'preparing';
        actionMessage = 'Siparişi hazırlamaya başla?';
        break;
      case 'ready':
        newStatus = 'ready';
        actionMessage = 'Sipariş hazır olarak işaretle?';
        break;
      case 'complete':
        newStatus = 'completed';
        actionMessage = 'Siparişi tamamlandı olarak işaretle?';
        break;
      case 'cancel':
        newStatus = 'cancelled';
        actionMessage = 'Siparişi iptal et?';
        break;
      default:
        return;
    }

    Alert.alert(
      'Sipariş Durumu',
      `${order.id} - ${actionMessage}`,
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          onPress: async () => {
            // TODO: API call to update order status
            const updatedOrders = orders.map(o =>
              o.id === order.id ? { ...o, status: newStatus } : o
            );
            setOrders(updatedOrders);
            
            if (action === 'ready' || action === 'complete') {
              await successHaptic();
            }
          }
        }
      ]
    );
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const formatCurrency = (amount: number): string => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#22c55e';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'preparing': return 'Hazırlanıyor';
      case 'ready': return 'Hazır';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  const getOrderTypeIcon = (type: Order['orderType']): string => {
    switch (type) {
      case 'dine-in': return '🪑';
      case 'takeaway': return '🥤';
      case 'delivery': return '🚚';
      default: return '📦';
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <CustomCard style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
          {order.customerPhone && (
            <Text style={styles.customerPhone}>{order.customerPhone}</Text>
          )}
        </View>
        <View style={styles.orderMeta}>
          <View style={[styles.statusTag, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
          <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.orderTypeInfo}>
          <Text style={styles.orderTypeIcon}>{getOrderTypeIcon(order.orderType)}</Text>
          <Text style={styles.orderTypeText}>
            {order.orderType === 'dine-in' ? `Masa ${order.tableNumber}` : 
             order.orderType === 'takeaway' ? 'Paket' : 'Teslimat'}
          </Text>
          <Text style={styles.estimatedTime}>~{order.estimatedTime} dk</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {order.items.map((item, index) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      {order.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Not:</Text>
          <Text style={styles.notesText}>{order.notes}</Text>
        </View>
      )}

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Toplam: {formatCurrency(order.totalAmount)}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {order.status === 'pending' && (
          <CustomButton
            title="Hazırlamaya Başla"
            onPress={() => handleOrderAction(order, 'start')}
            variant="primary"
            style={styles.actionButton}
          />
        )}
        {order.status === 'preparing' && (
          <CustomButton
            title="Hazır"
            onPress={() => handleOrderAction(order, 'ready')}
            variant="success"
            style={styles.actionButton}
          />
        )}
        {order.status === 'ready' && (
          <CustomButton
            title="Teslim Edildi"
            onPress={() => handleOrderAction(order, 'complete')}
            variant="primary"
            style={styles.actionButton}
          />
        )}
        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <CustomButton
            title="İptal"
            onPress={() => handleOrderAction(order, 'cancel')}
            variant="danger"
            style={[styles.actionButton, { flex: 0.3 }]}
          />
        )}
      </View>
    </CustomCard>
  );

  if (loading) {
    return <LoadingState message="Siparişler yükleniyor..." />;
  }

  return (
    <EmployeeGuard>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sipariş İşleme</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
            {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusFilter,
                  selectedStatus === status && styles.activeStatusFilter
                ]}
                onPress={() => setSelectedStatus(status as any)}
              >
                <Text style={[
                  styles.statusFilterText,
                  selectedStatus === status && styles.activeStatusFilterText
                ]}>
                  {status === 'all' ? 'Tümü' : getStatusText(status as Order['status'])}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="Sipariş bulunamadı"
              message="Seçili duruma uygun sipariş bulunmuyor."
            />
          ) : (
            <View style={styles.ordersList}>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRight: {
    width: 50,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statusFilters: {
    flexDirection: 'row',
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  activeStatusFilter: {
    backgroundColor: '#f97316',
  },
  statusFilterText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  activeStatusFilterText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    padding: 20,
    gap: 16,
  },
  orderCard: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderTypeIcon: {
    fontSize: 16,
  },
  orderTypeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  estimatedTime: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  itemsList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    paddingVertical: 8,
    marginVertical: 8,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f97316',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  notesContainer: {
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#a16207',
  },
  orderFooter: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default OrderProcessingScreen; 