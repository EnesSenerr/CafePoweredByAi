import * as Haptics from 'expo-haptics';

// Haptic Feedback Types
export enum HapticFeedbackType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SELECTION = 'selection',
}

// Basic Haptic Feedback Functions
export const lightHaptic = async (): Promise<void> => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

export const mediumHaptic = async (): Promise<void> => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

export const heavyHaptic = async (): Promise<void> => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

// Notification Haptic Feedback
export const successHaptic = async (): Promise<void> => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

export const warningHaptic = async (): Promise<void> => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

export const errorHaptic = async (): Promise<void> => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

// Selection Haptic Feedback
export const selectionHaptic = async (): Promise<void> => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

// Unified Haptic Function
export const triggerHaptic = async (type: HapticFeedbackType): Promise<void> => {
  switch (type) {
    case HapticFeedbackType.LIGHT:
      await lightHaptic();
      break;
    case HapticFeedbackType.MEDIUM:
      await mediumHaptic();
      break;
    case HapticFeedbackType.HEAVY:
      await heavyHaptic();
      break;
    case HapticFeedbackType.SUCCESS:
      await successHaptic();
      break;
    case HapticFeedbackType.WARNING:
      await warningHaptic();
      break;
    case HapticFeedbackType.ERROR:
      await errorHaptic();
      break;
    case HapticFeedbackType.SELECTION:
      await selectionHaptic();
      break;
    default:
      await lightHaptic();
  }
};

// Context-specific Haptic Functions
export const buttonPressHaptic = async (): Promise<void> => {
  await lightHaptic();
};

export const tabSwitchHaptic = async (): Promise<void> => {
  await selectionHaptic();
};

export const pullToRefreshHaptic = async (): Promise<void> => {
  await mediumHaptic();
};

export const orderSuccessHaptic = async (): Promise<void> => {
  await successHaptic();
};

export const orderErrorHaptic = async (): Promise<void> => {
  await errorHaptic();
};

export const pointsEarnedHaptic = async (): Promise<void> => {
  await successHaptic();
};

export const rewardClaimedHaptic = async (): Promise<void> => {
  await successHaptic();
};

export const notificationHaptic = async (): Promise<void> => {
  await mediumHaptic();
};

// Check if haptics are supported
export const isHapticsSupported = (): boolean => {
  return Haptics.impactAsync !== undefined;
};

// Custom haptic patterns
export const doubleHaptic = async (
  intensity: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
  delay: number = 100
): Promise<void> => {
  try {
    await Haptics.impactAsync(intensity);
    setTimeout(async () => {
      await Haptics.impactAsync(intensity);
    }, delay);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

export const tripleHaptic = async (
  intensity: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
  delay: number = 100
): Promise<void> => {
  try {
    await Haptics.impactAsync(intensity);
    setTimeout(async () => {
      await Haptics.impactAsync(intensity);
      setTimeout(async () => {
        await Haptics.impactAsync(intensity);
      }, delay);
    }, delay);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
}; 