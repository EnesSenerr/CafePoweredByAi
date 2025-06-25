// Theme Configuration
export const theme = {
  colors: {
    // Primary Colors
    primary: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#ea580c',
    
    // Secondary Colors
    secondary: '#6b7280',
    secondaryLight: '#9ca3af',
    secondaryDark: '#4b5563',
    
    // Status Colors
    success: '#10b981',
    successLight: '#34d399',
    successDark: '#059669',
    
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    
    info: '#3b82f6',
    infoLight: '#60a5fa',
    infoDark: '#2563eb',
    
    // Neutral Colors
    white: '#ffffff',
    black: '#000000',
    
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    
    // Background Colors
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    
    // Text Colors
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textOnPrimary: '#ffffff',
    textOnSecondary: '#ffffff',
    
    // Border Colors
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    // Shadow Colors
    shadow: '#000000',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  },
  
  opacity: {
    disabled: 0.6,
    pressed: 0.8,
    overlay: 0.9,
  },
  
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    bottomSafeArea: 34,
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

export type Theme = typeof theme;

// Utility functions for theme usage
export const getColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let color: any = theme.colors;
  
  for (const key of keys) {
    color = color[key];
    if (!color) break;
  }
  
  return color || theme.colors.primary;
};

export const getSpacing = (size: keyof typeof theme.spacing): number => {
  return theme.spacing[size];
};

export const getFontSize = (size: keyof typeof theme.fontSize): number => {
  return theme.fontSize[size];
};

export const getBorderRadius = (size: keyof typeof theme.borderRadius): number => {
  return theme.borderRadius[size];
};

export const getShadow = (size: keyof typeof theme.shadows) => {
  return theme.shadows[size];
}; 