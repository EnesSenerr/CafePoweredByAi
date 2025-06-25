import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
  variant?: 'fullscreen' | 'inline';
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir hata oluştu',
  message = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.',
  icon = '⚠️',
  onRetry,
  retryText = 'Tekrar Dene',
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
      {/* Error Icon */}
      <Text style={styles.icon}>{icon}</Text>
      
      {/* Error Title */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Error Message */}
      <Text style={styles.message}>{message}</Text>
      
      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
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
  retryButton: {
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
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorState; 