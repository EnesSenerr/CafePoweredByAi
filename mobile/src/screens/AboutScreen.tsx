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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  const team = [
    {
      name: 'Ahmet Yılmaz',
      position: 'Kurucular',
      experience: '15+ yıl kahve deneyimi'
    },
    {
      name: 'Ayşe Kaya',
      position: 'Baş Barista',
      experience: 'Dünya şampiyonu'
    },
    {
      name: 'Mehmet Demir',
      position: 'AI Uzmanı',
      experience: 'Teknoloji lideri'
    }
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
          <Text style={styles.heroTitle}>AI Destekli Kahve Deneyimi</Text>
          <Text style={styles.heroSubtitle}>
            Teknoloji ve geleneksel kahve kültürünü harmanlayarak size eşsiz bir deneyim sunuyoruz
          </Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hikayemiz</Text>
          <Text style={styles.storyText}>
            2024 yılında kurulan AI Cafe, geleneksel kahve kültürü ile modern teknolojiyi 
            birleştirerek benzersiz bir kahve deneyimi yaratma misyonuyla yola çıktı. 
            Yapay zeka destekli sistemlerimiz sayesinde her müşterimizin tercihlerini 
            öğreniyor ve kişiselleştirilmiş öneriler sunuyoruz.
          </Text>
          <Text style={styles.storyText}>
            Kahve tutkumuz ve teknoloji aşkımızla birleştirdiğimiz deneyimimiz, 
            müşterilerimize her ziyarette mükemmel bir kahve deneyimi yaşatmayı hedefliyor.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özelliklerimiz</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ekibimiz</Text>
          <View style={styles.teamContainer}>
            {team.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>
                    {member.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamPosition}>{member.position}</Text>
                <Text style={styles.teamExperience}>{member.experience}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Değerlerimiz</Text>
          <View style={styles.valuesContainer}>
            <View style={styles.valueItem}>
              <Text style={styles.valueEmoji}>🌱</Text>
              <Text style={styles.valueTitle}>Sürdürülebilirlik</Text>
              <Text style={styles.valueDescription}>Çevre dostu uygulamalar</Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueEmoji}>⭐</Text>
              <Text style={styles.valueTitle}>Kalite</Text>
              <Text style={styles.valueDescription}>En iyi malzemeler</Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueEmoji}>🤝</Text>
              <Text style={styles.valueTitle}>Müşteri Memnuniyeti</Text>
              <Text style={styles.valueDescription}>Size özel deneyim</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
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
    backgroundColor: '#f8fafc',
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
  heroSection: {
    backgroundColor: '#f97316',
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
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
    lineHeight: 24,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  storyText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f97316',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  teamContainer: {
    gap: 16,
  },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#e5e7eb',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  teamPosition: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 4,
  },
  teamExperience: {
    fontSize: 14,
    color: '#6b7280',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  valueItem: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  valueEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
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