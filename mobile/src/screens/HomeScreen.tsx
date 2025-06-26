import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RecommendationCard from "../components/dashboard/RecommendationCard";
import ChatbotWidget from "../components/ui/ChatbotWidget";

const { width } = Dimensions.get('window');

// Webdekiyle aynı veri dizileri
const features = [
  {
    emoji: '🤖',
    title: 'AI Kahve Önerileri',
    description: 'Yapay zeka teknolojisi ile kişisel tercihlerinize uygun kahve önerileri alın',
    gradient: ['#3b82f6', '#8b5cf6']
  },
  {
    emoji: '⚡',
    title: 'Akıllı Sipariş',
    description: 'Tercihlerinizi öğrenen sistem ile hızlı ve kolay sipariş deneyimi',
    gradient: ['#22c55e', '#059669']
  },
  {
    emoji: '🎁',
    title: 'Kişiselleştirilmiş Ödüller',
    description: 'AI destekli sadakat programı ile size özel indirimler ve avantajlar',
    gradient: ['#f59e42', '#ef4444']
  }
];

const coffeeMenu = [
  { id: 1, name: 'Türk Kahvesi', price: '45 ₺', category: 'Klasik', emoji: '☕' },
  { id: 2, name: 'Flat White', price: '60 ₺', category: 'Espresso Bazlı', emoji: '🥛' },
  { id: 3, name: 'Filtre Kahve', price: '55 ₺', category: 'Filtre', emoji: '☕' },
  { id: 4, name: 'Cold Brew', price: '65 ₺', category: 'Soğuk İçecekler', emoji: '🧊' },
];

const testimonials = [
  { 
    id: 1, 
    name: 'Ahmet Yılmaz', 
    text: 'AI önerileri sayesinde daha önce hiç denemediğim kahveleri keşfettim. Artık her seferinde mükemmel lezzet!', 
    rating: 5,
    title: 'Sadık Müşteri'
  },
  { 
    id: 2, 
    name: 'Ayşe Kaya', 
    text: 'Akıllı sipariş sistemi tercihlerimi öğrendi. Sadece bir tıkla her zaman favori kahvem hazır!', 
    rating: 5,
    title: 'Premium Üye'
  },
  { 
    id: 3, 
    name: 'Mehmet Demir', 
    text: 'AI destekli sadakat programı ile kişiselleştirilmiş indirimler alıyorum. Teknoloji ve lezzet bir arada!', 
    rating: 5,
    title: 'Elmas Üye'
  },
];

const getHeroImage = () => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop';
const getLoyaltyImage = () => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop';
const getInstagramImage = (index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop'
  ];
  return images[index % images.length];
};

export default function HomeScreen({ navigation: propNavigation }: any) {
  const navigation = propNavigation || useNavigation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={{ uri: getHeroImage() }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>AI Destekli{"\n"}Kahve Deneyimi</Text>
          <Text style={styles.heroSubtitle}>
            Yapay zeka teknolojisi ile kişiselleştirilmiş kahve önerileri ve mükemmel lezzet deneyimi. Geleceğin kahve kültürünü bugün yaşayın.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.primaryButtonText}>Menüyü Keşfet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryButtonText}>AI Deneyimini Başlat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Özellikler</Text>
        <View style={styles.featuresRow}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureCard}> 
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}><Text style={styles.statValue}>500K+</Text><Text style={styles.statLabel}>Servis Edilen Kahve</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>10K+</Text><Text style={styles.statLabel}>Mutlu Müşteri</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>95%</Text><Text style={styles.statLabel}>AI Doğruluk Oranı</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>24/7</Text><Text style={styles.statLabel}>AI Destek</Text></View>
      </View>

      {/* Coffee Menu Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>AI Tarafından Önerilen Kahveler</Text>
        <View style={styles.menuRow}>
          {coffeeMenu.map((item) => (
            <View key={item.id} style={styles.menuCard}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuCategory}>{item.category}</Text>
              <Text style={styles.menuPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.primaryButtonText}>Tüm Menüyü Gör</Text>
        </TouchableOpacity>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Müşteri Yorumları</Text>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialName}>{testimonials[activeTestimonial].name}</Text>
          <Text style={styles.testimonialTitle}>{testimonials[activeTestimonial].title}</Text>
          <Text style={styles.testimonialText}>&ldquo;{testimonials[activeTestimonial].text}&rdquo;</Text>
          <View style={styles.testimonialRating}>
            {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
              <Text key={i} style={styles.star}>★</Text>
            ))}
          </View>
        </View>
        <View style={styles.testimonialDots}>
          {testimonials.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.dot, activeTestimonial === idx && styles.activeDot]}
              onPress={() => setActiveTestimonial(idx)}
            />
          ))}
        </View>
      </View>

      {/* Loyalty Program CTA */}
      <View style={styles.loyaltySection}>
        <Image source={{ uri: getLoyaltyImage() }} style={styles.loyaltyImage} resizeMode="cover" />
        <View style={styles.loyaltyContent}>
          <Text style={styles.loyaltyTitle}>AI Destekli Sadakat Programı</Text>
          <Text style={styles.loyaltyDesc}>
            Her siparişinizde puan kazanın, kişiselleştirilmiş öneriler alın ve özel avantajlardan yararlanın.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.primaryButtonText}>Hemen Üye Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('LoyaltyProgram')}>
              <Text style={styles.secondaryButtonText}>Daha Fazla Bilgi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Instagram Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Instagram</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.instagramRow}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <TouchableOpacity key={idx} onPress={() => Linking.openURL('https://instagram.com/cafepoweredbyai')}>
              <Image source={{ uri: getInstagramImage(idx) }} style={styles.instagramImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* About & Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Hakkımızda</Text>
        <Text style={styles.aboutText}>AI Cafe, yapay zeka destekli kahve deneyimiyle kişiselleştirilmiş öneriler ve ödüller sunar. Misyonumuz, kahve keyfini teknolojiyle birleştirerek her müşteriye özel bir deneyim yaşatmaktır.</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('About')}>
          <Text style={styles.infoButtonText}>Hakkımızda Sayfasına Git</Text>
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>İletişim</Text>
        <Text style={styles.contactText}>Adres: Bağdat Caddesi No:123, Kadıköy, İstanbul{"\n"}Telefon: 0216 123 45 67{"\n"}E-posta: info@aicafe.com</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.infoButtonText}>İletişim Sayfasına Git</Text>
        </TouchableOpacity>
      </View>

      {/* Final CTA */}
      <View style={styles.finalCTASection}>
        <Text style={styles.finalCTATitle}>Geleceğin Kahve Deneyimini Bugün Yaşayın</Text>
        <Text style={styles.finalCTADesc}>
          AI destekli teknoloji, premium kahve kalitesi ve kişiselleştirilmiş hizmet. Size özel kahve yolculuğunuza hemen başlayın.
        </Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TouchableOpacity style={styles.finalCTAButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.finalCTAButtonText}>Kahve Keşfine Başla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => Linking.openURL('https://cafepoweredbyai.com/kayit')}>
            <Text style={styles.secondaryButtonText}>Ücretsiz Üye Ol</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RecommendationCard />
      <ChatbotWidget />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroSection: { height: 340, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  heroImage: { position: 'absolute', width: '100%', height: 340, top: 0, left: 0 },
  heroOverlay: { position: 'absolute', width: '100%', height: 340, backgroundColor: 'rgba(0,0,0,0.35)', top: 0, left: 0 },
  heroContent: { zIndex: 2, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 24 },
  heroTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12, marginTop: 24 },
  heroSubtitle: { fontSize: 16, color: '#f3f4f6', textAlign: 'center', marginBottom: 18 },
  heroButtons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 8 },
  primaryButton: { backgroundColor: '#f97316', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, marginHorizontal: 6 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { borderWidth: 2, borderColor: '#f97316', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, marginHorizontal: 6 },
  secondaryButtonText: { color: '#f97316', fontWeight: 'bold', fontSize: 16 },
  section: { paddingVertical: 32, paddingHorizontal: 16 },
  sectionHeader: { fontSize: 24, fontWeight: 'bold', color: '#ea580c', marginBottom: 18, textAlign: 'center' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  featureCard: { 
    width: (width - 48) / 3, // 16px sağ/sol padding + 2x8px gap
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 18, 
    marginHorizontal: 0, 
    elevation: 2, 
    backgroundColor: '#fff',
    minHeight: 150
  },
  featureEmoji: { fontSize: 32, marginBottom: 8 },
  featureTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#1e293b', textAlign: 'center' },
  featureDesc: { color: '#64748b', fontSize: 12, textAlign: 'center', lineHeight: 17 },
  statsSection: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#f3f4f6', borderRadius: 18, marginHorizontal: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#ea580c' },
  statLabel: { color: '#374151', fontSize: 13, marginTop: 2 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  menuCard: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#fff7ed', borderRadius: 18, marginHorizontal: 4, elevation: 1 },
  menuEmoji: { fontSize: 32, marginBottom: 8 },
  menuName: { fontWeight: 'bold', fontSize: 16, color: '#1e293b', marginBottom: 2 },
  menuCategory: { color: '#ea580c', fontSize: 13, marginBottom: 2 },
  menuPrice: { color: '#374151', fontSize: 15, fontWeight: 'bold' },
  testimonialCard: { backgroundColor: '#fff7ed', borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 8 },
  testimonialName: { fontWeight: 'bold', fontSize: 16, color: '#ea580c' },
  testimonialTitle: { color: '#64748b', fontSize: 13, marginBottom: 6 },
  testimonialText: { color: '#374151', fontSize: 15, fontStyle: 'italic', textAlign: 'center', marginBottom: 8 },
  testimonialRating: { flexDirection: 'row' },
  star: { color: '#fbbf24', fontSize: 18, marginRight: 2 },
  testimonialDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#f97316' },
  loyaltySection: { marginVertical: 32, alignItems: 'center' },
  loyaltyImage: { width: width - 32, height: 180, borderRadius: 18, marginBottom: 12 },
  loyaltyContent: { alignItems: 'center', paddingHorizontal: 12 },
  loyaltyTitle: { fontSize: 22, fontWeight: 'bold', color: '#ea580c', marginBottom: 6 },
  loyaltyDesc: { color: '#374151', fontSize: 15, textAlign: 'center', marginBottom: 10 },
  instagramRow: { flexDirection: 'row', marginTop: 8 },
  instagramImage: { width: 80, height: 80, borderRadius: 16, marginRight: 10 },
  finalCTASection: { padding: 32, alignItems: 'center', backgroundColor: '#f97316', borderRadius: 24, margin: 16 },
  finalCTATitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
  finalCTADesc: { color: '#fff7ed', fontSize: 15, textAlign: 'center', marginBottom: 14 },
  finalCTAButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 220,
    alignItems: 'center',
  },
  finalCTAButtonText: {
    color: '#f97316',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  aboutText: { color: '#374151', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  contactText: { color: '#64748b', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  infoButton: { backgroundColor: '#f97316', borderRadius: 22, paddingVertical: 12, paddingHorizontal: 28, alignItems: 'center', marginBottom: 14, marginTop: 2 },
  infoButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
}); 