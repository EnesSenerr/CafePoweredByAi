import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  error?: string;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  size = 'medium',
  error,
  success = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
  ...rest
}) => {
  const [isSecureText, setIsSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      borderWidth: 1,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 8;
        break;
      case 'large':
        baseStyle.paddingHorizontal = 20;
        baseStyle.paddingVertical = 16;
        break;
      default: // medium
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 12;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.backgroundColor = '#ffffff';
        baseStyle.borderColor = error 
          ? '#ef4444' 
          : success 
            ? '#10b981' 
            : isFocused 
              ? '#f97316' 
              : '#e5e7eb';
        break;
      case 'filled':
        baseStyle.backgroundColor = disabled ? '#f9fafb' : '#f3f4f6';
        baseStyle.borderColor = 'transparent';
        break;
      default: // default
        baseStyle.backgroundColor = '#ffffff';
        baseStyle.borderColor = error 
          ? '#ef4444' 
          : success 
            ? '#10b981' 
            : isFocused 
              ? '#f97316' 
              : '#d1d5db';
    }

    // Disabled state
    if (disabled) {
      baseStyle.backgroundColor = '#f9fafb';
      baseStyle.borderColor = '#e5e7eb';
    }

    // Focus state
    if (isFocused && !error) {
      baseStyle.borderWidth = 2;
      baseStyle.shadowColor = '#f97316';
      baseStyle.shadowOffset = { width: 0, height: 0 };
      baseStyle.shadowOpacity = 0.1;
      baseStyle.shadowRadius = 4;
      baseStyle.elevation = 2;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: disabled ? '#9ca3af' : '#1f2937',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    if (multiline) {
      baseStyle.textAlignVertical = 'top';
      baseStyle.paddingTop = size === 'small' ? 4 : size === 'large' ? 8 : 6;
    }

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
      fontWeight: '600',
      color: error ? '#ef4444' : success ? '#10b981' : '#374151',
      marginBottom: 8,
    };
  };

  const toggleSecureText = () => {
    setIsSecureText(!isSecureText);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {/* Label */}
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View style={getContainerStyle()}>
        {/* Left Icon */}
        {leftIcon && (
          <Text style={[
            styles.icon,
            { 
              fontSize: size === 'small' ? 16 : size === 'large' ? 20 : 18,
              marginRight: 12 
            }
          ]}>
            {leftIcon}
          </Text>
        )}

        {/* Text Input */}
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          editable={!disabled}
          secureTextEntry={isSecureText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {/* Right Icon / Password Toggle */}
        {(rightIcon || isPassword) && (
          <TouchableOpacity
            onPress={isPassword ? toggleSecureText : onRightIconPress}
            style={styles.rightIconContainer}
            disabled={disabled}
          >
            <Text style={[
              styles.icon,
              { 
                fontSize: size === 'small' ? 16 : size === 'large' ? 20 : 18,
                color: disabled ? '#9ca3af' : '#6b7280'
              }
            ]}>
              {isPassword 
                ? (isSecureText ? '👁️' : '🙈') 
                : rightIcon
              }
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error/Success Message */}
      {(error || success) && (
        <View style={styles.messageContainer}>
          <Text style={[
            styles.messageText,
            { color: error ? '#ef4444' : '#10b981' }
          ]}>
            {error ? `❌ ${error}` : '✅ Geçerli'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: '#6b7280',
  },
  rightIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  messageContainer: {
    marginTop: 8,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CustomInput; 