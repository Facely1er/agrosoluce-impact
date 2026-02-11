/**
 * AgroSoluce Design System - Typography
 * 
 * Matches the web application's Inter font family
 * Web-optimized for PWA
 */

// Font families - Web fonts
export const fontFamilies = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

// Font weights (React Native accepts string or number)
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// Type for React Native fontWeight
export type FontWeightValue = '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

// Font sizes (matching web app scale)
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

// Line heights
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Typography presets
export const typography = {
  // Display - Large headings
  display: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.extrabold,
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },

  // Heading - Section titles
  heading: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },

  // Subheading
  subheading: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },

  // Body - Regular text
  body: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },

  // Body Small
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },

  // Caption - Small text
  caption: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },

  // Label - Form labels
  label: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },

  // Mono - Code/numbers
  mono: {
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
} as const;

// Type exports
export type TypographyVariant = keyof typeof typography;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;

