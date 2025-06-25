import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/ui/CustomButton';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    menuItem: { name: string; price: number };
    quantity: number;
    notes?: string;
  }>;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Bekliyor',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

const statusOptions: Array<{ value: Order['status']; label: string }> = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'ready', label: 'Hazır' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal' },
];

const OrderManagementScreen = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAllOrders(token);
      setOrders(res.data || res || []);
    } catch (e) {
      Alert.alert('Hata', 'Siparişler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleStatusChange = async (status: Order['status']) => {
    if (!token || !selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrderStatus(token, selectedOrder._id, status);
      setModalVisible(false);
      loadOrders();
    } catch (e) {
      Alert.alert('Hata', 'Durum güncellenemedi.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!token) return;
    Alert.alert('Sil', `Sipariş #${order.orderNumber} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await deleteOrder(token, order._id);
            loadOrders();
          } catch (e) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.card} onPress={() => openOrderModal(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>#{item.orderNumber}</Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>{statusLabels[item.status]}</Text>
      </View>
      <Text style={styles.info}>Toplam: ₺{item.total}</Text>
      <Text style={styles.info}>Müşteri: {item.customerName || '-'}</Text>
      <Text style={styles.info}>Masa: {item.tableNumber || '-'}</Text>
      <Text style={styles.info}>Tarih: {new Date(item.createdAt).toLocaleString('tr-TR')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sipariş Yönetimi</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Henüz sipariş yok.</Text>}
        />
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <ScrollView>
                <Text style={styles.modalTitle}>Sipariş Detayı</Text>
                <Text style={styles.info}>Sipariş No: #{selectedOrder.orderNumber}</Text>
                <Text style={styles.info}>Müşteri: {selectedOrder.customerName || '-'}</Text>
                <Text style={styles.info}>Telefon: {selectedOrder.customerPhone || '-'}</Text>
                <Text style={styles.info}>Masa: {selectedOrder.tableNumber || '-'}</Text>
                <Text style={styles.info}>Tarih: {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</Text>
                <Text style={styles.info}>Durum: {statusLabels[selectedOrder.status]}</Text>
                <Text style={[styles.info, { marginTop: 8, fontWeight: 'bold' }]}>Sipariş İçeriği:</Text>
                {selectedOrder.items.map((item, idx) => (
                  <Text key={idx} style={styles.info}>- {item.quantity}x {item.menuItem?.name} (₺{item.menuItem?.price})</Text>
                ))}
                {selectedOrder.notes && (
                  <Text style={[styles.info, { marginTop: 8 }]}>Not: {selectedOrder.notes}</Text>
                )}
                <View style={{ flexDirection: 'row', marginTop: 16, flexWrap: 'wrap' }}>
                  {statusOptions.map(opt => (
                    <CustomButton
                      key={opt.value}
                      title={opt.label}
                      onPress={() => handleStatusChange(opt.value)}
                      variant={selectedOrder.status === opt.value ? 'primary' : 'secondary'}
                      style={{ marginRight: 8, marginBottom: 8 }}
                      disabled={updating || selectedOrder.status === opt.value}
                    />
                  ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                  <CustomButton title="Kapat" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }} variant="secondary" />
                  <CustomButton title="Sil" onPress={() => handleDelete(selectedOrder)} variant="danger" />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  info: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  status_pending: { backgroundColor: '#fbbf24', color: '#fff' },
  status_preparing: { backgroundColor: '#60a5fa', color: '#fff' },
  status_ready: { backgroundColor: '#f59e42', color: '#fff' },
  status_completed: { backgroundColor: '#10b981', color: '#fff' },
  status_cancelled: { backgroundColor: '#ef4444', color: '#fff' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },
});

export default OrderManagementScreen; 