import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

// JWT Token Management
export const AuthTokenManager = {
  // Token'ı AsyncStorage'a kaydet
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Token kaydedilirken hata:', error);
      throw error;
    }
  },

  // Token'ı AsyncStorage'dan al
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Token alınırken hata:', error);
      return null;
    }
  },

  // Token'ı AsyncStorage'dan sil
  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Token silinirken hata:', error);
      throw error;
    }
  },

  // Token'ın geçerli olup olmadığını kontrol et
  isTokenValid: (token: string | null): boolean => {
    if (!token) return false;
    
    try {
      // JWT payload'ını decode et (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Token süresi dolmuş mu?
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Token'dan kullanıcı bilgilerini al
  getUserFromToken: (token: string | null): any | null => {
    if (!token || !AuthTokenManager.isTokenValid(token)) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }
};

// Auth durumu için helper fonksiyonlar
export const AuthHelpers = {
  // Kullanıcı giriş yapmış mı?
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AuthTokenManager.getToken();
    return AuthTokenManager.isTokenValid(token);
  },

  // Mevcut kullanıcı bilgilerini al
  getCurrentUser: async () => {
    const token = await AuthTokenManager.getToken();
    return AuthTokenManager.getUserFromToken(token);
  },

  // Kullanıcı admin mi?
  isAdmin: async (): Promise<boolean> => {
    const user = await AuthHelpers.getCurrentUser();
    return user?.role === 'admin';
  },

  // Çıkış yap
  logout: async (): Promise<void> => {
    await AuthTokenManager.removeToken();
  }
}; 