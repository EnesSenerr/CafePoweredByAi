import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

interface FavoriteItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

const FavoritesScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Geçici dummy data - gerçek implementasyonda API'den gelecek
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // TODO: Gerçek API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      // Dummy data
      const dummyFavorites: FavoriteItem[] = [
        {
          id: '1',
          name: 'Türk Kahvesi',
          description: 'Geleneksel Türk kahvesi, orta şekerli',
          price: 25,
          category: 'Sıcak İçecekler',
          available: true,
        },
        {
          id: '2',
          name: 'Cappuccino',
          description: 'Kremsi süt köpüğü ile servis edilen espresso',
          price: 35,
          category: 'Espresso Bazlı',
          available: true,
        },
      ];
      
      setFavorites(dummyFavorites);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
      Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = (itemId: string) => {
    Alert.alert(
      'Favorilerden Çıkar',
      'Bu ürünü favorilerden çıkarmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== itemId));
            Alert.alert('Başarılı', 'Ürün favorilerden çıkarıldı');
          },
        },
      ]
    );
  };

  const handleItemPress = (item: FavoriteItem) => {
    navigation.navigate('MenuDetail', { itemId: item.id });
  };

  const formatPrice = (price: number) => {
    return `${price} ₺`;
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.favoriteImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.favoriteImage} />
        ) : (
          <View style={styles.favoriteImagePlaceholder}>
            <Text style={styles.favoriteImagePlaceholderText}>🍽️</Text>
          </View>
        )}
      </View>
      
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromFavorites(item.id)}
          >
            <Text style={styles.removeButtonText}>❤️</Text>
          </TouchableOpacity>
        </View>
        
        {item.description && (
          <Text style={styles.favoriteDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.favoriteFooter}>
          <Text style={styles.favoritePrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.favoriteCategory}>{item.category}</Text>
        </View>
        
        {!item.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Stokta Yok</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Favoriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} favori ürün
        </Text>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.favoritesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>Henüz favori ürününüz yok</Text>
            <Text style={styles.emptySubtitle}>
              Menüden beğendiğiniz ürünleri favorilere ekleyin
            </Text>
            <TouchableOpacity
              style={styles.browseMenuButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.browseMenuText}>🍽️ Menüyü Görüntüle</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={loading}
        onRefresh={loadFavorites}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  favoritesList: {
    padding: 20,
    paddingBottom: 40,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  favoriteImageContainer: {
    width: 100,
    height: 100,
  },
  favoriteImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteImagePlaceholderText: {
    fontSize: 32,
  },
  favoriteContent: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 20,
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoritePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f97316',
  },
  favoriteCategory: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseMenuButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseMenuText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen; 