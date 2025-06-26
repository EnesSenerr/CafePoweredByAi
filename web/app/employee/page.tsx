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
  getMenuCategories,
  createOrder,
  getOrders,
  updateOrderStatus,
  downloadReport,
  getStockItems,
  updateStock,
  checkMenuAvailability,
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
  createdBy?: string;
  updatedBy?: string;
  requiredIngredients?: Array<{
    stockItem: {
      _id: string;
      name: string;
      currentStock: number;
      unit: string;
      category: string;
      stockStatus: string;
    };
    quantity: number;
    unit: string;
  }>;
  ingredientAvailability?: 'available' | 'partially_available' | 'unavailable';
}

interface StockItem {
  _id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price?: number;
  supplier?: string;
  description?: string;
  isActive: boolean;
  lastUpdated: string;
  stockStatus?: string;
  stockColor?: string;
  updatedBy?: {
    name: string;
    email: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    menuItem: MenuItem;
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

interface OrderItem {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

interface Ingredient {
  name: string;
  shortage?: number;
  required: number;
  available: number;
  unit: string;
}

interface UnavailableItem {
  name: string;
  canMake: boolean;
  unavailableIngredients: Ingredient[];
}

export default function EmployeePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'menu' | 'stock' | 'orders'>('menu');
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [, setCategories] = useState<string[]>([]);
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

  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  // Order states
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderCustomerPhone, setOrderCustomerPhone] = useState('');
  const [orderTableNumber, setOrderTableNumber] = useState<number | undefined>();
  const [orderNotes, setOrderNotes] = useState('');

  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'sales' | 'inventory'>('sales');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  useEffect(() => {
    // Auth yüklenmesini bekle
    if (authLoading) {
      return;
    }
    
    // Kullanıcı yoksa login'e yönlendir
    if (!user) {
              router.push('/giris');
      return;
    }
    
    // Employee veya Admin değilse dashboard'a yönlendir
    if (user.role !== 'employee' && user.role !== 'admin') {
      console.log('User role:', user.role, 'Expected: employee or admin');
              router.push('/hesabim');
      return;
    }
    
    console.log('Employee access granted for user:', user);
    loadMenuItems();
    loadCategories();
    loadOrders();
    loadStockItems();
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

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await getOrders(token, { limit: 20 });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    }
  };

  const loadStockItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await getStockItems(token, { limit: 50 });
      setStockItems(response.data || []);
    } catch (error) {
      console.error('Stok öğeleri yüklenirken hata:', error);
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

  const handleStockUpdate = async (id: string, quantity: number, type: 'in' | 'out', notes?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await updateStock(token, id, { quantity, type, notes });
      loadStockItems(); // Stok listesini yenile
      alert(`Stok ${type === 'in' ? 'girişi' : 'çıkışı'} başarıyla yapıldı!`);
    } catch (error) {
      console.error('Stok güncelleme hatası:', error);
      alert('Stok güncellenirken hata oluştu!');
    }
  };

  // Order functions
  const handleNewOrder = () => {
    setOrderItems([]);
    setOrderCustomerName('');
    setOrderCustomerPhone('');
    setOrderTableNumber(undefined);
    setOrderNotes('');
    setShowOrderModal(true);
  };

  const addOrderItem = (menuItemId: string) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItemId);
    if (existingItem) {
      setOrderItems(items =>
        items.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { menuItemId, quantity: 1 }]);
    }
  };

  const removeOrderItem = (menuItemId: string) => {
    setOrderItems(items => items.filter(item => item.menuItemId !== menuItemId));
  };

  const updateOrderItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeOrderItem(menuItemId);
      return;
    }
    setOrderItems(items =>
      items.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleCreateOrder = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || orderItems.length === 0) return;

      const orderData = {
        items: orderItems,
        customerName: orderCustomerName || undefined,
        customerPhone: orderCustomerPhone || undefined,
        tableNumber: orderTableNumber,
        notes: orderNotes || undefined
      };

      await createOrder(token, orderData);
      setShowOrderModal(false);
      loadOrders();
      alert('Sipariş başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      alert('Sipariş oluşturulurken hata oluştu!');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await updateOrderStatus(token, orderId, status);
      loadOrders();
    } catch (error) {
      console.error('Sipariş durumu güncelleme hatası:', error);
    }
  };

  // Report functions
  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const filters = {
        startDate: reportStartDate,
        endDate: reportEndDate
      };

      const blob = await downloadReport(token, reportType, filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-raporu-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowReportModal(false);
      alert('Rapor başarıyla indirildi!');
    } catch (error) {
      console.error('Rapor indirme hatası:', error);
      alert('Rapor indirilirken hata oluştu!');
    }
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
              <div className="flex space-x-3">
                <button 
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      if (!token) return;
                      
                      const response = await checkMenuAvailability(token);
                      const unavailableItems = response.data.filter((item: UnavailableItem) => !item.canMake);
                      
                      if (unavailableItems.length === 0) {
                        alert('Tüm menü öğeleri için malzemeler yeterli! 🎉');
                      } else {
                        const message = `${unavailableItems.length} ürün için malzemeler yetersiz:\n\n` +
                          unavailableItems.map((item: UnavailableItem) =>
                            `• ${item.name}: ${item.unavailableIngredients.map((ing: Ingredient) =>
                              `${ing.name} (${ing.shortage || (ing.required - ing.available)} ${ing.unit} eksik)`
                            ).join(', ')}`
                          ).join('\n');
                        alert(message);
                      }
                    } catch (error) {
                      console.error('Malzeme kontrolü hatası:', error);
                      alert('Malzeme kontrolü yapılırken hata oluştu!');
                    }
                  }}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  🔍 Malzeme Kontrolü
                </button>
                <button 
                  onClick={handleNewItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Ürün Ekle
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
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
                          {item.ingredientAvailability && (
                            <span className={`text-sm px-2 py-1 rounded ${
                              item.ingredientAvailability === 'available' ? 'bg-green-100 text-green-800' :
                              item.ingredientAvailability === 'partially_available' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.ingredientAvailability === 'available' ? 'Malzemeler Uygun' :
                               item.ingredientAvailability === 'partially_available' ? 'Kısmi Malzeme' :
                               'Malzeme Eksik'}
                            </span>
                          )}
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
                  
                  {/* Malzeme Bilgileri */}
                  {item.requiredIngredients && item.requiredIngredients.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Gerekli Malzemeler:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.requiredIngredients.map((ingredient, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {ingredient.stockItem?.name || 'Bilinmeyen malzeme'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {ingredient.stockItem?.category}
                                </p>
                              </div>
                              <div className={`w-2 h-2 rounded-full ml-2 ${
                                ingredient.stockItem?.currentStock >= ingredient.quantity 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                              }`}></div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                Gerekli: <strong>{ingredient.quantity} {ingredient.unit}</strong>
                              </span>
                              <span className={`${
                                (function() {
                                  // Basit birim çevirimi kontrolü
                                  const weightUnits = ['gram', 'kg'];
                                  const volumeUnits = ['ml', 'litre'];
                                  
                                  let available = ingredient.stockItem?.currentStock || 0;
                                  let required = ingredient.quantity;
                                  
                                  // Birim çevirimi
                                  if (weightUnits.includes(ingredient.unit) && weightUnits.includes(ingredient.stockItem?.unit)) {
                                    if (ingredient.stockItem?.unit === 'kg') available *= 1000;
                                    if (ingredient.unit === 'kg') required *= 1000;
                                  } else if (volumeUnits.includes(ingredient.unit) && volumeUnits.includes(ingredient.stockItem?.unit)) {
                                    if (ingredient.stockItem?.unit === 'litre') available *= 1000;
                                    if (ingredient.unit === 'litre') required *= 1000;
                                  }
                                  
                                  return available >= required ? 'text-green-600' : 'text-red-600';
                                })()
                              }`}>
                                Mevcut: <strong>{ingredient.stockItem?.currentStock || 0} {ingredient.stockItem?.unit}</strong>
                              </span>
                            </div>
                            {(function() {
                              // Basit birim çevirimi ile eksik hesaplama
                              const weightUnits = ['gram', 'kg'];
                              const volumeUnits = ['ml', 'litre'];
                              
                              let available = ingredient.stockItem?.currentStock || 0;
                              let required = ingredient.quantity;
                              let displayUnit = ingredient.unit;
                              
                              // Birim çevirimi
                              if (weightUnits.includes(ingredient.unit) && weightUnits.includes(ingredient.stockItem?.unit)) {
                                if (ingredient.stockItem?.unit === 'kg') available *= 1000;
                                if (ingredient.unit === 'kg') required *= 1000;
                                displayUnit = 'gram';
                              } else if (volumeUnits.includes(ingredient.unit) && volumeUnits.includes(ingredient.stockItem?.unit)) {
                                if (ingredient.stockItem?.unit === 'litre') available *= 1000;
                                if (ingredient.unit === 'litre') required *= 1000;
                                displayUnit = 'ml';
                              }
                              
                              const shortage = Math.max(0, required - available);
                              
                              return available < required ? (
                                <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                  {shortage} {displayUnit} eksik
                                </div>
                              ) : null;
                            })()}
                          </div>
                        ))}
                      </div>
                      
                      {/* Eski ingredients field varsa göster */}
                      {item.ingredients && item.ingredients.length > 0 && (
                        <div className="mt-3 text-sm text-gray-600">
                          <strong>Ek Bilgiler:</strong> {item.ingredients.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
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
              <button 
                onClick={() => {
                  // Basit stok girişi için - daha gelişmiş modal eklenebilir
                  alert('Yeni stok öğesi eklemek için menu yönetimi kullanın veya mevcut stokları + / - butonlarıyla güncelleyin.');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Stok Girişi Yap
              </button>
            </div>

            <div className="grid gap-6">
              {stockItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg p-6">
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
                      <span className="text-gray-600 font-medium">{item.currentStock} {item.unit}</span>
                      <button 
                        onClick={() => {
                          const quantity = prompt('Eklenecek miktar:');
                          if (quantity && !isNaN(Number(quantity))) {
                            handleStockUpdate(item._id, Number(quantity), 'in');
                          }
                        }}
                        className="bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        + Ekle
                      </button>
                      <button 
                        onClick={() => {
                          const quantity = prompt('Çıkarılacak miktar:');
                          if (quantity && !isNaN(Number(quantity))) {
                            handleStockUpdate(item._id, Number(quantity), 'out');
                          }
                        }}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        - Çıkar
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
                <button 
                  onClick={handleNewOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Yeni Sipariş
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Rapor Al
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz Sipariş Yok</h3>
                <p className="text-gray-600 mb-6">
                  Yeni sipariş oluşturmak için &ldquo;Yeni Sipariş&rdquo; butonunu kullanın.
                </p>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'pending').length}</div>
                    <div className="text-gray-600">Bekleyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'preparing').length}</div>
                    <div className="text-gray-600">Hazırlanıyor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</div>
                    <div className="text-gray-600">Tamamlanan</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          order.status === 'pending' ? 'bg-blue-500' :
                          order.status === 'preparing' ? 'bg-yellow-500' :
                          order.status === 'ready' ? 'bg-orange-500' :
                          order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Sipariş #{order.orderNumber}</h3>
                          {order.customerName && (
                            <p className="text-gray-600">Müşteri: {order.customerName}</p>
                          )}
                          {order.tableNumber && (
                            <p className="text-gray-600">Masa: {order.tableNumber}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₺{order.total}</div>
                        <div className="flex space-x-2 mt-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleOrderStatusUpdate(order._id, 'preparing')}
                              className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-200"
                            >
                              Hazırlama Başlat
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleOrderStatusUpdate(order._id, 'ready')}
                              className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm hover:bg-orange-200"
                            >
                              Hazır
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => handleOrderStatusUpdate(order._id, 'completed')}
                              className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200"
                            >
                              Teslim Et
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Sipariş İçeriği:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.menuItem?.name || 'Bilinmeyen ürün'}</span>
                            <span>₺{(item.menuItem?.price || 0) * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      {order.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Not:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Yeni Sipariş Oluştur</h3>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Menu Items */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Menü Öğeleri</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {menuItems.filter(item => item.available && item.stock > 0).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">₺{item.price}</div>
                        </div>
                        <button
                          onClick={() => addOrderItem(item._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Sipariş İçeriği</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orderItems.map((orderItem) => {
                      const menuItem = menuItems.find(item => item._id === orderItem.menuItemId);
                      return (
                        <div key={orderItem.menuItemId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{menuItem?.name}</div>
                            <div className="text-sm text-gray-500">₺{menuItem?.price}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateOrderItemQuantity(orderItem.menuItemId, orderItem.quantity - 1)}
                              className="bg-gray-200 text-gray-700 w-6 h-6 rounded text-sm hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{orderItem.quantity}</span>
                            <button
                              onClick={() => updateOrderItemQuantity(orderItem.menuItemId, orderItem.quantity + 1)}
                              className="bg-gray-200 text-gray-700 w-6 h-6 rounded text-sm hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeOrderItem(orderItem.menuItemId)}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-lg font-bold">
                      Toplam: ₺{orderItems.reduce((total, orderItem) => {
                        const menuItem = menuItems.find(item => item._id === orderItem.menuItemId);
                        return total + (menuItem?.price || 0) * orderItem.quantity;
                      }, 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Adı</label>
                  <input
                    type="text"
                    value={orderCustomerName}
                    onChange={(e) => setOrderCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müşteri adı (opsiyonel)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={orderCustomerPhone}
                    onChange={(e) => setOrderCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Telefon numarası (opsiyonel)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Masa Numarası</label>
                  <input
                    type="number"
                    value={orderTableNumber || ''}
                    onChange={(e) => setOrderTableNumber(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masa numarası (opsiyonel)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sipariş notları (opsiyonel)"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={orderItems.length === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    orderItems.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Sipariş Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Rapor İndir</h3>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Türü</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as 'sales' | 'inventory')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sales">Satış Raporu</option>
                    <option value="inventory">Envanter Raporu</option>
                  </select>
                </div>

                {reportType === 'sales' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                      <input
                        type="date"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                      <input
                        type="date"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Raporu İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 