import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import PointsBalance from '../components/dashboard/PointsBalance';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import RewardsList from '../components/dashboard/RewardsList';

const DashboardScreen = () => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // TODO: API entegrasyonu yapılacak
    // Şimdilik dummy data
    setPoints(150);
    setTransactions([
      { id: 1, type: 'earn', points: 50, date: '2024-03-20', description: 'Kahve Siparişi' },
      { id: 2, type: 'redeem', points: -30, date: '2024-03-19', description: 'Kurabiye Ödülü' }
    ]);
    setRewards([
      { id: 1, name: 'Ücretsiz Kahve', points: 100, description: 'Herhangi bir kahve ücretsiz!' },
      { id: 2, name: 'Tatlı İkramı', points: 75, description: 'Pasta veya kurabiye seçimi' },
      { id: 3, name: 'Müşteri Özel İndirim', points: 200, description: '%10 indirim kuponu' }
    ]);
  }, []);

  const handleRedeemReward = (rewardId) => {
    console.log(`Ödül kullanıldı: ${rewardId}`);
    // TODO: API entegrasyonu yapılacak
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Sadakat programınızda bugün neler var?</Text>
        </View>

        <View style={styles.section}>
          <PointsBalance points={points} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi</Text>
          <TransactionHistory transactions={transactions} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödül Kataloğu</Text>
          <RewardsList rewards={rewards} onRedeem={handleRedeemReward} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DashboardScreen; 