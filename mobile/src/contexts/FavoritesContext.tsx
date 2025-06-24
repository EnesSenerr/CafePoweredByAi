import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/api';
import { Alert } from 'react-native';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Favorileri yükle
  const loadFavorites = async () => {
    if (!token || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await getFavorites(token);
      // API'den gelen favori item ID'lerini array olarak ayarla
      const favoriteIds = response.data?.map((item: any) => item.menuItemId || item.id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Favoriler yüklenemedi:', error);
      // Hata durumunda sessizce devam et
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Auth durumu değiştiğinde favorileri yükle
  useEffect(() => {
    if (isAuthenticated && token) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [token, isAuthenticated]);

  // Favorileri yenile
  const refreshFavorites = async () => {
    await loadFavorites();
  };

  // Bir item'ın favori olup olmadığını kontrol et
  const isFavorite = (itemId: string): boolean => {
    return favorites.includes(itemId);
  };

  // Favori durumunu değiştir
  const toggleFavorite = async (itemId: string): Promise<void> => {
    if (!token || !isAuthenticated) {
      Alert.alert('Hata', 'Favori eklemek için giriş yapmalısınız');
      return;
    }

    try {
      setLoading(true);
      
      if (isFavorite(itemId)) {
        // Favorilerden çıkar
        await removeFromFavorites(token, itemId);
        setFavorites(prev => prev.filter(id => id !== itemId));
        Alert.alert('Başarılı', 'Favorilerden çıkarıldı');
      } else {
        // Favorilere ekle
        await addToFavorites(token, itemId);
        setFavorites(prev => [...prev, itemId]);
        Alert.alert('Başarılı', 'Favorilere eklendi');
      }
    } catch (error: any) {
      console.error('Favori işlemi hatası:', error);
      Alert.alert('Hata', error.message || 'Favori işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 