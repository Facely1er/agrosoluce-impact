/**
 * AgroSoluce Design System - Colors
 * 
 * Official AgroSoluce brand colors from the web application
 * Matches Tailwind CSS config exactly
 * 
 * Brand Identity:
 * - Primary: Green (#2E7D32) - Main brand color
 * - Secondary: Orange (#FF7900) - Accent/CTA color
 * - Accent: Gold (#FFB300) - Highlight color
 */

export const colors = {
  // Primary - Green (AgroSoluce Main Brand Color)
  // Used for: Logo text, primary buttons, active states, brand elements
  primary: {
    50: '#f0f9f0',
    100: '#dcf2dc',
    200: '#bce4bc',
    300: '#8fcf8f',
    400: '#5ab35a',
    500: '#2E7D32', // Main brand color (used in borders, backgrounds)
    600: '#246628', // Primary text color (used for "AgroSoluce™" text)
    700: '#1f5322',
    800: '#1c421e',
    900: '#17371a',
  },

  // Secondary - Orange (AgroSoluce Accent Color)
  // Used for: Secondary buttons, CTAs, highlights
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#FF7900', // Main secondary color (used in buttons, CTAs)
    600: '#ea580c', // Hover state for secondary buttons
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Accent - Gold (Harvest, Prosperity)
  // Used for: Special highlights, warnings, success indicators
  accent: '#FFB300',

  // Semantic Colors
  success: '#2E7D32',
  warning: '#FFB300',
  error: '#d32f2f',
  info: '#0277BD',

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    cream: '#FFF8E1',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#FAFAFA',
    cream: '#FFF8E1',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
    link: '#2E7D32',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
} as const;

// Type exports for TypeScript
export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type SecondaryColor = keyof typeof colors.secondary;
export type NeutralColor = keyof typeof colors.neutral;

