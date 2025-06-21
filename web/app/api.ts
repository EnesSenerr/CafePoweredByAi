// Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function getUserProfile(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Points APIs
export async function earnPoints(token: string, userId: string, amount: number, description?: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/earn`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ userId, amount, description }),
  });
  return handleResponse(res);
}

export async function redeemPoints(token: string, userId: string, rewardId: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/redeem`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ userId, rewardId }),
  });
  return handleResponse(res);
}

export async function getPointHistory(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/api/points/history/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Rewards APIs
export async function getRewards() {
  const res = await fetch(`${API_BASE_URL}/api/rewards`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getReward(rewardId: string) {
  const res = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Admin APIs
export async function createReward(token: string, rewardData: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/rewards`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(rewardData),
  });
  return handleResponse(res);
}

export async function updateReward(token: string, rewardId: string, rewardData: any) {
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