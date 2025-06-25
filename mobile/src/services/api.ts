// Base URL - Environment konfigürasyonunu kullan
import { Platform } from 'react-native';
import { cacheService, CACHE_KEYS } from './cacheService';
import { CONFIG } from '../config/environment';

const API_BASE_URL = CONFIG.API_BASE_URL;

console.log(`[API] Platform: ${Platform.OS}, API URL: ${API_BASE_URL}`);
console.log('[API] Environment config loaded successfully');

// Helper function to get auth headers
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || 'API Hatası');
  }
  return response.json();
}

// Auth APIs
export async function loginUser(email: string, password: string, rememberMe: boolean = false) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password, rememberMe }),
  });
  return handleResponse(res);
}

export async function registerUser(name: string, email: string, password: string, phone?: string) {
  try {
    console.log('Kayıt isteği gönderiliyor:', `${API_BASE_URL}/api/auth/register`);
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password, phone, signupMethod: 'mobile' }),
    });
    console.log('Kayıt cevabı alındı:', res.status);
    return handleResponse(res);
  } catch (error) {
    console.error('Kayıt hatası:', error);
    throw error;
  }
}

export async function getUserProfile(token: string) {
  const cacheKey = CACHE_KEYS.USER_PROFILE;
  const ttl = 30 * 60 * 1000; // 30 minutes for user profile
  
  return cacheService.cachedRequest(
    cacheKey,
    async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      return handleResponse(res);
    },
    ttl
  );
}

// Points APIs
export async function earnPoints(token: string, amount: number, description?: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/earn`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ amount, description }),
  });
  return handleResponse(res);
}

export async function redeemPoints(token: string, rewardId: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/redeem`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ rewardId }),
  });
  return handleResponse(res);
}

export async function getPointHistory(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/history`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Rewards APIs with caching
export async function getRewards() {
  const cacheKey = CACHE_KEYS.REWARDS;
  const ttl = 15 * 60 * 1000; // 15 minutes for rewards
  
  return cacheService.cachedRequest(
    cacheKey,
    async () => {
      const res = await fetch(`${API_BASE_URL}/api/rewards`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    ttl
  );
}

export async function getReward(rewardId: string) {
  const res = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Forgot Password API
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// Reset Password API
export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
}

// Profile APIs
export async function updateProfile(token: string, profileData: {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  preferences?: {
    newsletter?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  };
}) {
  const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
}

export async function uploadProfileImage(token: string, imageFile: File | any) {
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE_URL}/api/auth/upload-profile-image`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse(res);
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

// Menu APIs with caching
export async function getMenuItems(filters: { category?: string; available?: boolean; search?: string } = {}) {
  const cacheKey = CACHE_KEYS.MENU_ITEMS;
  const ttl = 10 * 60 * 1000; // 10 minutes for menu items
  
  return cacheService.cachedRequest(
    cacheKey,
    async () => {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.available !== undefined) queryParams.append('available', filters.available.toString());
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/menu${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    ttl,
    filters
  );
}

export async function getMenuItem(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getMenuCategories() {
  const cacheKey = 'menu_categories';
  const ttl = 30 * 60 * 1000; // 30 minutes for categories
  
  return cacheService.cachedRequest(
    cacheKey,
    async () => {
      const res = await fetch(`${API_BASE_URL}/api/menu/categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    ttl
  );
}

// Orders APIs
export async function createOrder(token: string, orderData: {
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
  }>;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: number;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
}

export async function getOrders(token: string, filters: { 
  status?: string; 
  startDate?: string; 
  endDate?: string;
  limit?: number;
  skip?: number;
} = {}) {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.skip) queryParams.append('skip', filters.skip.toString());
  
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/orders${queryString ? `?${queryString}` : ''}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Favorites API calls
export const getFavorites = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Favoriler yüklenemedi');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Get favorites hatası:', error);
    throw error;
  }
};

export const addToFavorites = async (token: string, menuItemId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menuItemId }),
    });

    if (!response.ok) {
      throw new Error('Favorilere eklenemedi');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Add to favorites hatası:', error);
    throw error;
  }
};

export const removeFromFavorites = async (token: string, menuItemId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${menuItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Favorilerden çıkarılamadı');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Remove from favorites hatası:', error);
    throw error;
  }
};

// --- ADMIN PANEL API'LERİ ---

// 1. Admin Dashboard İstatistikleri
export async function getAdminDashboardStats(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/stats`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    const data = await handleResponse(res);
    console.log('[DASHBOARD API]', data); // API yanıtını logla
    return data;
  } catch (err) {
    console.error('[DASHBOARD API ERROR]', err);
    throw err;
  }
}

// 2. Kullanıcı Listesi (Admin)
export async function getAllUsers(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin/users`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// 3. Sipariş Listesi (Admin)
export async function getAllOrders(token: string, filters: any = {}) {
  // getOrders fonksiyonu zaten var ama burada admin için kullanıyoruz
  return getOrders(token, filters);
}

// 4. Menü Listesi (Admin)
export async function getAllMenuItems(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/menu`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// 5. Stok Listesi (Admin)
export async function getAllStockItems(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/stock`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// 6. Ödül Listesi (Admin)
export async function getAllRewards(token: string) {
  // src/routes/admin.routes.js -> /api/admin/rewards
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Kullanıcıyı aktif/pasif yap (Admin)
export async function toggleUserStatus(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin/users/${userId}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Kullanıcıyı sil (Admin)
export async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Sipariş durumu güncelle (Admin)
export async function updateOrderStatus(token: string, orderId: string, newStatus: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status: newStatus }),
  });
  return handleResponse(res);
}

// Sipariş sil (Admin)
export async function deleteOrder(token: string, orderId: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Menü Yönetimi (CRUD) Fonksiyonları
export async function createMenuItem(token: string, itemData: any) {
  const res = await fetch(`${API_BASE_URL}/api/menu`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  });
  return handleResponse(res);
}

export async function updateMenuItem(token: string, menuItemId: string, itemData: any) {
  const res = await fetch(`${API_BASE_URL}/api/menu/${menuItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  });
  return handleResponse(res);
}

export async function deleteMenuItem(token: string, menuItemId: string) {
  const res = await fetch(`${API_BASE_URL}/api/menu/${menuItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function toggleMenuItemAvailability(token: string, menuItemId: string) {
  const res = await fetch(`${API_BASE_URL}/api/menu/${menuItemId}/toggle-availability`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Stok Yönetimi (CRUD) Fonksiyonları
export async function createStockItem(token: string, itemData: any) {
  const res = await fetch(`${API_BASE_URL}/api/stock`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  });
  return handleResponse(res);
}

export async function updateStockItem(token: string, stockItemId: string, itemData: any) {
  const res = await fetch(`${API_BASE_URL}/api/stock/${stockItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  });
  return handleResponse(res);
}

export async function updateStock(token: string, stockItemId: string, updateData: any) {
  const res = await fetch(`${API_BASE_URL}/api/stock/${stockItemId}/update`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData),
  });
  return handleResponse(res);
}

export async function deleteStockItem(token: string, stockItemId: string) {
  const res = await fetch(`${API_BASE_URL}/api/stock/${stockItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getCriticalStock(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/stock/critical`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Raporlama Fonksiyonları
export async function getSalesReport(token: string, filters: { startDate?: string; endDate?: string } = {}) {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/reports/sales${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getInventoryReport(token: string, filters: { startDate?: string; endDate?: string } = {}) {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/reports/inventory${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function downloadReport(token: string, type: 'sales' | 'inventory', filters: { startDate?: string; endDate?: string } = {}) {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/reports/${type}/download${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Rapor indirilemedi');
  return res.blob();
} 