'use client';

import { useState } from 'react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: 'completed' | 'preparing' | 'cancelled' | 'pending';
  total: number;
  items: OrderItem[];
  orderNumber: string;
  paymentMethod: string;
  deliveryType: 'pickup' | 'delivery';
  estimatedTime?: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  
  const [orders] = useState<Order[]>([
    {
      id: 1,
      date: '2024-01-15T10:30:00',
      status: 'preparing',
      total: 87,
      orderNumber: 'ORD-2024-001',
      paymentMethod: 'Kredi Kartı',
      deliveryType: 'pickup',
      estimatedTime: '15 dk',
      items: [
        { id: 1, name: 'Cappuccino', quantity: 2, price: 25 },
        { id: 2, name: 'Tiramisu', quantity: 1, price: 35 },
        { id: 3, name: 'Avokado Toast', quantity: 1, price: 28 }
      ]
    },
    {
      id: 2,
      date: '2024-01-14T14:20:00',
      status: 'completed',
      total: 45,
      orderNumber: 'ORD-2024-002',
      paymentMethod: 'Nakit',
      deliveryType: 'delivery',
      items: [
        { id: 4, name: 'Latte', quantity: 1, price: 23 },
        { id: 5, name: 'Croissant', quantity: 1, price: 22 }
      ]
    },
    {
      id: 3,
      date: '2024-01-13T09:15:00',
      status: 'completed',
      total: 156,
      orderNumber: 'ORD-2024-003',
      paymentMethod: 'Kredi Kartı',
      deliveryType: 'pickup',
      items: [
        { id: 6, name: 'Americano', quantity: 3, price: 20 },
        { id: 7, name: 'Cheesecake', quantity: 2, price: 32 },
        { id: 8, name: 'Bagel', quantity: 2, price: 16 }
      ]
    },
    {
      id: 4,
      date: '2024-01-12T16:45:00',
      status: 'cancelled',
      total: 35,
      orderNumber: 'ORD-2024-004',
      paymentMethod: 'Kredi Kartı',
      deliveryType: 'delivery',
      items: [
        { id: 9, name: 'Cold Brew', quantity: 1, price: 22 },
        { id: 10, name: 'Muffin', quantity: 1, price: 18 }
      ]
    }
  ]);

  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case 'active':
        return ['preparing', 'pending'].includes(order.status);
      case 'completed':
        return order.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'preparing':
        return '👨‍🍳';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'preparing':
        return 'Hazırlanıyor';
      case 'pending':
        return 'Bekliyor';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeOrdersCount = orders.filter(order => ['preparing', 'pending'].includes(order.status)).length;
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;
  const totalSpent = orders.filter(order => order.status === 'completed').reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-2xl mr-2">📋</span>
              <span className="text-sm font-medium">Sipariş Takibi</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              Siparişlerim
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Tüm siparişlerinizi takip edin, sipariş geçmişinizi inceleyin ve favori ürünlerinizi yeniden sipariş edin
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">⚡</span>
                <span className="text-lg">Hızlı Takip</span>
              </div>
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-3">📊</span>
                <span className="text-lg">Detaylı Geçmiş</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  📋
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</div>
                <div className="text-gray-600">Toplam Sipariş</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🔄
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{activeOrdersCount}</div>
                <div className="text-gray-600">Aktif Sipariş</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ✅
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{completedOrdersCount}</div>
                <div className="text-gray-600">Tamamlanan</div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  💰
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₺{totalSpent}</div>
                <div className="text-gray-600">Toplam Harcama</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
              {[
                { key: 'all', label: 'Tümü', count: orders.length, icon: '📋' },
                { key: 'active', label: 'Aktif', count: activeOrdersCount, icon: '🔄' },
                { key: 'completed', label: 'Tamamlanan', count: completedOrdersCount, icon: '✅' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6">
                    😔
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Bu kategoride sipariş bulunamadı
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Seçtiğiniz filtreye uygun sipariş bulunmuyor. Yeni sipariş vermek için menümüzü inceleyin.
                  </p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🍽️ Sipariş Ver
                  </button>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">#{order.orderNumber}</h3>
                          <p className="text-gray-600">{formatDate(order.date)}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            {order.estimatedTime && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                ⏱️ {order.estimatedTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">₺{order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          {order.paymentMethod} • {order.deliveryType === 'pickup' ? 'Gel Al' : 'Teslimat'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Sipariş Detayları</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.quantity} adet × ₺{item.price}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-gray-900">
                                  ₺{(item.quantity * item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <div className="flex flex-wrap gap-3">
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                          🔄 Tekrar Sipariş Ver
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                          📄 Detayları Görüntüle
                        </button>
                        {order.status === 'completed' && (
                          <button className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-xl hover:bg-yellow-200 transition-colors duration-200">
                            ⭐ Değerlendir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 