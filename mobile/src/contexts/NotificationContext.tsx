import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { 
  registerForPushNotificationsAsync,
  addNotificationResponseListener,
  setBadgeCount,
  clearBadge
} from '../services/notifications';

interface NotificationContextType {
  expoPushToken: string | null;
  isNotificationEnabled: boolean;
  badgeCount: number;
  enableNotifications: () => Promise<void>;
  clearNotificationBadge: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [badgeCount, setBadgeCountState] = useState(0);
  const navigation = useNavigation<any>();

  useEffect(() => {
    initializeNotifications();
    
    // Listen for notification responses (when user taps notification)
    const responseSubscription = addNotificationResponseListener((response) => {
      handleNotificationResponse(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        setIsNotificationEnabled(true);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const enableNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        setIsNotificationEnabled(true);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const { data } = response.notification.request.content;
    
    console.log('Notification tapped:', data);

    // Navigate based on notification type
    if (data?.type === 'order' && data?.orderId) {
      navigation.navigate('OrderDetail', { orderId: data.orderId });
    } else if (data?.type === 'reward') {
      navigation.navigate('Profile'); // or rewards page
    } else if (data?.type === 'promotion') {
      navigation.navigate('Menu');
    }

    // Clear badge when notification is tapped
    clearNotificationBadge();
  };

  const clearNotificationBadge = async () => {
    try {
      await clearBadge();
      setBadgeCountState(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  };

  const value: NotificationContextType = {
    expoPushToken,
    isNotificationEnabled,
    badgeCount,
    enableNotifications,
    clearNotificationBadge,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 