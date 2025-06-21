import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PointsBalanceProps {
  points: number;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ points }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puan Bakiyeniz</Text>
      <Text style={styles.pointsValue}>{points} Puan</Text>
      <Text style={styles.helpText}>
        Ödüllerinizi kullanmak için puanlarınızı harcayabilirsiniz
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a', // Koyu renk ile okunabilirlik artırıldı
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  helpText: {
    marginTop: 8,
    color: '#4b5563', // Daha koyu gri ile okunabilirlik artırıldı
    fontSize: 14,
  },
});

export default PointsBalance; 