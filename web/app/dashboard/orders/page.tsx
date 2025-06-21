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
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Siparişlerim</h1>
          <p className="text-coffee-100 text-lg">Sipariş geçmişiniz ve aktif siparişleriniz</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-coffee-600 mb-2">{orders.length}</div>
            <div className="text-gray-600">Toplam Sipariş</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{activeOrdersCount}</div>
            <div className="text-gray-600">Aktif Sipariş</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedOrdersCount}</div>
            <div className="text-gray-600">Tamamlanan</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-coffee-600 mb-2">₺{totalSpent}</div>
            <div className="text-gray-600">Toplam Harcama</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg w-fit">
            {[
              { key: 'all', label: 'Tümü', count: orders.length },
              { key: 'active', label: 'Aktif', count: activeOrdersCount },
              { key: 'completed', label: 'Tamamlanan', count: completedOrdersCount }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-coffee-600 text-white'
                    : 'text-coffee-600 hover:bg-coffee-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === tab.key ? 'bg-coffee-500' : 'bg-coffee-100'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.estimatedTime && order.status === 'preparing' && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {order.estimatedTime} kaldı
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-coffee-600">₺{order.total}</div>
                        <div className="text-sm text-gray-600">{order.paymentMethod}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {order.deliveryType === 'pickup' ? '🏪 Gel Al' : '🚚 Teslimat'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center text-coffee-600 font-bold">
                            {item.quantity}x
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Birim fiyat: ₺{item.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">₺{item.quantity * item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
                    <div className="flex space-x-2">
                      {order.status === 'preparing' && (
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                          Siparişi İptal Et
                        </button>
                      )}
                      <button className="border border-coffee-600 text-coffee-600 px-4 py-2 rounded-lg hover:bg-coffee-50 transition-colors duration-200">
                        Detayları Görüntüle
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {order.status === 'completed' && (
                        <>
                          <button className="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors duration-200">
                            Tekrar Sipariş Ver
                          </button>
                          <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            Değerlendir
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'active' ? 'Aktif siparişiniz yok' : 
               activeTab === 'completed' ? 'Tamamlanan siparişiniz yok' : 
               'Henüz siparişiniz yok'}
            </h3>
            <p className="text-gray-600 mb-8">
              {activeTab === 'active' ? 'Şu anda hazırlanan siparişiniz bulunmuyor' :
               activeTab === 'completed' ? 'Henüz tamamlanan siparişiniz bulunmuyor' :
               'İlk siparişinizi vererek başlayın'}
            </p>
            <button className="bg-coffee-600 text-white px-6 py-3 rounded-lg hover:bg-coffee-700 transition-colors duration-200">
              Sipariş Ver
            </button>
          </div>
        )}

        {/* Quick Actions */}
        {orders.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left">
                <div className="w-12 h-12 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  🔄
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Son Siparişi Tekrarla</h3>
                <p className="text-gray-600 text-sm">En son verdiğiniz siparişi tekrar verin</p>
              </button>

              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  ⭐
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Favori Siparişim</h3>
                <p className="text-gray-600 text-sm">En çok sipariş ettiğiniz ürünler</p>
              </button>

              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  📊
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Sipariş İstatistikleri</h3>
                <p className="text-gray-600 text-sm">Detaylı sipariş analizleriniz</p>
              </button>

              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  🎁
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Hediye Gönder</h3>
                <p className="text-gray-600 text-sm">Sevdiklerinize kahve hediye edin</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 