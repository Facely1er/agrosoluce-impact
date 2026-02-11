/**
 * Theme Provider Component
 * 
 * Provides theme context to all components
 * Ensures design consistency across the mobile app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from '../theme';

// Create context without default value to properly detect provider usage
const ThemeContext = createContext<Theme | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  customTheme 
}) => {
  const mergedTheme = customTheme 
    ? { ...theme, ...customTheme } 
    : theme;

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;

