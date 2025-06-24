// Base URL - Next.js proxy kullanacağız
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
export async function loginUser(email: string, password: string, rememberMe?: boolean) {
  // Debug için direkt backend'e bağlan
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/login' 
    : `${API_BASE_URL}/api/auth/login`;
    
  console.log('Login API URL:', url);
  console.log('Login data:', { email, password });
  
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password, rememberMe }),
  });
  
  console.log('Login response status:', res.status);
  const data = await handleResponse(res);
  console.log('Login response data:', data);
  return data;
}

export async function registerUser(name: string, email: string, password: string, phone?: string, rememberMe?: boolean) {
  // Debug için direkt backend'e bağlan
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/register' 
    : `${API_BASE_URL}/api/auth/register`;
    
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, email, password, phone, rememberMe }),
  });
  return handleResponse(res);
}

export async function getUserProfile(token: string) {
  // Debug için direkt backend'e bağlan
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/me' 
    : `${API_BASE_URL}/api/auth/me`;
    
  console.log('API URL:', url);
  console.log('Token:', token);
  
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  
  const data = await handleResponse(res);
  console.log('getUserProfile response:', data);
  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

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
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/update-profile' 
    : `${API_BASE_URL}/api/auth/update-profile`;
    
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
}

export async function uploadProfileImage(token: string, imageFile: File) {
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/upload-profile-image' 
    : `${API_BASE_URL}/api/auth/upload-profile-image`;
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse(res);
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/change-password' 
    : `${API_BASE_URL}/api/auth/change-password`;
    
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
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
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/points/redeem' 
    : `${API_BASE_URL}/api/points/redeem`;

  const res = await fetch(url, {
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

// Rewards APIs
export async function getRewards() {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/rewards' 
    : `${API_BASE_URL}/api/rewards`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getReward(rewardId: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/rewards/${rewardId}` 
    : `${API_BASE_URL}/api/rewards/${rewardId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Admin APIs
export async function createReward(token: string, rewardData: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(rewardData),
  });
  return handleResponse(res);
}

export async function updateReward(token: string, rewardId: string, rewardData: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards/${rewardId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(rewardData),
  });
  return handleResponse(res);
}

export async function deleteReward(token: string, rewardId: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards/${rewardId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getAdminRewards(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Menu APIs
export async function getMenuItems(filters: { category?: string; available?: boolean; search?: string } = {}) {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.available !== undefined) queryParams.append('available', filters.available.toString());
  if (filters.search) queryParams.append('search', filters.search);

  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu${queryParams.toString() ? '?' + queryParams.toString() : ''}` 
    : `${API_BASE_URL}/api/menu${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getMenuItem(id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu/${id}` 
    : `${API_BASE_URL}/api/menu/${id}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createMenuItem(token: string, menuItemData: Record<string, unknown>) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/menu' 
    : `${API_BASE_URL}/api/menu`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(menuItemData),
  });
  return handleResponse(res);
}

export async function updateMenuItem(token: string, id: string, menuItemData: Record<string, unknown>) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu/${id}` 
    : `${API_BASE_URL}/api/menu/${id}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(menuItemData),
  });
  return handleResponse(res);
}

export async function deleteMenuItem(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu/${id}` 
    : `${API_BASE_URL}/api/menu/${id}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function toggleMenuItemAvailability(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu/${id}/toggle` 
    : `${API_BASE_URL}/api/menu/${id}/toggle`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function updateMenuItemStock(token: string, id: string, stock: number) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/menu/${id}/stock` 
    : `${API_BASE_URL}/api/menu/${id}/stock`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ stock }),
  });
  return handleResponse(res);
}

export async function getMenuCategories() {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/menu/categories' 
    : `${API_BASE_URL}/api/menu/categories`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// User Management APIs (Admin only)
export async function getUsers(token: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/admin/users' 
    : `${API_BASE_URL}/api/auth/admin/users`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function createUser(token: string, userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  points?: number;
}) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/auth/admin/users' 
    : `${API_BASE_URL}/api/auth/admin/users`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function updateUser(token: string, id: string, userData: {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  points?: number;
  isActive?: boolean;
  password?: string;
}) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/auth/admin/users/${id}` 
    : `${API_BASE_URL}/api/auth/admin/users/${id}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function deleteUser(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/auth/admin/users/${id}` 
    : `${API_BASE_URL}/api/auth/admin/users/${id}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function toggleUserStatus(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/auth/admin/users/${id}/toggle` 
    : `${API_BASE_URL}/api/auth/admin/users/${id}/toggle`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Order APIs
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
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/orders' 
    : `${API_BASE_URL}/api/orders`;

  const res = await fetch(url, {
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

  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}` 
    : `${API_BASE_URL}/api/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(token: string, orderId: string, status: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/orders/${orderId}/status` 
    : `${API_BASE_URL}/api/orders/${orderId}/status`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

// Report APIs
export async function getSalesReport(token: string, filters: {
  startDate?: string;
  endDate?: string;
  type?: 'daily' | 'weekly' | 'monthly' | 'custom';
} = {}) {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.type) queryParams.append('type', filters.type);

  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/reports/sales${queryParams.toString() ? '?' + queryParams.toString() : ''}` 
    : `${API_BASE_URL}/api/reports/sales${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getInventoryReport(token: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/reports/inventory' 
    : `${API_BASE_URL}/api/reports/inventory`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function downloadReport(token: string, reportType: string, filters: Record<string, unknown> = {}) {
  const queryParams = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) queryParams.append(key, String(filters[key]));
  });

  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/reports/${reportType}/download${queryParams.toString() ? '?' + queryParams.toString() : ''}` 
    : `${API_BASE_URL}/api/reports/${reportType}/download${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    throw new Error('Rapor indirilemedi');
  }

  return res.blob();
}

// Stock APIs
export async function getStockItems(token: string, filters: { 
  category?: string; 
  status?: string; 
  search?: string;
  limit?: number;
  skip?: number;
} = {}) {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.skip) queryParams.append('skip', filters.skip.toString());

  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/stock${queryParams.toString() ? '?' + queryParams.toString() : ''}` 
    : `${API_BASE_URL}/api/stock${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getStockItem(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/stock/${id}` 
    : `${API_BASE_URL}/api/stock/${id}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function createStockItem(token: string, stockData: {
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price?: number;
  supplier?: string;
  description?: string;
}) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/stock' 
    : `${API_BASE_URL}/api/stock`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(stockData),
  });
  return handleResponse(res);
}

export async function updateStockItem(token: string, id: string, stockData: {
  name?: string;
  category?: string;
  currentStock?: number;
  minStock?: number;
  unit?: string;
  price?: number;
  supplier?: string;
  description?: string;
}) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/stock/${id}` 
    : `${API_BASE_URL}/api/stock/${id}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(stockData),
  });
  return handleResponse(res);
}

export async function updateStock(token: string, id: string, stockUpdate: {
  quantity: number;
  type: 'in' | 'out';
  notes?: string;
}) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/stock/${id}/update` 
    : `${API_BASE_URL}/api/stock/${id}/update`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(stockUpdate),
  });
  return handleResponse(res);
}

export async function deleteStockItem(token: string, id: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? `http://localhost:5000/api/stock/${id}` 
    : `${API_BASE_URL}/api/stock/${id}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getCriticalStock(token: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/stock/critical' 
    : `${API_BASE_URL}/api/stock/critical`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function getStockCategories(token: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/stock/categories' 
    : `${API_BASE_URL}/api/stock/categories`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function checkMenuAvailability(token: string) {
  const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/stock/menu-availability' 
    : `${API_BASE_URL}/api/stock/menu-availability`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
} 