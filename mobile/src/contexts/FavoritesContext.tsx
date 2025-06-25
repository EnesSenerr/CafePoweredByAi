import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/api';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { token, isAuthenticated, user } = useAuth();

  // Favorileri yükle (localStorage'dan)
  const loadFavorites = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      console.log('[Favorites] Loading from localStorage...');
      const userId = user?.id || 'guest';
      const storageKey = `favorites_${userId}`;
      const storedFavorites = await AsyncStorage.getItem(storageKey);
      
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        setFavorites(favoriteIds);
        console.log('[Favorites] Loaded from localStorage:', favoriteIds);
      } else {
        setFavorites([]);
        console.log('[Favorites] No stored favorites found');
      }
      
      // TODO: Backend endpoint hazır olduğunda aktif edilecek
      // const response = await getFavorites(token);
      // const favoriteIds = response.data?.map((item: any) => item.menuItemId || item.id) || [];
      // setFavorites(favoriteIds);
    } catch (error) {
      console.error('Favorites load error:', error);
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

  // Favorileri localStorage'a kaydet
  const saveFavoritesToStorage = async (favoriteIds: string[]) => {
    try {
      const userId = user?.id || 'guest';
      const storageKey = `favorites_${userId}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(favoriteIds));
      console.log('[Favorites] Saved to localStorage:', favoriteIds);
    } catch (error) {
      console.error('Favorites save error:', error);
    }
  };

  // Favori durumunu değiştir (localStorage ile)
  const toggleFavorite = async (itemId: string): Promise<void> => {
    if (!isAuthenticated) {
      Alert.alert('Hata', 'Favori eklemek için giriş yapmalısınız');
      return;
    }

    try {
      setLoading(true);
      
      let newFavorites: string[];
      
      if (isFavorite(itemId)) {
        // Favorilerden çıkar
        newFavorites = favorites.filter(id => id !== itemId);
        setFavorites(newFavorites);
        await saveFavoritesToStorage(newFavorites);
        Alert.alert('Başarılı', 'Favorilerden çıkarıldı');
      } else {
        // Favorilere ekle
        newFavorites = [...favorites, itemId];
        setFavorites(newFavorites);
        await saveFavoritesToStorage(newFavorites);
        Alert.alert('Başarılı', 'Favorilere eklendi');
      }
      
      // TODO: Backend endpoint hazır olduğunda aktif edilecek
      // if (isFavorite(itemId)) {
      //   await removeFromFavorites(token, itemId);
      // } else {
      //   await addToFavorites(token, itemId);
      // }
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