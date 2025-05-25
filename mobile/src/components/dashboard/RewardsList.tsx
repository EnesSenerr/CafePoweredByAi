import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
}

interface RewardsListProps {
  rewards: Reward[];
  onRedeem: (rewardId: number) => void;
}

const RewardsList: React.FC<RewardsListProps> = ({ rewards, onRedeem }) => {
  const renderItem = ({ item }: { item: Reward }) => (
    <View style={styles.rewardItem}>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
      </View>
      <View style={styles.rewardActions}>
        <Text style={styles.pointsRequired}>{item.points} puan</Text>
        <TouchableOpacity 
          style={styles.redeemButton}
          onPress={() => onRedeem(item.id)}
        >
          <Text style={styles.redeemButtonText}>Kullan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {rewards.length === 0 ? (
        <Text style={styles.emptyText}>Ödül bulunmuyor</Text>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
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
  rewardItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rewardInfo: {
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardDescription: {
    color: '#666',
    marginTop: 2,
  },
  rewardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pointsRequired: {
    fontWeight: '500',
    color: '#2563eb',
  },
  redeemButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  redeemButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});

export default RewardsList; 