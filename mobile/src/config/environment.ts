import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Environment types
export type Environment = 'development' | 'preview' | 'production';

// Device type detection
const isExpoGo = Constants.appOwnership === 'expo';
const isAndroidEmulator = Platform.OS === 'android' && !isExpoGo;

// Get current environment
export const getCurrentEnvironment = (): Environment => {
  if (__DEV__) {
    return 'development';
  }
  
  // Check if this is a preview build
  const isPreview = process.env.EXPO_PUBLIC_ENVIRONMENT === 'preview';
  return isPreview ? 'preview' : 'production';
};

// Environment configuration
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: (() => {
      if (isAndroidEmulator) {
        return 'http://10.0.2.2:5000'; // Android emulator
      } else if (isExpoGo || Platform.OS === 'ios') {
        return 'http://192.168.1.102:5000'; // Expo Go veya iOS Simulator
      } else {
        return 'http://localhost:5000'; // Fallback
      }
    })(),
    DEBUG_MODE: true,
    CONSOLE_LOGS: true,
    ANALYTICS_ENABLED: false,
    CACHE_ENABLED: true,
    PERFORMANCE_MONITORING: true,
  },
  
  preview: {
    API_BASE_URL: 'https://staging-api.cafepoweredbyai.com',
    DEBUG_MODE: true,
    CONSOLE_LOGS: false,
    ANALYTICS_ENABLED: true,
    CACHE_ENABLED: true,
    PERFORMANCE_MONITORING: true,
  },
  
  production: {
    API_BASE_URL: 'https://api.cafepoweredbyai.com',
    DEBUG_MODE: false,
    CONSOLE_LOGS: false,
    ANALYTICS_ENABLED: true,
    CACHE_ENABLED: true,
    PERFORMANCE_MONITORING: false,
  },
};

// Current environment config
export const CURRENT_ENV = getCurrentEnvironment();
export const CONFIG = ENV_CONFIG[CURRENT_ENV];

// API Configuration
export const API_CONFIG = {
  BASE_URL: CONFIG.API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    AUTH: '/api/auth',
    MENU: '/api/menu',
    ORDERS: '/api/orders',
    POINTS: '/api/points',
    REWARDS: '/api/rewards',
    NOTIFICATIONS: '/api/notifications',
    UPLOAD: '/api/upload',
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'CafePoweredByAI',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  
  // Feature Flags
  FEATURES: {
    ADMIN_PANEL: true,
    EMPLOYEE_PANEL: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC_AUTH: Platform.OS !== 'web',
    DARK_MODE: false, // Future feature
    ANALYTICS: CONFIG.ANALYTICS_ENABLED,
    CACHE: CONFIG.CACHE_ENABLED,
    PERFORMANCE_MONITORING: CONFIG.PERFORMANCE_MONITORING,
  },
  
  // UI Configuration
  UI: {
    PRIMARY_COLOR: '#f97316',
    SECONDARY_COLOR: '#ea580c',
    SUCCESS_COLOR: '#22c55e',
    ERROR_COLOR: '#ef4444',
    WARNING_COLOR: '#f59e0b',
    INFO_COLOR: '#3b82f6',
  },
  
  // Business Logic
  BUSINESS: {
    MIN_ORDER_AMOUNT: 50,
    FREE_DELIVERY_THRESHOLD: 200,
    POINTS_PER_LIRA: 1,
    LOYALTY_LEVELS: {
      BRONZE: { min: 0, name: 'Bronze' },
      SILVER: { min: 1000, name: 'Silver' },
      GOLD: { min: 5000, name: 'Gold' },
      PLATINUM: { min: 15000, name: 'Platinum' },
    },
  },
  
  // External Links
  LINKS: {
    WEBSITE: 'https://cafepoweredbyai.com',
    INSTAGRAM: 'https://instagram.com/cafepoweredbyai',
    FACEBOOK: 'https://facebook.com/cafepoweredbyai',
    TWITTER: 'https://twitter.com/cafepoweredbyai',
    SUPPORT_EMAIL: 'support@cafepoweredbyai.com',
    SUPPORT_PHONE: '+90-555-123-4567',
    TERMS_OF_SERVICE: 'https://cafepoweredbyai.com/terms',
    PRIVACY_POLICY: 'https://cafepoweredbyai.com/privacy',
  },
  
  // App Store Links
  STORE_LINKS: {
    IOS: 'https://apps.apple.com/app/cafepoweredbyai/id123456789',
    ANDROID: 'https://play.google.com/store/apps/details?id=com.cafepoweredbyai.mobile',
  },
};

// Debug utilities
export const DEBUG = {
  log: (...args: any[]) => {
    if (CONFIG.CONSOLE_LOGS) {
      console.log(`[${CURRENT_ENV.toUpperCase()}]`, ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (CONFIG.CONSOLE_LOGS) {
      console.warn(`[${CURRENT_ENV.toUpperCase()}]`, ...args);
    }
  },
  
  error: (...args: any[]) => {
    if (CONFIG.CONSOLE_LOGS) {
      console.error(`[${CURRENT_ENV.toUpperCase()}]`, ...args);
    }
  },
  
  table: (data: any) => {
    if (CONFIG.CONSOLE_LOGS) {
      console.table(data);
    }
  },
};

// Environment info
export const getEnvironmentInfo = () => {
  return {
    environment: CURRENT_ENV,
    platform: Platform.OS,
    version: Platform.Version,
    isDev: __DEV__,
    apiUrl: CONFIG.API_BASE_URL,
    features: APP_CONFIG.FEATURES,
  };
};

export default {
  CURRENT_ENV,
  CONFIG,
  API_CONFIG,
  APP_CONFIG,
  DEBUG,
  getEnvironmentInfo,
}; 