import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  date: string;
  description: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View>
        <Text 
          style={[
            styles.transactionPoints, 
            item.type === 'earn' ? styles.earned : styles.redeemed
          ]}
        >
          {item.type === 'earn' ? '+' : ''}{item.points} puan
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>Henüz işlem bulunmuyor</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionDescription: {
    fontWeight: '500',
    fontSize: 16,
    color: '#1a1a1a', // Koyu renk ile okunabilirlik artırıldı
  },
  transactionDate: {
    color: '#6b7280', // Daha koyu gri ile okunabilirlik artırıldı
    fontSize: 12,
    marginTop: 2,
  },
  transactionPoints: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  earned: {
    color: '#16a34a',
  },
  redeemed: {
    color: '#dc2626',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#4b5563', // Daha koyu gri ile okunabilirlik artırıldı
    fontSize: 16,
  },
});

export default TransactionHistory; 