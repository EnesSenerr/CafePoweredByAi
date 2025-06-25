import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const levels = [
  {
    name: 'Bronz',
    minPoints: 0,
    maxPoints: 249,
    icon: '🥉',
    color: ['#fbbf24', '#f59e42'],
    benefits: ['%5 indirim', 'Doğum günü sürprizi', 'Mobil sipariş önceliği']
  },
  {
    name: 'Gümüş',
    minPoints: 250,
    maxPoints: 499,
    icon: '🥈',
    color: ['#a3a3a3', '#6b7280'],
    benefits: ['%10 indirim', 'Ücretsiz wifi', 'Öncelikli servis', 'Özel etkinlik davetleri']
  },
  {
    name: 'Altın',
    minPoints: 500,
    maxPoints: 999,
    icon: '🥇',
    color: ['#fde68a', '#f59e42'],
    benefits: ['%15 indirim', 'Ücretsiz içecek upgrade', 'Kişisel AI önerileri', 'VIP etkinlikler']
  },
  {
    name: 'Platin',
    minPoints: 1000,
    maxPoints: 1999,
    icon: '💎',
    color: ['#a78bfa', '#6366f1'],
    benefits: ['%20 indirim', 'Aylık ücretsiz kahve', 'AI barista danışmanlığı', 'Özel menü erişimi']
  },
  {
    name: 'Elmas',
    minPoints: 2000,
    maxPoints: 9999,
    icon: '💠',
    color: ['#38bdf8', '#2563eb'],
    benefits: ['%25 indirim', 'Sınırsız upgrade', 'Kişisel AI asistan', 'Beta özellik erişimi']
  }
];

const features = [
  { icon: '🤖', title: 'AI Kişiselleştirme', desc: 'Tercihlerinize göre kişisel öneriler' },
  { icon: '🎁', title: 'Özel Ödüller', desc: 'Seviyenize özel avantajlar' },
  { icon: '⚡', title: 'Hızlı Sipariş', desc: 'AI destekli sipariş kolaylığı' },
  { icon: '📊', title: 'Gelişmiş Analitik', desc: 'Kahve alışkanlıklarınızın analizi' }
];

const steps = [
  { step: '1', title: 'Sipariş Verin', desc: 'Her harcama için puan kazanın' },
  { step: '2', title: 'AI Öğrenir', desc: 'Sistem tercihlerinizi analiz eder' },
  { step: '3', title: 'Ödül Alın', desc: 'Kişisel öneriler ve indirimler' }
];

export default function LoyaltyProgramScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'levels' | 'how'>("overview");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Sadakat Programı</Text>
        <Text style={styles.heroDesc}>Yapay zeka ile kişiselleştirilmiş kahve deneyimi ve benzersiz ödüller</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabButton, activeTab==='overview'&&styles.tabActive]} onPress={()=>setActiveTab('overview')}><Text style={[styles.tabText, activeTab==='overview'&&styles.tabTextActive]}>Genel Bakış</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab==='levels'&&styles.tabActive]} onPress={()=>setActiveTab('levels')}><Text style={[styles.tabText, activeTab==='levels'&&styles.tabTextActive]}>Seviyeler</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab==='how'&&styles.tabActive]} onPress={()=>setActiveTab('how')}><Text style={[styles.tabText, activeTab==='how'&&styles.tabTextActive]}>Nasıl Çalışır?</Text></TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab==='overview' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avantajlar</Text>
          <View style={styles.featureRow}>
            {features.map((f,i)=>(
              <View key={i} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {activeTab==='levels' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sadakat Seviyeleri</Text>
          {levels.map((level,i)=>(
            <View key={i} style={[styles.levelCard, {backgroundColor: level.color[0]}]}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelIcon}>{level.icon}</Text>
                <Text style={styles.levelName}>{level.name}</Text>
                <Text style={styles.levelRange}>{level.minPoints} - {level.maxPoints} Puan</Text>
              </View>
              <View style={styles.levelBenefits}>
                {level.benefits.map((b,j)=>(<Text key={j} style={styles.benefit}>• {b}</Text>))}
              </View>
            </View>
          ))}
        </View>
      )}
      {activeTab==='how' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
          {steps.map((s,i)=>(
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>{s.step}</Text></View>
              <View style={{flex:1}}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heroSection: { backgroundColor: '#f97316', paddingTop: 48, paddingBottom: 24, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroDesc: { color: '#fff7ed', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, marginBottom: 0, marginTop: 8 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 24 },
  tabActive: { backgroundColor: '#f97316' },
  tabText: { color: '#f97316', fontWeight: 'bold', fontSize: 15 },
  tabTextActive: { color: '#fff' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#ea580c', marginBottom: 16 },
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  featureCard: { width: (width-64)/2, backgroundColor: '#fff', borderRadius: 18, padding: 16, alignItems: 'center', marginBottom: 12, elevation: 2 },
  featureIcon: { fontSize: 32, marginBottom: 8 },
  featureTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#1e293b', textAlign: 'center' },
  featureDesc: { color: '#64748b', fontSize: 13, textAlign: 'center' },
  levelCard: { borderRadius: 18, padding: 18, marginBottom: 16, elevation: 1 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  levelIcon: { fontSize: 28, marginRight: 10 },
  levelName: { fontWeight: 'bold', fontSize: 18, color: '#1e293b', marginRight: 10 },
  levelRange: { color: '#ea580c', fontSize: 13 },
  levelBenefits: { marginLeft: 38, marginTop: 2 },
  benefit: { color: '#374151', fontSize: 14, marginBottom: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  stepTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  stepDesc: { color: '#64748b', fontSize: 13 },
}); 