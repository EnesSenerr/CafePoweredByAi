import { Platform, Dimensions, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Platform detection utilities
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// Device info
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Safe area utilities for iOS
export class SafeAreaUtils {
  // Get safe area insets for iOS
  static getSafeAreaInsets() {
    if (isIOS) {
      const statusBarHeight = getStatusBarHeight();
      const hasNotch = screenHeight >= 812; // iPhone X and newer
      
      return {
        top: statusBarHeight,
        bottom: hasNotch ? 34 : 0, // Home indicator height
        left: 0,
        right: 0,
      };
    }
    
    // Android
    return {
      top: StatusBar.currentHeight || 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  // Get header height with safe area
  static getHeaderHeight(): number {
    const safeAreaTop = this.getSafeAreaInsets().top;
    const baseHeaderHeight = 56; // Standard header height
    
    return baseHeaderHeight + safeAreaTop;
  }

  // Get tab bar height with safe area
  static getTabBarHeight(): number {
    const safeAreaBottom = this.getSafeAreaInsets().bottom;
    const baseTabHeight = 49; // Standard tab height
    
    return baseTabHeight + safeAreaBottom;
  }
}

// iOS specific utilities
export class IOSUtils {
  // Handle iOS safe area styles
  static getSafeAreaStyle() {
    if (!isIOS) return {};
    
    const insets = SafeAreaUtils.getSafeAreaInsets();
    
    return {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    };
  }

  // iOS navigation bar style
  static getNavigationBarStyle() {
    if (!isIOS) return {};
    
    return {
      backgroundColor: '#f97316', // Primary color
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    };
  }

  // iOS tab bar style
  static getTabBarStyle() {
    if (!isIOS) return {};
    
    const safeAreaBottom = SafeAreaUtils.getSafeAreaInsets().bottom;
    
    return {
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingBottom: safeAreaBottom,
      height: 49 + safeAreaBottom,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: -2 },
    };
  }

  // iOS status bar configuration
  static getStatusBarConfig() {
    if (!isIOS) return { style: 'default' };
    
    return {
      style: 'light-content', // White text on colored background
      backgroundColor: '#f97316',
      translucent: false,
    };
  }
}

// Android specific utilities
export class AndroidUtils {
  // Handle Android back button
  static setupBackHandler(navigation: any) {
    if (!isAndroid) return () => {};
    
    const { BackHandler } = require('react-native');
    
    const backAction = () => {
      // Custom back button logic
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default behavior
      }
      
      // If on main screen, exit app
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }

  // Android navigation bar style
  static getNavigationBarStyle() {
    if (!isAndroid) return {};
    
    return {
      backgroundColor: '#f97316',
      elevation: 4, // Material Design shadow
      borderBottomWidth: 0,
    };
  }

  // Android tab bar style
  static getTabBarStyle() {
    if (!isAndroid) return {};
    
    return {
      backgroundColor: '#ffffff',
      elevation: 8, // Material Design shadow
      borderTopWidth: 0,
      height: 56, // Material Design tab height
    };
  }

  // Android status bar configuration
  static getStatusBarConfig() {
    if (!isAndroid) return { style: 'default' };
    
    return {
      style: 'light-content',
      backgroundColor: '#ea580c', // Darker shade for Android
      translucent: false,
    };
  }

  // Request Android permissions
  static async requestPermissions() {
    if (!isAndroid) return true;
    
    try {
      const { PermissionsAndroid } = require('react-native');
      
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      return Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }
}

// Universal platform utilities
export class PlatformUtils {
  // Get platform-specific styles
  static getPlatformStyles() {
    const containerStyle: any = {
      flex: 1,
      backgroundColor: '#ffffff',
    };

    if (isIOS) {
      Object.assign(containerStyle, IOSUtils.getSafeAreaStyle());
    } else if (isAndroid) {
      containerStyle.paddingTop = StatusBar.currentHeight || 0;
    }

    return {
      container: containerStyle,
      header: isIOS ? IOSUtils.getNavigationBarStyle() : AndroidUtils.getNavigationBarStyle(),
      tabBar: isIOS ? IOSUtils.getTabBarStyle() : AndroidUtils.getTabBarStyle(),
    };
  }

  // Get platform-specific navigation options
  static getNavigationOptions() {
    return {
      headerStyle: this.getPlatformStyles().header,
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
      },
      headerTintColor: '#ffffff',
      headerBackTitle: isIOS ? ' ' : undefined, // Hide back title on iOS
      gestureEnabled: isIOS, // Enable swipe gestures on iOS
    };
  }

  // Get platform-specific tab bar options
  static getTabBarOptions() {
    return {
      tabBarStyle: this.getPlatformStyles().tabBar,
      tabBarActiveTintColor: '#f97316',
      tabBarInactiveTintColor: '#6b7280',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
        marginBottom: Platform.OS === 'android' ? 5 : 0,
      },
      tabBarIconStyle: {
        marginTop: Platform.OS === 'android' ? 5 : 0,
      },
    };
  }

  // Handle platform-specific navigation patterns
  static getNavigationPattern() {
    return Platform.select({
      ios: {
        animation: 'slide_from_right',
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 300 } },
          close: { animation: 'timing', config: { duration: 300 } },
        },
      },
      android: {
        animation: 'slide_from_bottom',
        gestureDirection: 'vertical',
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 250 } },
          close: { animation: 'timing', config: { duration: 250 } },
        },
      },
      default: {
        animation: 'fade',
      },
    });
  }
}

// Device type detection
export class DeviceUtils {
  // Check if device is tablet
  static isTablet(): boolean {
    const aspectRatio = screenWidth / screenHeight;
    return (
      (screenWidth >= 768 && screenHeight >= 1024) || // iPad-like
      (screenWidth >= 1024 && screenHeight >= 768) ||  // Landscape tablet
      (aspectRatio > 1.3 && aspectRatio < 1.8) // Tablet aspect ratio
    );
  }

  // Get device size category
  static getDeviceSize(): 'small' | 'medium' | 'large' {
    if (screenWidth < 375) return 'small';
    if (screenWidth < 414) return 'medium';
    return 'large';
  }

  // Get responsive values based on device size
  static getResponsiveValue<T>(values: { small: T; medium: T; large: T }): T {
    const size = this.getDeviceSize();
    return values[size];
  }
}

export default {
  SafeAreaUtils,
  IOSUtils,
  AndroidUtils,
  PlatformUtils,
  DeviceUtils,
  isIOS,
  isAndroid,
  isWeb,
  screenWidth,
  screenHeight,
}; 