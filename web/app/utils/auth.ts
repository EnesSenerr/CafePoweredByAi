// JWT Token Management
export const AuthTokenManager = {
  // Token'ı localStorage'a kaydet
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      // AuthContext'e auth değişikliğini bildir
      window.dispatchEvent(new CustomEvent('authChanged'));
    }
  },

  // Token'ı localStorage'dan al
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  // Token'ı localStorage'dan sil
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      // AuthContext'e auth değişikliğini bildir
      window.dispatchEvent(new CustomEvent('authChanged'));
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
    } catch {
      return false;
    }
  },

  // Token'dan kullanıcı bilgilerini al
  getUserFromToken: (token: string | null): { id: string; email: string; role: string } | null => {
    if (!token || !AuthTokenManager.isTokenValid(token)) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role
      };
    } catch {
      return null;
    }
  }
};

// Auth durumu için helper fonksiyonlar
export const AuthHelpers = {
  // Kullanıcı giriş yapmış mı?
  isAuthenticated: (): boolean => {
    const token = AuthTokenManager.getToken();
    return AuthTokenManager.isTokenValid(token);
  },

  // Mevcut kullanıcı bilgilerini al
  getCurrentUser: () => {
    const token = AuthTokenManager.getToken();
    return AuthTokenManager.getUserFromToken(token);
  },

  // Kullanıcı admin mi?
  isAdmin: (): boolean => {
    const user = AuthHelpers.getCurrentUser();
    return user?.role === 'admin';
  },

  // Çıkış yap
  logout: () => {
    AuthTokenManager.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
}; 