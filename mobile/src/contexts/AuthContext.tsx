import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthTokenManager, AuthHelpers } from '../services/auth';
import { getUserProfile } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
  points?: number;
  phone?: string;
  birthDate?: string;
  profileImage?: string;
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (userData: User, token: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      const authToken = await AuthTokenManager.getToken();
      
      if (!authToken || !AuthTokenManager.isTokenValid(authToken)) {
        // Token yok veya geçersiz
        await AuthTokenManager.removeToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      setToken(authToken);

      // Kullanıcı profilini API'den al
      try {
        const profileData = await getUserProfile(authToken);
        setUser(profileData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Profil alınırken hata:', error);
        // API hatası varsa token'ı temizle
        await AuthTokenManager.removeToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth kontrolü başarısız:', error);
      await AuthTokenManager.removeToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const authToken = token || (await AuthTokenManager.getToken());
    if (!authToken) return;

    try {
      const profileData = await getUserProfile(authToken);
      setUser(profileData.user);
    } catch (error) {
      console.error('Kullanıcı bilgileri yenilenemedi:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logout process started');
      await AuthTokenManager.removeToken();
      console.log('[AuthContext] Token removed successfully');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('[AuthContext] Auth state cleared successfully');
    } catch (error) {
      console.error('[AuthContext] Çıkış yapılırken hata:', error);
      // Hata olsa bile state'i temizle
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  const login = async (userData: User, authToken: string) => {
    try {
      console.log('[AuthContext] Login function called with:', { 
        userData: { ...userData, email: userData.email }, 
        tokenLength: authToken?.length 
      });
      
      await AuthTokenManager.setToken(authToken);
      console.log('[AuthContext] Token saved successfully');
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('[AuthContext] Login state updated successfully');
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    setUser,
    logout,
    refreshAuth,
    refreshUser,
    login,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth sadece AuthProvider içinde kullanılabilir');
  }
  return context;
}

export { AuthContext }; 