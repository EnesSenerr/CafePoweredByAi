import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  variant?: 'fullscreen' | 'inline' | 'overlay';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Yükleniyor...',
  size = 'large',
  color = '#f97316',
  style,
  variant = 'inline',
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'fullscreen':
        baseStyle.flex = 1;
        baseStyle.backgroundColor = '#ffffff';
        break;
      case 'overlay':
        baseStyle.position = 'absolute';
        baseStyle.top = 0;
        baseStyle.left = 0;
        baseStyle.right = 0;
        baseStyle.bottom = 0;
        baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        baseStyle.zIndex = 1000;
        break;
      case 'inline':
      default:
        baseStyle.padding = 40;
    }

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <ActivityIndicator 
        size={size} 
        color={color}
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, { color }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingState; 