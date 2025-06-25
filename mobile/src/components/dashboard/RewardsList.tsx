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
  onRewardPress?: (rewardId: string) => void;
}

const RewardsList: React.FC<RewardsListProps> = ({ rewards, onRedeem, onRewardPress }) => {
  const renderItem = ({ item }: { item: Reward }) => (
    <TouchableOpacity 
      style={styles.rewardItem}
      onPress={() => onRewardPress?.(item.id.toString())}
    >
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
      </View>
      <View style={styles.rewardActions}>
        <Text style={styles.pointsRequired}>{item.points} puan</Text>
        <TouchableOpacity 
          style={styles.redeemButton}
          onPress={(e) => {
            e.stopPropagation();
            onRedeem(item.id);
          }}
        >
          <Text style={styles.redeemButtonText}>Kullan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {rewards.length === 0 ? (
        <Text style={styles.emptyText}>Ödül bulunmuyor</Text>
      ) : (
        <FlatList
          data={rewards}
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
    color: '#1a1a1a', // Koyu renk ile okunabilirlik artırıldı
  },
  rewardDescription: {
    color: '#4b5563', // Daha koyu gri ile okunabilirlik artırıldı
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
    color: '#4b5563', // Daha koyu gri ile okunabilirlik artırıldı
    fontSize: 16,
  },
});

export default RewardsList; 