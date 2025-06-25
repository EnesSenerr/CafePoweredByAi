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
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../navigation/AppNavigator';
import { getMenuItems } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

type Props = BottomTabScreenProps<TabParamList, 'Menu'>;

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  stock?: number;
}

const MenuScreen = ({ navigation }: Props) => {
  const parentNavigation = useNavigation<any>();
  const { state } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchQuery, selectedCategory]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems();
      const items: MenuItem[] = response.data || [];
      setMenuItems(items);
      
      // Kategorileri çıkar
      const uniqueCategories = ['all', ...Array.from(new Set(items.map((item: MenuItem) => item.category)))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Menü yüklenirken hata:', error);
      Alert.alert('Hata', 'Menü yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Kategori filtreleme
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Arama filtreleme
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getCategoryDisplayName = (category: string) => {
    if (category === 'all') return 'Tümü';
    return category;
  };

  const formatPrice = (price: number) => {
    return `${price} ₺`;
  };

  const handleItemPress = (item: MenuItem) => {
    parentNavigation.navigate('MenuDetail', { itemId: item.id });
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuCard, !item.available && styles.menuCardDisabled]}
      onPress={() => handleItemPress(item)}
      disabled={!item.available}
    >
      <View style={styles.menuImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.menuImage} />
        ) : (
          <View style={styles.menuImagePlaceholder}>
            <Text style={styles.menuImagePlaceholderText}>🍽️</Text>
          </View>
        )}
        {!item.available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Stokta Yok</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite(item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuContent}>
        <Text style={[styles.menuName, !item.available && styles.menuNameDisabled]}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={[styles.menuDescription, !item.available && styles.menuDescriptionDisabled]}>
            {item.description}
          </Text>
        )}
        <View style={styles.menuFooter}>
          <Text style={[styles.menuPrice, !item.available && styles.menuPriceDisabled]}>
            {formatPrice(item.price)}
          </Text>
          <Text style={[styles.menuCategory, !item.available && styles.menuCategoryDisabled]}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: string) => (
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
        {getCategoryDisplayName(category)}
      </Text>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menü</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Menüde ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text style={styles.searchIconText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Menu Items */}
              <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.menuRow}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Menü öğesi bulunamadı</Text>
            <Text style={styles.emptySubtitle}>
              Farklı bir kategori seçin veya arama teriminizi değiştirin
            </Text>
          </View>
        }
        refreshing={loading}
        onRefresh={loadMenuItems}
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
});

export default MenuScreen;