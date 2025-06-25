import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Linking, Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const contactInfo = [
  {
    title: 'Adres',
    content: ['Cumhuriyet Mah. Kahve Sokak No: 42', 'Beyoğlu / İstanbul', '34360'],
    icon: '📍',
  },
  {
    title: 'Telefon',
    content: ['+90 555 123 45 67', '+90 212 123 45 67'],
    icon: '📞',
    links: ['tel:+905551234567', 'tel:+902121234567']
  },
  {
    title: 'E-posta',
    content: ['info@cafepoweredbyai.com', 'rezervasyon@cafepoweredbyai.com'],
    icon: '✉️',
    links: ['mailto:info@cafepoweredbyai.com', 'mailto:rezervasyon@cafepoweredbyai.com']
  },
  {
    title: 'Çalışma Saatleri',
    content: ['Pazartesi - Cuma: 07:00 - 22:00', 'Cumartesi: 08:00 - 23:00', 'Pazar: 09:00 - 21:00'],
    icon: '🕐',
  }
];

const socialMedia = [
  { name: 'Twitter', icon: '🐦', url: '#' },
  { name: 'Instagram', icon: '📸', url: '#' },
  { name: 'Facebook', icon: '📘', url: '#' },
  { name: 'LinkedIn', icon: '💼', url: '#' }
];

export default function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 2500);
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>İletişim</Text>
        <Text style={styles.heroDesc}>Sorularınız, önerileriniz veya rezervasyon talepleriniz için bize ulaşın. AI destekli müşteri hizmetimizle size en iyi desteği sunmaya hazırız.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>İletişim Bilgileri</Text>
        {contactInfo.map((info, i) => (
          <View key={i} style={styles.infoCard}>
            <Text style={styles.infoIcon}>{info.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>{info.title}</Text>
              {info.content.map((item, idx) => (
                <Text
                  key={idx}
                  style={styles.infoContent}
                  onPress={info.links && info.links[idx] ? () => Linking.openURL(info.links[idx]) : undefined}
                >
                  {item}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.socialRow}>
          {socialMedia.map((s, i) => (
            <TouchableOpacity key={i} onPress={() => Linking.openURL(s.url)} style={styles.socialIcon}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Bize Yazın</Text>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Adınız Soyadınız*"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="E-posta*"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Konu"
            value={form.subject}
            onChangeText={v => handleChange('subject', v)}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Mesajınız*"
            value={form.message}
            onChangeText={v => handleChange('message', v)}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Gönderiliyor...' : 'Gönder'}</Text>
          </TouchableOpacity>
          {isSubmitted && <Text style={styles.successText}>Mesajınız başarıyla gönderildi!</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heroSection: { backgroundColor: '#f97316', paddingTop: 48, paddingBottom: 24, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroDesc: { color: '#fff7ed', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  section: { padding: 20 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#ea580c', marginBottom: 16 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, elevation: 2 },
  infoIcon: { fontSize: 32, marginRight: 14, marginTop: 2 },
  infoTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b', marginBottom: 2 },
  infoContent: { color: '#64748b', fontSize: 14, marginBottom: 2 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  socialIcon: { marginHorizontal: 8, backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2 },
  formCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 2 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, fontSize: 15, marginBottom: 12 },
  submitButton: { backgroundColor: '#f97316', borderRadius: 22, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successText: { color: '#22c55e', fontWeight: 'bold', fontSize: 15, marginTop: 10, textAlign: 'center' },
}); 