import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Switch, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability, getMenuCategories } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/ui/CustomButton';
import CustomInput from '../components/ui/CustomInput';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
  stock: number;
  image?: string;
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  preparationTime?: number;
}

const defaultForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  available: true,
  preparationTime: '',
  calories: '',
  ingredients: '',
  allergens: '',
};

const MenuManagementScreen = () => {
  const { user, token } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenu();
    loadCategories();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const res = await getMenuItems();
      setMenuItems(res.data || res || []);
    } catch (e) {
      Alert.alert('Hata', 'Menü yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getMenuCategories();
      setCategories(res.data || res || []);
    } catch (e) {
      setCategories([]);
    }
  };

  const openEditModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        description: item.description,
        price: String(item.price),
        category: item.category,
        stock: String(item.stock),
        available: item.available,
        preparationTime: String(item.preparationTime || ''),
        calories: String(item.calories || ''),
        ingredients: item.ingredients?.join(', ') || '',
        allergens: item.allergens?.join(', ') || '',
      });
    } else {
      setEditingItem(null);
      setForm({ ...defaultForm });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      Alert.alert('Eksik Bilgi', 'İsim, fiyat ve kategori zorunludur.');
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
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        available: form.available,
        preparationTime: Number(form.preparationTime) || undefined,
        calories: Number(form.calories) || undefined,
        ingredients: form.ingredients.split(',').map(i => i.trim()).filter(i => i),
        allergens: form.allergens.split(',').map(a => a.trim()).filter(a => a),
      };
      if (editingItem) {
        await updateMenuItem(token, editingItem._id, itemData);
      } else {
        await createMenuItem(token, itemData);
      }
      setModalVisible(false);
      loadMenu();
    } catch (e) {
      Alert.alert('Hata', 'Kaydetme işlemi başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!token) {
      Alert.alert('Hata', 'Oturum bulunamadı.');
      return;
    }
    Alert.alert('Sil', `${item.name} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await deleteMenuItem(token, item._id);
            loadMenu();
          } catch (e) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        }
      }
    ]);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    if (!token) {
      Alert.alert('Hata', 'Oturum bulunamadı.');
      return;
    }
    try {
      await toggleMenuItemAvailability(token, item._id);
      loadMenu();
    } catch (e) {
      Alert.alert('Hata', 'Durum güncellenemedi.');
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>{item.name}</Text>
        <Switch value={item.available} onValueChange={() => handleToggleAvailability(item)} />
      </View>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.info}>Kategori: {item.category} | Fiyat: ₺{item.price}</Text>
      <Text style={styles.info}>Stok: {item.stock}</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <CustomButton title="Düzenle" onPress={() => openEditModal(item)} style={{ marginRight: 8 }} />
        <CustomButton title="Sil" onPress={() => handleDelete(item)} variant="danger" />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menü Yönetimi</Text>
        <CustomButton title="Yeni Ürün Ekle" onPress={() => openEditModal()} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Menüde ürün yok.</Text>}
        />
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{editingItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</Text>
              <CustomInput label="İsim" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
              <CustomInput label="Açıklama" value={form.description} onChangeText={v => setForm({ ...form, description: v })} multiline />
              <CustomInput label="Fiyat" value={form.price} onChangeText={v => setForm({ ...form, price: v })} keyboardType="numeric" />
              <CustomInput label="Kategori" value={form.category} onChangeText={v => setForm({ ...form, category: v })} />
              <CustomInput label="Stok" value={form.stock} onChangeText={v => setForm({ ...form, stock: v })} keyboardType="numeric" />
              <CustomInput label="Hazırlama Süresi (dk)" value={form.preparationTime} onChangeText={v => setForm({ ...form, preparationTime: v })} keyboardType="numeric" />
              <CustomInput label="Kalori" value={form.calories} onChangeText={v => setForm({ ...form, calories: v })} keyboardType="numeric" />
              <CustomInput label="İçerikler (virgülle)" value={form.ingredients} onChangeText={v => setForm({ ...form, ingredients: v })} />
              <CustomInput label="Alerjenler (virgülle)" value={form.allergens} onChangeText={v => setForm({ ...form, allergens: v })} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <Text style={{ marginRight: 8 }}>Ürün Aktif</Text>
                <Switch value={form.available} onValueChange={v => setForm({ ...form, available: v })} />
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
  desc: {
    color: '#666',
    marginVertical: 4,
  },
  info: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
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

export default MenuManagementScreen; 