'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  toggleMenuItemAvailability, 
  updateMenuItemStock,
  getMenuCategories 
} from '../api';

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
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

interface StockItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

export default function EmployeePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'menu' | 'stock' | 'orders'>('menu');
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Kahve',
    stock: 0,
    available: true,
    preparationTime: 5,
    calories: 0,
    ingredients: '',
    allergens: ''
  });

  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: 1, name: 'Kahve Çekirdeği', category: 'İçecek', currentStock: 25, minStock: 10, unit: 'kg', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Süt', category: 'İçecek', currentStock: 8, minStock: 5, unit: 'litre', lastUpdated: '2024-01-15' },
    { id: 3, name: 'Un', category: 'Atıştırmalık', currentStock: 3, minStock: 5, unit: 'kg', lastUpdated: '2024-01-14' },
    { id: 4, name: 'Mascarpone', category: 'Tatlı', currentStock: 2, minStock: 3, unit: 'kg', lastUpdated: '2024-01-13' }
  ]);

  useEffect(() => {
    // Auth yüklenmesini bekle
    if (authLoading) {
      return;
    }
    
    // Kullanıcı yoksa login'e yönlendir
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Employee veya Admin değilse dashboard'a yönlendir
    if (user.role !== 'employee' && user.role !== 'admin') {
      console.log('User role:', user.role, 'Expected: employee or admin');
      router.push('/dashboard');
      return;
    }
    
    console.log('Employee access granted for user:', user);
    loadMenuItems();
    loadCategories();
    setIsLoading(false);
  }, [user, authLoading, router]);

  const loadMenuItems = async () => {
    try {
      const response = await getMenuItems();
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Menu items yüklenirken hata:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getMenuCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const toggleItemAvailability = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await toggleMenuItemAvailability(token, id);
      loadMenuItems(); // Listeyi yenile
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      stock: item.stock,
      available: item.available,
      preparationTime: item.preparationTime || 5,
      calories: item.calories || 0,
      ingredients: item.ingredients?.join(', ') || '',
      allergens: item.allergens?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Kahve',
      stock: 0,
      available: true,
      preparationTime: 5,
      calories: 0,
      ingredients: '',
      allergens: ''
    });
    setShowModal(true);
  };

  const handleSaveItem = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const itemData = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a)
      };

      if (editingItem) {
        await updateMenuItem(token, editingItem._id, itemData);
      } else {
        await createMenuItem(token, itemData);
      }

      setShowModal(false);
      loadMenuItems();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await deleteMenuItem(token, id);
      loadMenuItems();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const updateStock = (id: number, newStock: number) => {
    setStockItems(items =>
      items.map(item =>
        item.id === id ? { ...item, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] } : item
      )
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Çalışan Paneli</h1>
          <p className="text-blue-100 text-lg">Menü ve stok yönetimi</p>
          <div className="mt-4 bg-blue-600/30 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm">Rol: </span>
            <span className="font-medium capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg">
            {[
              { key: 'menu', label: 'Menü Yönetimi', icon: '' },
                              { key: 'stock', label: 'Stok Kontrolü', icon: '' },
                { key: 'orders', label: 'Siparişler', icon: '' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Management */}
        {activeTab === 'menu' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h2>
              <button 
                onClick={handleNewItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-blue-600 font-medium">₺{item.price}</span>
                          <span className="text-gray-500">Kategori: {item.category}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            item.stock > 10 ? 'bg-green-100 text-green-800' : 
                            item.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Stok: {item.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItemAvailability(item._id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          item.available 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {item.available ? 'Devre Dışı Bırak' : 'Aktif Et'}
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Düzenle
                      </button>
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => handleDeleteItem(item._id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Management */}
        {activeTab === 'stock' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Stok Kontrolü</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Stok Girişi Yap
              </button>
            </div>

            <div className="grid gap-6">
              {stockItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        item.currentStock > item.minStock ? 'bg-green-500' : 
                        item.currentStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">Kategori: {item.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-gray-600">Mevcut: <strong>{item.currentStock} {item.unit}</strong></span>
                          <span className="text-gray-600">Minimum: <strong>{item.minStock} {item.unit}</strong></span>
                          <span className="text-gray-500 text-sm">Son güncelleme: {item.lastUpdated}</span>
                        </div>
                        {item.currentStock <= item.minStock && (
                          <div className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm inline-block">
                            Kritik seviye - Stok yenilenmeli
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        value={item.currentStock}
                        onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                      />
                      <span className="text-gray-600">{item.unit}</span>
                      <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                        Güncelle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Yeni Sipariş
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Rapor Al
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sipariş Sistemi</h3>
              <p className="text-gray-600 mb-6">
                Sipariş yönetimi sistemi yakında aktif olacak. 
                Gerçek zamanlı sipariş takibi ve yönetimi için AI entegrasyonu sonrası kullanıma açılacak.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-gray-600">Bekleyen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">0</div>
                  <div className="text-gray-600">Hazırlanıyor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-gray-600">Tamamlanan</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ürün adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Kahve">Kahve</option>
                    <option value="Tatlı">Tatlı</option>
                    <option value="Atıştırmalık">Atıştırmalık</option>
                    <option value="İçecek">İçecek</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Miktarı</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hazırlık Süresi (dk)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({...formData, preparationTime: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kalori</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ürün açıklamasını girin"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İçerikler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kahve, Süt, Şeker"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alerjenler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={formData.allergens}
                    onChange={(e) => setFormData({...formData, allergens: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Süt, Gluten"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({...formData, available: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Ürün aktif</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 