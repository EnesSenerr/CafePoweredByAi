import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, token } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Auth durumu kontrol edilene kadar bekle
    if (!isLoading) {
      setInitializing(false);
    }
  }, [isLoading]);

  // İlk yükleme sırasında loading göster
  if (initializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  // Auth kontrolü
  if (!isAuthenticated || !token) {
    // Fallback component varsa onu göster, yoksa boş view
    return fallback ? <>{fallback}</> : <View />;
  }

  // Auth başarılı, children'ı render et
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default AuthGuard; 