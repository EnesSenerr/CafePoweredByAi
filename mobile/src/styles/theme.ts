import { colors } from './colors';

// Typography
export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.coffee[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  base: {
    shadowColor: colors.coffee[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.coffee[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.coffee[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Component styles
export const components = {
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    ...shadows.base,
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.coffee[600],
      borderRadius: borderRadius.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
      ...shadows.sm,
    },
    secondary: {
      backgroundColor: colors.cream[100],
      borderWidth: 1,
      borderColor: colors.coffee[300],
      borderRadius: borderRadius.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
    },
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.coffee[300],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  
  // Header styles
  header: {
    backgroundColor: colors.coffee[700],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...shadows.sm,
  },
};

// Common layout styles
export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  padding: {
    horizontal: spacing.xl,
    vertical: spacing.lg,
  },
  
  margin: {
    bottom: spacing.lg,
  },
  
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    margin: spacing.lg,
    ...shadows.base,
  },
};

// Coffee-themed gradients (for future use when expo-linear-gradient is fixed)
export const gradients = {
  coffee: {
    colors: [colors.coffee[600], colors.coffee[700]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  cream: {
    colors: [colors.cream[100], colors.cream[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  warm: {
    colors: [colors.coffee[100], colors.cream[50], colors.coffee[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  layout,
  gradients,
};

export default theme; 