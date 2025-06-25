import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Notification behavior configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationData {
  type: 'order' | 'reward' | 'promotion' | 'system';
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

// Register for push notifications
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#f97316',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
      console.log('Push notification token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  return token;
};

// Check notification permissions
export const checkNotificationPermissions = async (): Promise<NotificationPermissionStatus> => {
  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  
  return {
    granted: status === 'granted',
    canAskAgain,
    status,
  };
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<NotificationPermissionStatus> => {
  const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
  
  return {
    granted: status === 'granted',
    canAskAgain,
    status,
  };
};

// Schedule local notification
export const scheduleLocalNotification = async (
  notification: PushNotificationData
): Promise<string> => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: {
        type: notification.type,
        id: notification.id,
        ...notification.data,
      },
      sound: true,
      color: '#f97316',
    },
    trigger: null, // immediate
  });

  return notificationId;
};

// Cancel notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Get badge count
export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

// Set badge count
export const setBadgeCount = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};

// Clear badge
export const clearBadge = async (): Promise<void> => {
  await Notifications.setBadgeCountAsync(0);
};

// Listen to notifications
export const addNotificationListener = (
  listener: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(listener);
};

// Listen to notification responses (when user taps notification)
export const addNotificationResponseListener = (
  listener: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(listener);
};

// Remove notification listeners
export const removeNotificationSubscription = (
  subscription: Notifications.Subscription
): void => {
  Notifications.removeNotificationSubscription(subscription);
};

// Context-specific notification functions
export const notifyOrderReady = async (orderId: string, orderItems: string): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'order',
    id: orderId,
    title: '🎉 Siparişiniz Hazır!',
    body: `${orderItems} hazır. Lütfen gelin ve alın.`,
    data: { orderId },
  });
};

export const notifyOrderConfirmed = async (orderId: string): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'order',
    id: orderId,
    title: '✅ Sipariş Onaylandı',
    body: 'Siparişiniz onaylandı ve hazırlanmaya başladı.',
    data: { orderId },
  });
};

export const notifyPointsEarned = async (points: number, orderId?: string): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'reward',
    id: orderId,
    title: '🎁 Puan Kazandınız!',
    body: `${points} puan kazandınız! Toplam puanınızı kontrol edin.`,
    data: { points, orderId },
  });
};

export const notifyRewardAvailable = async (rewardTitle: string, points: number): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'reward',
    title: '🏆 Yeni Ödül Kullanılabilir!',
    body: `${rewardTitle} için ${points} puanınız var. Hemen kullanın!`,
    data: { rewardTitle, points },
  });
};

export const notifyPromotion = async (title: string, description: string): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'promotion',
    title: `🏷️ ${title}`,
    body: description,
    data: { promotion: true },
  });
};

export const notifySystemUpdate = async (message: string): Promise<string> => {
  return await scheduleLocalNotification({
    type: 'system',
    title: '⚙️ Sistem Bildirimi',
    body: message,
    data: { system: true },
  });
};

// Schedule delayed notifications
export const scheduleOrderReminderNotification = async (
  orderId: string,
  delayMinutes: number = 30
): Promise<string> => {
  // Note: Bu örnekte immediate notification gönderiyoruz
  // Gelecekte Expo Notifications ile zamanlama entegrasyonu yapılabilir
  return await scheduleLocalNotification({
    type: 'order',
    id: orderId,
    title: '⏰ Sipariş Hatırlatması',
    body: 'Siparişinizin durumunu kontrol etmeyi unutmayın!',
    data: { orderId, reminder: true, delayMinutes },
  });
};

// Notification analytics
export const logNotificationInteraction = async (
  notificationId: string,
  action: 'opened' | 'dismissed'
): Promise<void> => {
  // Bu fonksiyon analytics sistemiyle entegre edilebilir
  console.log(`Notification ${notificationId} ${action}`);
};

export default {
  registerForPushNotificationsAsync,
  checkNotificationPermissions,
  requestNotificationPermissions,
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,
  getBadgeCount,
  setBadgeCount,
  clearBadge,
  addNotificationListener,
  addNotificationResponseListener,
  removeNotificationSubscription,
  notifyOrderReady,
  notifyOrderConfirmed,
  notifyPointsEarned,
  notifyRewardAvailable,
  notifyPromotion,
  notifySystemUpdate,
  scheduleOrderReminderNotification,
  logNotificationInteraction,
}; 