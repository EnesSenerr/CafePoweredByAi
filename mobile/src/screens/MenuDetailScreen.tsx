import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MenuDetail'>;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

const MenuDetailScreen = ({ route, navigation }: Props) => {
  const { itemId } = route.params;
  const { user, token } = useAuth();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadMenuItem();
  }, [itemId]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);
      
      // Dummy data for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyItem: MenuItem = {
        id: itemId,
        name: 'Türk Kahvesi',
        description: 'Geleneksel Türk kahvesi, orta şekerli. Ustalarımız tarafından özel olarak hazırlanan bu eşsiz lezzet, kahve deneyimini doruklara çıkarır.',
        price: 25,
        category: 'Sıcak İçecekler',
        available: true,
        ingredients: ['Türk kahvesi', 'Su', 'Şeker'],
        allergens: ['Yok'],
        nutritionInfo: {
          calories: 120,
          protein: 2,
          carbs: 24,
          fat: 1,
        },
      };
      
      setItem(dummyItem);
      setIsFavorite(Math.random() > 0.5);
      
    } catch (error) {
      console.error('Ürün detayları yüklenirken hata:', error);
      Alert.alert('Hata', 'Ürün detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      'Başarılı',
      isFavorite ? 'Ürün favorilerden çıkarıldı' : 'Ürün favorilere eklendi'
    );
  };

  const handleAddToCart = () => {
    if (!item?.available) {
      Alert.alert('Uyarı', 'Bu ürün şu anda stokta bulunmuyor');
      return;
    }

    Alert.alert(
      'Sepete Eklendi',
      `${quantity} adet ${item?.name} sepetinize eklendi`,
      [
        { text: 'Devam Et', style: 'default' },
        { 
          text: 'Sepeti Görüntüle', 
          onPress: () => navigation.navigate('Cart') 
        },
      ]
    );
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Ürün detayları yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Ürün bulunamadı</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>🍽️</Text>
            </View>
          )}
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerBackButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          
          {/* Availability Badge */}
          {!item.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Stokta Yok</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>{item.price} ₺</Text>
          </View>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>İçerikler</Text>
              <View style={styles.tagContainer}>
                {item.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alerjen Uyarısı</Text>
              <View style={styles.tagContainer}>
                {item.allergens.map((allergen, index) => (
                  <View key={index} style={[styles.tag, styles.allergenTag]}>
                    <Text style={[styles.tagText, styles.allergenTagText]}>
                      {allergen}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Nutrition Info */}
          {item.nutritionInfo && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.nutritionButton}
                onPress={() => setShowNutritionModal(true)}
              >
                <Text style={styles.nutritionButtonText}>
                  📊 Besin Değerleri
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !item.available && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={!item.available}
        >
          <Text style={styles.addToCartButtonText}>
            {item.available
              ? `🛒 Sepete Ekle - ${(item.price * quantity)} ₺`
              : '❌ Stokta Yok'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Modal */}
      <Modal
        visible={showNutritionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNutritionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Besin Değerleri</Text>
              <TouchableOpacity
                onPress={() => setShowNutritionModal(false)}
              >
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {item.nutritionInfo && (
              <View style={styles.nutritionInfo}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Kalori</Text>
                  <Text style={styles.nutritionValue}>
                    {item.nutritionInfo.calories} kcal
                  </Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>
                    {item.nutritionInfo.protein}g
                  </Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
                  <Text style={styles.nutritionValue}>
                    {item.nutritionInfo.carbs}g
                  </Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Yağ</Text>
                  <Text style={styles.nutritionValue}>
                    {item.nutritionInfo.fat}g
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 64,
  },
  headerBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButtonText: {
    fontSize: 20,
    color: '#1f2937',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  unavailableBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unavailableText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  basicInfo: {
    marginBottom: 32,
  },
  categoryText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  itemPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f97316',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  allergenTag: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  allergenTagText: {
    color: '#dc2626',
  },
  nutritionButton: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nutritionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 24,
  },
  addToCartButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#6b7280',
  },
  nutritionInfo: {
    gap: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#374151',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default MenuDetailScreen; 