/**
 * AgroSoluce Brand Logo Component (Web/PWA)
 * 
 * Displays the official AgroSoluce logo with brand name and tagline
 * Matches the web application's logo implementation
 */

import React, { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import styles from './BrandLogo.module.css';

export interface BrandLogoProps {
  /** Show tagline below logo */
  showTagline?: boolean;
  /** Logo height (default: 56px to match web) */
  height?: number;
  /** Show brand name text next to logo */
  showBrandName?: boolean;
  /** Custom logo source (if not using default) */
  logoSource?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showTagline = true,
  height = 56,
  showBrandName = true,
  logoSource,
}) => {
  const theme = useTheme();
  const logoUrl = logoSource || '/agrosoluce.png';
  const containerRef = useRef<HTMLDivElement>(null);

  // Set CSS custom properties programmatically to avoid inline styles
  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.setProperty('--logo-height', `${height}px`);
      element.style.setProperty('--brand-name-color', theme.colors.primary[600]);
      element.style.setProperty('--brand-name-font-size', `${theme.brand.brandTypography.fontSize}`);
      element.style.setProperty('--brand-name-font-weight', `${theme.brand.brandTypography.fontWeight}`);
      element.style.setProperty('--tagline-color', theme.colors.text.secondary);
      element.style.setProperty('--tagline-font-size', `${theme.brand.taglineTypography.fontSize}`);
    }
  }, [height, theme]);

  return (
    <div 
      ref={containerRef}
      className={styles.container}
    >
      <div className={styles.logoContainer}>
        {/* Logo Image */}
        <img
          src={logoUrl}
          alt="AgroSoluce Logo"
          className={styles.logo}
        />
        
        {/* Brand Name and Tagline */}
        {showBrandName && (
          <div className={styles.brandTextContainer}>
            <div className={styles.brandName}>
              {theme.brand.nameWithTM}
            </div>
            {showTagline && (
              <>
                <div className={styles.tagline}>
                  {theme.brand.tagline}
                </div>
                <div className={styles.tagline}>
                  {theme.brand.taglineFull.includes('by ') 
                    ? `by ${theme.brand.taglineFull.split('by ')[1]}` 
                    : 'by ERMITS'}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
