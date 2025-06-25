import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AboutScreen = () => {
  const navigation = useNavigation<any>();

  const features = [
    {
      emoji: '🤖',
      title: 'AI Kahve Önerileri',
      description: 'Yapay zeka teknolojisi ile kişisel tercihlerinize uygun kahve önerileri alın',
    },
    {
      emoji: '⚡',
      title: 'Akıllı Sipariş',
      description: 'Tercihlerinizi öğrenen sistem ile hızlı ve kolay sipariş deneyimi',
    },
    {
      emoji: '🎁',
      title: 'Kişiselleştirilmiş Ödüller',
      description: 'AI destekli sadakat programı ile size özel indirimler ve avantajlar',
    }
  ];

  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & Baş Barista',
      description: '15 yıllık deneyimi ile kahve kültürünün öncülerinden',
      icon: '👨‍💼',
    },
    {
      name: 'Ayşe Demir',
      role: 'Operasyon Müdürü',
      description: 'Müşteri deneyimi konusunda uzman, ekip lideri',
      icon: '👩‍💼',
    },
    {
      name: 'Mehmet Kaya',
      role: 'AI Teknoloji Uzmanı',
      description: 'AI destekli sistemlerin geliştiricisi ve teknik sorumlu',
      icon: '👨‍💻',
    },
  ];

  const values = [
    {
      title: 'Premium Kalite',
      description: 'En iyi kahve çekirdeklerini seçiyor, her adımda kalite kontrolü yapıyoruz. Mükemmellik standardımızdan asla ödün vermiyoruz.',
      icon: '⭐',
    },
    {
      title: 'Sürdürülebilirlik',
      description: 'Çevre dostu yaklaşımımızla, adil ticaret kahveleri kullanıyor ve geri dönüştürülebilir ambalajları tercih ediyoruz.',
      icon: '🌿',
    },
    {
      title: 'AI İnovasyonu',
      description: 'Yapay zeka destekli sadakat programımız ve modern teknolojiler ile müşteri deneyimini sürekli geliştiriyoruz.',
      icon: '🤖',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hakkımızda</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop' }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Hakkımızda</Text>
            <Text style={styles.heroSubtitle}>
              2015'ten beri, yapay zeka teknolojisi ile desteklenen kaliteli kahve deneyimi ve sıcak atmosfer sunarak kahve severler için öncü bir buluşma noktası oluyoruz.
            </Text>
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}><Text style={styles.heroStatIcon}>🎯</Text><Text style={styles.heroStatText}>8+ Yıl Deneyim</Text></View>
              <View style={styles.heroStat}><Text style={styles.heroStatIcon}>❤️</Text><Text style={styles.heroStatText}>10K+ Mutlu Müşteri</Text></View>
            </View>
          </View>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hikayemiz</Text>
          <Text style={styles.storyTitle}>Tutkuyla Başlayan Bir Yolculuk</Text>
          <Text style={styles.storyText}>
            Cafe PoweredByAi, kahve tutkunu iki arkadaşın hayali ile başladı. 2015 yılında küçük bir dükkanda başlayan yolculuğumuz, bugün şehrin en sevilen ve teknolojik olarak en gelişmiş kahve mekanlarından biri haline geldi.
          </Text>
          <Text style={styles.storyText}>
            Her sabah, dünyanın farklı köşelerinden özenle seçilmiş en taze kahve çekirdeklerini sanatkarlık anlayışıyla işliyoruz. Amacımız sadece mükemmel kahve sunmak değil, aynı zamanda misafirlerimize sıcak, samimi ve teknolojik bir ortam sağlamak.
          </Text>
          <Text style={styles.storyText}>
            2023 yılında devrim niteliğinde bir adım atarak, yapay zeka teknolojisi ile geleneksel kahve kültürünü birleştirdik. AI destekli sadakat programımızla müşteri deneyimini tamamen yeniden tanımladık.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}><Text style={styles.statIcon}>☕</Text><Text style={styles.statValue}>500K+</Text><Text style={styles.statLabel}>Servis Edilen Kahve</Text></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>👥</Text><Text style={styles.statValue}>10K+</Text><Text style={styles.statLabel}>Mutlu Müşteri</Text></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>🏆</Text><Text style={styles.statValue}>15+</Text><Text style={styles.statLabel}>Kalite Ödülü</Text></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>🤖</Text><Text style={styles.statValue}>%98</Text><Text style={styles.statLabel}>AI Doğruluk Oranı</Text></View>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Bizi Özel Kılan Değerler</Text>
          {values.map((value, idx) => (
            <View key={idx} style={styles.valueCard}>
              <Text style={styles.valueIcon}>{value.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueDesc}>{value.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Ekibimiz</Text>
          {teamMembers.map((member, idx) => (
            <View key={idx} style={styles.teamCard}>
              <Text style={styles.teamIcon}>{member.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamDesc}>{member.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>İletişim</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Adres</Text>
                <Text style={styles.contactText}>
                  Bağdat Caddesi No:123{'\n'}Kadıköy, İstanbul
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:+902161234567')}
            >
              <Text style={styles.contactIcon}>📞</Text>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Telefon</Text>
                <Text style={styles.contactText}>0216 123 45 67</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:info@aicafe.com')}
            >
              <Text style={styles.contactIcon}>✉️</Text>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>E-posta</Text>
                <Text style={styles.contactText}>info@aicafe.com</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    color: '#f97316',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 60,
  },
  heroSection: { height: 320, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  heroImage: { position: 'absolute', width: '100%', height: 320, top: 0, left: 0 },
  heroOverlay: { position: 'absolute', width: '100%', height: 320, backgroundColor: 'rgba(0,0,0,0.35)', top: 0, left: 0 },
  heroContent: { zIndex: 2, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 24 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10, marginTop: 24 },
  heroSubtitle: { fontSize: 15, color: '#f3f4f6', textAlign: 'center', marginBottom: 16 },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  heroStat: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14, marginHorizontal: 4, marginBottom: 4 },
  heroStatIcon: { fontSize: 18, marginRight: 6 },
  heroStatText: { color: '#ea580c', fontWeight: 'bold', fontSize: 14 },
  section: { paddingVertical: 28, paddingHorizontal: 16 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#ea580c', marginBottom: 14, textAlign: 'center' },
  storyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, textAlign: 'center' },
  storyText: { color: '#374151', fontSize: 14, marginBottom: 8, textAlign: 'center' },
  statsSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  statCard: { width: (width - 48) / 2, alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 18, marginBottom: 12, elevation: 1 },
  statIcon: { fontSize: 28, marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#ea580c' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 2, textAlign: 'center' },
  valueCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f3f4f6', borderRadius: 16, padding: 14, marginBottom: 10 },
  valueIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  valueTitle: { fontWeight: 'bold', fontSize: 15, color: '#1e293b', marginBottom: 2 },
  valueDesc: { color: '#374151', fontSize: 13 },
  teamCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, elevation: 1 },
  teamIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  teamName: { fontWeight: 'bold', fontSize: 15, color: '#1e293b', marginBottom: 2 },
  teamRole: { color: '#ea580c', fontSize: 13, marginBottom: 2 },
  teamDesc: { color: '#374151', fontSize: 13 },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 4,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default AboutScreen; 