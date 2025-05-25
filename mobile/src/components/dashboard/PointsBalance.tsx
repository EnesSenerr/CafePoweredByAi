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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  helpText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default PointsBalance; 