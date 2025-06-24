import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LoyaltyLevelProps {
  points: number;
  level: string;
  nextLevelPoints: number;
  currentLevelPoints: number;
}

const LoyaltyLevel = ({ points, level, nextLevelPoints, currentLevelPoints }: LoyaltyLevelProps) => {
  const getLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#CD7F32';
    }
  };

  const getLevelIcon = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🥉';
    }
  };

  const getNextLevel = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'bronze': return 'Silver';
      case 'silver': return 'Gold';
      case 'gold': return 'Platinum';
      case 'platinum': return 'Platinum'; // Max level
      default: return 'Silver';
    }
  };

  const calculateProgress = (): number => {
    if (level.toLowerCase() === 'platinum') return 100;
    
    const pointsInCurrentLevel = points - currentLevelPoints;
    const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
    
    return Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100);
  };

  const isMaxLevel = level.toLowerCase() === 'platinum';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelIcon}>{getLevelIcon(level)}</Text>
          <View style={styles.levelTexts}>
            <Text style={styles.levelTitle}>Sadakat Seviyeniz</Text>
            <Text style={[styles.levelName, { color: getLevelColor(level) }]}>
              {level.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{points}</Text>
          <Text style={styles.pointsLabel}>Puan</Text>
        </View>
      </View>

      {/* Progress Bar */}
      {!isMaxLevel && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {getNextLevel(level)} seviyesine {nextLevelPoints - points} puan kaldı
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${calculateProgress()}%`,
                  backgroundColor: getLevelColor(level)
                }
              ]} 
            />
          </View>
          
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>{currentLevelPoints}</Text>
            <Text style={styles.progressLabel}>{nextLevelPoints}</Text>
          </View>
        </View>
      )}

      {isMaxLevel && (
        <View style={styles.maxLevelSection}>
          <Text style={styles.maxLevelText}>🎉 Maksimum seviyeye ulaştınız!</Text>
          <Text style={styles.maxLevelSubtext}>
            Tebrikler! En yüksek sadakat seviyesine sahipsiniz.
          </Text>
        </View>
      )}

      {/* Level Benefits */}
      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Seviye Avantajları</Text>
        <View style={styles.benefitsList}>
          {getLevelBenefits(level).map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const getLevelBenefits = (level: string): string[] => {
  switch (level.toLowerCase()) {
    case 'bronze':
      return [
        'Temel ödül kataloğuna erişim',
        'Doğum günü sürprizi',
        'Özel kampanya duyuruları'
      ];
    case 'silver':
      return [
        'Gelişmiş ödül kataloğu',
        'İkramiye puanlar (%5 bonus)',
        'Ücretsiz kargo',
        'Öncelikli müşteri desteği'
      ];
    case 'gold':
      return [
        'Premium ödül kataloğu',
        'İkramiye puanlar (%10 bonus)',
        'Erken erişim kampanyaları',
        'Kişisel müşteri temsilcisi',
        'Ücretsiz ürün tadımları'
      ];
    case 'platinum':
      return [
        'VIP ödül kataloğu',
        'İkramiye puanlar (%15 bonus)',
        'Özel etkinlik davetleri',
        'Premium müşteri desteği',
        'Kişiselleştirilmiş öneriler',
        'Yıllık hediye çeki'
      ];
    default:
      return ['Temel ödül kataloğuna erişim'];
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  levelTexts: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressInfo: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  maxLevelSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  maxLevelSubtext: {
    fontSize: 14,
    color: '#a16207',
    textAlign: 'center',
  },
  benefitsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 14,
    color: '#10b981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});

export default LoyaltyLevel; 