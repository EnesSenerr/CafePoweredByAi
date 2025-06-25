import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

interface CustomCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  backgroundColor,
  onPress,
  disabled = false,
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    // Padding styles
    switch (padding) {
      case 'none':
        baseStyle.padding = 0;
        break;
      case 'small':
        baseStyle.padding = 12;
        break;
      case 'large':
        baseStyle.padding = 24;
        break;
      default: // medium
        baseStyle.padding = 16;
    }

    // Margin styles
    switch (margin) {
      case 'small':
        baseStyle.margin = 8;
        break;
      case 'medium':
        baseStyle.margin = 16;
        break;
      case 'large':
        baseStyle.margin = 24;
        break;
      default: // none
        baseStyle.margin = 0;
    }

    // Border radius styles
    switch (borderRadius) {
      case 'none':
        baseStyle.borderRadius = 0;
        break;
      case 'small':
        baseStyle.borderRadius = 8;
        break;
      case 'large':
        baseStyle.borderRadius = 20;
        break;
      case 'full':
        baseStyle.borderRadius = 9999;
        break;
      default: // medium
        baseStyle.borderRadius = 12;
    }

    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = backgroundColor || '#ffffff';
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 4 };
        baseStyle.shadowOpacity = 0.15;
        baseStyle.shadowRadius = 8;
        baseStyle.elevation = 6;
        break;
      case 'outlined':
        baseStyle.backgroundColor = backgroundColor || '#ffffff';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = '#e5e7eb';
        break;
      case 'flat':
        baseStyle.backgroundColor = backgroundColor || '#f8fafc';
        break;
      default: // default
        baseStyle.backgroundColor = backgroundColor || '#ffffff';
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 4;
        baseStyle.elevation = 3;
    }

    // Disabled state
    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[getCardStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
};

export default CustomCard; 