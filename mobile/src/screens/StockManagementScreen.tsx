import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { getAllStockItems, createStockItem, updateStockItem, updateStock, deleteStockItem, getCriticalStock } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/ui/CustomButton';
import CustomInput from '../components/ui/CustomInput';

interface StockItem {
  _id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  stockStatus: string;
  criticalLevel?: number;
  isActive?: boolean;
}

const defaultForm = {
  name: '',
  category: '',
  currentStock: '',
  unit: '',
  criticalLevel: '',
  isActive: true,
};

const StockManagementScreen = () => {
  const { token } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);
  const [criticalStock, setCriticalStock] = useState<StockItem[]>([]);

  useEffect(() => {
    loadStock();
    loadCriticalStock();
  }, []);

  const loadStock = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAllStockItems(token);
      setStockItems(res.data || res || []);
    } catch (e) {
      Alert.alert('Hata', 'Stoklar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const loadCriticalStock = async () => {
    if (!token) return;
    try {
      const res = await getCriticalStock(token);
      setCriticalStock(res.data || res || []);
    } catch (e) {
      setCriticalStock([]);
    }
  };

  const openEditModal = (item?: StockItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        category: item.category,
        currentStock: String(item.currentStock),
        unit: item.unit,
        criticalLevel: String(item.criticalLevel || ''),
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    } else {
      setEditingItem(null);
      setForm({ ...defaultForm });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.unit) {
      Alert.alert('Eksik Bilgi', 'İsim ve birim zorunludur.');
      return;
    }
    if (!token) {
      Alert.alert('Hata', 'Oturum bulunamadı.');
      return;
    }
    setSaving(true);
    try {
      const itemData = {
        name: form.name,
        category: form.category,
        currentStock: Number(form.currentStock),
        unit: form.unit,
        criticalLevel: Number(form.criticalLevel) || undefined,
        isActive: form.isActive,
      };
      if (editingItem) {
        await updateStockItem(token, editingItem._id, itemData);
      } else {
        await createStockItem(token, itemData);
      }
      setModalVisible(false);
      loadStock();
      loadCriticalStock();
    } catch (e) {
      Alert.alert('Hata', 'Kaydetme işlemi başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: StockItem) => {
    if (!token) {
      Alert.alert('Hata', 'Oturum bulunamadı.');
      return;
    }
    Alert.alert('Sil', `${item.name} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await deleteStockItem(token, item._id);
            loadStock();
            loadCriticalStock();
          } catch (e) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: StockItem }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>{item.name}</Text>
        <Switch value={item.isActive} onValueChange={() => {}} disabled />
      </View>
      <Text style={styles.info}>Kategori: {item.category || '-'}</Text>
      <Text style={styles.info}>Stok: {item.currentStock} {item.unit}</Text>
      <Text style={styles.info}>Kritik Seviye: {item.criticalLevel || '-'}</Text>
      <Text style={styles.info}>Durum: {item.stockStatus}</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <CustomButton title="Düzenle" onPress={() => openEditModal(item)} style={{ marginRight: 8 }} />
        <CustomButton title="Sil" onPress={() => handleDelete(item)} variant="danger" />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stok Yönetimi</Text>
        <CustomButton title="Yeni Stok Ekle" onPress={() => openEditModal()} />
      </View>
      {criticalStock.length > 0 && (
        <View style={styles.criticalBox}>
          <Text style={styles.criticalTitle}>Kritik Stoklar</Text>
          {criticalStock.map(item => (
            <Text key={item._id} style={styles.criticalItem}>{item.name} ({item.currentStock} {item.unit})</Text>
          ))}
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={stockItems}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Stokta ürün yok.</Text>}
        />
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{editingItem ? 'Stok Düzenle' : 'Yeni Stok Ekle'}</Text>
              <CustomInput label="İsim" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
              <CustomInput label="Kategori" value={form.category} onChangeText={v => setForm({ ...form, category: v })} />
              <CustomInput label="Stok Miktarı" value={form.currentStock} onChangeText={v => setForm({ ...form, currentStock: v })} keyboardType="numeric" />
              <CustomInput label="Birim" value={form.unit} onChangeText={v => setForm({ ...form, unit: v })} />
              <CustomInput label="Kritik Seviye" value={form.criticalLevel} onChangeText={v => setForm({ ...form, criticalLevel: v })} keyboardType="numeric" />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <Text style={{ marginRight: 8 }}>Aktif</Text>
                <Switch value={form.isActive} onValueChange={v => setForm({ ...form, isActive: v })} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <CustomButton title="İptal" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }} variant="secondary" />
                <CustomButton title={saving ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Kaydet')} onPress={handleSave} disabled={saving} />
              </View>
            </ScrollView>
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
  criticalBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
    margin: 16,
  },
  criticalTitle: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  criticalItem: {
    color: '#b91c1c',
    fontSize: 14,
  },
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

export default StockManagementScreen; 