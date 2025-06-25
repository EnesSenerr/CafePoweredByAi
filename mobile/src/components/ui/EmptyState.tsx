import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  onAction?: () => void;
  actionText?: string;
  style?: ViewStyle;
  variant?: 'fullscreen' | 'inline';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Henüz veri yok',
  message = 'Burası henüz boş görünüyor.',
  icon = '📭',
  onAction,
  actionText = 'Başlayın',
  style,
  variant = 'inline',
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    };

    if (variant === 'fullscreen') {
      baseStyle.flex = 1;
      baseStyle.backgroundColor = '#ffffff';
    }

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {/* Empty Icon */}
      <Text style={styles.icon}>{icon}</Text>
      
      {/* Empty Title */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Empty Message */}
      <Text style={styles.message}>{message}</Text>
      
      {/* Action Button */}
      {onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState; 