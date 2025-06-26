import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 32;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 24;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? '#9ca3af' : '#f97316';
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled ? '#f3f4f6' : '#6b7280';
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = disabled ? '#e5e7eb' : '#f97316';
        baseStyle.shadowOpacity = 0;
        baseStyle.elevation = 0;
        break;
      case 'danger':
        baseStyle.backgroundColor = disabled ? '#fca5a5' : '#ef4444';
        break;
      case 'success':
        baseStyle.backgroundColor = disabled ? '#86efac' : '#10b981';
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
    }

    // Variant text styles
    switch (variant) {
      case 'outline':
        baseTextStyle.color = disabled ? '#9ca3af' : '#f97316';
        break;
      default:
        baseTextStyle.color = disabled ? '#6b7280' : '#ffffff';
    }

    return baseTextStyle;
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#f97316' : '#ffffff'}
          style={icon ? { marginRight: 8 } : undefined}
        />
      ) : (
        icon && (
          <Text style={[{ marginRight: 8, fontSize: getTextStyle().fontSize }]}>
            {icon}
          </Text>
        )
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Yükleniyor...' : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton; 