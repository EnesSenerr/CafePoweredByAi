// Base URL - Platform bazlı IP seçimi
import { Platform } from 'react-native';
import { cacheService, CACHE_KEYS } from './cacheService';

// Geliştirme ortamı için farklı IP'ler
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Expo Go fiziksel cihazlar için local network IP kullan
    // Emülatör için 10.0.2.2, Expo Go için local network IP
    const localNetworkIP = 'http://10.196.3.101:5000'; // Fiziksel cihazlar ve Expo Go
    
    console.log(`Platform: ${Platform.OS}, API URL: ${localNetworkIP}`);
    console.log('Expo Go kullanıyorsanız local network IP kullanılıyor');
    return localNetworkIP;
  }
  return 'https://your-production-api.com'; // Production URL
};

const API_BASE_URL = getApiBaseUrl();

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
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
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