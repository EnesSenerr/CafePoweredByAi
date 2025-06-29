import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { BackgroundCacheManager } from './src/utils/cacheInvalidation';
import { MemoryManager } from './src/utils/performance';
import { requestAndroidPermissions } from './src/components/PlatformSpecific';

export default function App() {
  useEffect(() => {
    // Initialize platform-specific features
    const initializePlatform = async () => {
      // Request Android permissions if needed
      await requestAndroidPermissions();
      
      // Start background cache management
      BackgroundCacheManager.start();
    };

    initializePlatform();

    // App state change handler
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        // App going to background - cleanup
        MemoryManager.cleanup();
      } else if (nextAppState === 'active') {
        // App coming to foreground - restart cache management
        BackgroundCacheManager.start();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup on unmount
    return () => {
      BackgroundCacheManager.stop();
      MemoryManager.cleanup();
      subscription?.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
