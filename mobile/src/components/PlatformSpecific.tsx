import React, { useEffect } from 'react';
import { Platform, BackHandler, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Android Back Button Handler Component
export const AndroidBackHandler: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        // If we can go back in navigation stack
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // Prevent default behavior
        }

        // If on main screen, show exit confirmation
        Alert.alert(
          'Çıkış',
          'Uygulamadan çıkmak istediğinizden emin misiniz?',
          [
            {
              text: 'İptal',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Çıkış',
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }
  }, [navigation]);

  return null; // This is a behavior component, renders nothing
};

// Platform Safe Area Component
export const PlatformSafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerStyle: any = {
    flex: 1,
    backgroundColor: '#ffffff',
  };

  // Add platform-specific padding
  if (Platform.OS === 'ios') {
    // iOS safe area handling (simplified)
    containerStyle.paddingTop = 44; // Status bar + safe area
  } else if (Platform.OS === 'android') {
    // Android status bar handling
    const { StatusBar } = require('react-native');
    containerStyle.paddingTop = StatusBar.currentHeight || 0;
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

// Platform-specific permissions handler
export const requestAndroidPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't need these permissions
  }

  try {
    const { PermissionsAndroid } = require('react-native');
    
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);
    
    return Object.values(results).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (error) {
    console.error('Android permission request failed:', error);
    return false;
  }
};

// iOS-specific status bar configuration
export const getIOSStatusBarConfig = () => {
  if (Platform.OS === 'ios') {
    return {
      barStyle: 'light-content' as const,
      backgroundColor: '#f97316',
    };
  }
  return {
    barStyle: 'default' as const,
    backgroundColor: '#ea580c',
  };
};

export default {
  AndroidBackHandler,
  PlatformSafeArea,
  requestAndroidPermissions,
  getIOSStatusBarConfig,
}; 