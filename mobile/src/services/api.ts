// Base URL - Platform bazlı IP seçimi
import { Platform } from 'react-native';

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
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
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