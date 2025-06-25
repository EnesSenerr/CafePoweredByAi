import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../navigation/AppNavigator';
import { getMenuItems, getMenuCategories } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

type Props = BottomTabScreenProps<TabParamList, 'Menu'>;

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular?: boolean;
  available: boolean;
  stock: number;
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  preparationTime?: number;
}

// Varsayılan menü resimleri - Web ile aynı
const getDefaultImage = (category: string, name: string) => {
  const images = {
    'Kahve': [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ],
    'Espresso': [
      'https://images.unsplash.com/photo-1510707577035-a116dda6b2b1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519082274554-1ca37fb8abb7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop'
    ],
    'Latte': [
      'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
    ],
    'Çay': [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop'
    ],
    'Soğuk İçecekler': [
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502462041640-173d867996a2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
    ],
    'Tatlılar': [
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    ],
    'Atıştırmalıklar': [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
    ]
  };
  
  const categoryImages = images[category as keyof typeof images] || images['Kahve'];
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return categoryImages[hash % categoryImages.length];
};

const MenuScreen = ({ navigation }: Props) => {
  const parentNavigation = useNavigation<any>();
  const { state } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [categories, setCategories] = useState<string[]>(['Tümü']);

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchQuery, selectedCategory]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems({ available: true });
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Menu items yüklenirken hata:', error);
      Alert.alert('Hata', 'Menü yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getMenuCategories();
      const apiCategories = response.data || [];
      setCategories(['Tümü', ...apiCategories]);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const filterItems = () => {
    const filtered = selectedCategory === 'Tümü' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory);

    if (searchQuery.trim()) {
      const searchFiltered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(searchFiltered);
    } else {
      setFilteredItems(filtered);
    }
  };

  const formatPrice = (price: number) => {
    return `${price} ₺`;
  };

  const handleItemPress = (item: MenuItem) => {
    parentNavigation.navigate('MenuDetail', { itemId: item._id });
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={() => handleItemPress(item)}
      disabled={!item.available}
    >
      {/* Image */}
      <View style={styles.menuImageContainer}>
        <Image
          source={{ uri: item.image || getDefaultImage(item.category, item.name) }}
          style={styles.menuImage}
          onError={(e) => {
            // Fallback resim ayarlama mantığı
          }}
        />
        
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>⭐ Popüler</Text>
            </View>
          )}
          {!item.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableBadgeText}>Stokta Yok</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item._id)}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite(item._id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.menuContent}>
        <Text style={styles.menuName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.menuDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        {/* Additional Info */}
        <View style={styles.menuInfoRow}>
          {item.preparationTime && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoText}>{item.preparationTime} dk</Text>
            </View>
          )}
          {item.calories && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🔥</Text>
              <Text style={styles.infoText}>{item.calories} kcal</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.menuFooter}>
          <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.menuCategory}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Menü yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Menümüz</Text>
        <Text style={styles.heroSubtitle}>
          En taze malzemeler ve özenle seçilmiş kahve çekirdekleri ile hazırlanan özel lezzetlerimizi keşfedin
        </Text>
        <View style={styles.heroFeatures}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌟</Text>
            <Text style={styles.featureText}>Premium Kalite</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚚</Text>
            <Text style={styles.featureText}>Hızlı Teslimat</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Menüde ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.menuRow}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>😢</Text>
            <Text style={styles.emptyTitle}>Menü öğesi bulunamadı</Text>
            <Text style={styles.emptySubtitle}>Farklı bir kategori deneyin</Text>
          </View>
        }
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  searchIcon: {
    marginLeft: 12,
    padding: 8,
  },
  searchIconText: {
    fontSize: 20,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#f97316',
    borderColor: '#ea580c',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  menuList: {
    padding: 20,
    paddingBottom: 40,
  },
  menuRow: {
    justifyContent: 'space-between',
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  menuCardDisabled: {
    opacity: 0.6,
  },
  menuImageContainer: {
    position: 'relative',
    height: 120,
  },
  menuImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImagePlaceholderText: {
    fontSize: 32,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuContent: {
    padding: 16,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuNameDisabled: {
    color: '#9ca3af',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  menuDescriptionDisabled: {
    color: '#d1d5db',
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  menuPriceDisabled: {
    color: '#d1d5db',
  },
  menuCategory: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  menuCategoryDisabled: {
    color: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  heroSection: {
    backgroundColor: '#f97316',
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  heroFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  popularBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unavailableBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unavailableBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default MenuScreen;