/**
 * AgroSoluce Design System - Main Theme Export
 * 
 * Official AgroSoluce brand theme matching the web application
 * Adapted for React Native with platform-specific optimizations
 * 
 * This theme uses the exact brand colors and design tokens from the
 * AgroSoluce web application (Tailwind CSS config)
 */

import { colors } from './colors';
import { typography, fontSizes, fontWeights, fontFamilies } from './typography';
import { spacing, spacingSemantic, borderRadius, shadows } from './spacing';
import { brand } from './brand';

export const theme = {
  colors,
  typography,
  fontSizes,
  fontWeights,
  fontFamilies,
  spacing,
  spacingSemantic,
  borderRadius,
  shadows,
  brand,
} as const;

// Re-export individual modules for convenience
export { colors } from './colors';
export { typography, fontSizes, fontWeights, fontFamilies } from './typography';
export { spacing, spacingSemantic, borderRadius, shadows } from './spacing';
export { brand } from './brand';

// Type exports
export type Theme = typeof theme;

// Default export
export default theme;

