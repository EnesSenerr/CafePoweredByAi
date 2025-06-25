import { Animated, Easing } from 'react-native';

// Animation Duration Constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Easing Functions
export const EASING = {
  LINEAR: Easing.linear,
  EASE_IN: Easing.in(Easing.quad),
  EASE_OUT: Easing.out(Easing.quad),
  EASE_IN_OUT: Easing.inOut(Easing.quad),
  BOUNCE: Easing.bounce,
  ELASTIC: Easing.elastic(1),
};

// Fade Animation
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 1,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_IN,
    useNativeDriver: true,
  });
};

// Scale Animation
export const scaleIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 1,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

export const scaleOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_IN,
    useNativeDriver: true,
  });
};

// Slide Animation
export const slideInFromLeft = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

export const slideInFromRight = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

export const slideInFromTop = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

export const slideInFromBottom = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  });
};

// Rotation Animation
export const rotate = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 1,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    delay,
    easing: EASING.LINEAR,
    useNativeDriver: true,
  });
};

// Spring Animation
export const spring = (
  animatedValue: Animated.Value,
  toValue: number,
  tension: number = 40,
  friction: number = 7,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    tension,
    friction,
    delay,
    useNativeDriver: true,
  });
};

// Pulse Animation (repeating)
export const pulse = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.SLOW,
  minValue: number = 0.8,
  maxValue: number = 1.2
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      }),
    ])
  );
};

// Shake Animation
export const shake = (
  animatedValue: Animated.Value,
  duration: number = 500,
  intensity: number = 10
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 8,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: duration / 4,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 4,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: duration / 4,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: duration / 8,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    }),
  ]);
};

// Combined Animations
export const fadeInAndSlideUp = (
  fadeValue: Animated.Value,
  slideValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.parallel([
    fadeIn(fadeValue, duration, 1, delay),
    slideInFromBottom(slideValue, duration, 0, delay),
  ]);
};

export const fadeOutAndSlideDown = (
  fadeValue: Animated.Value,
  slideValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.parallel([
    fadeOut(fadeValue, duration, 0, delay),
    Animated.timing(slideValue, {
      toValue: 50,
      duration,
      delay,
      easing: EASING.EASE_IN,
      useNativeDriver: true,
    }),
  ]);
};

// Staggered Animation (for lists)
export const staggerAnimation = (
  animatedValues: Animated.Value[],
  animation: (value: Animated.Value, delay: number) => Animated.CompositeAnimation,
  staggerDelay: number = 100
): Animated.CompositeAnimation => {
  const animations = animatedValues.map((value, index) =>
    animation(value, index * staggerDelay)
  );
  
  return Animated.parallel(animations);
};

// Button Press Animation
export const buttonPress = (
  scaleValue: Animated.Value,
  callback?: () => void
): void => {
  Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: ANIMATION_DURATION.FAST,
      easing: EASING.EASE_OUT,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.FAST,
      easing: EASING.EASE_OUT,
      useNativeDriver: true,
    }),
  ]).start(() => {
    if (callback) callback();
  });
};

// Utility function to create initial animated values
export const createAnimatedValue = (initialValue: number = 0): Animated.Value => {
  return new Animated.Value(initialValue);
};

// Utility function to interpolate animated values
export const interpolate = (
  animatedValue: Animated.Value,
  inputRange: number[],
  outputRange: number[] | string[]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
}; 