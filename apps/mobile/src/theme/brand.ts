/**
 * AgroSoluce Brand Assets
 * 
 * Official brand information and assets
 */

export const brand = {
  // Brand Name
  name: 'AgroSoluce',
  nameWithTM: 'AgroSoluce™',
  
  // Tagline
  tagline: 'Source Intelligence',
  taglineFull: 'Source Intelligence by ERMITS',
  
  // Logo
  logo: {
    // Logo image path
    // Option 1: Local asset (copy agrosoluce.png to assets/ folder)
    // imagePath: require('../../assets/agrosoluce.png'),
    
    // Option 2: Remote URL (if logo is hosted)
    // imageUrl: 'https://your-domain.com/agrosoluce.png',
    
    // Option 3: Use Image.resolveAssetSource() in component
    // See BrandLogo component for implementation
    
    // Logo dimensions (from web app: h-14 = 56px)
    defaultHeight: 56,
    // Note: width will be auto-calculated based on aspect ratio in React Native
    
    // Asset name for React Native Image.resolveAssetSource()
    assetName: 'agrosoluce', // Without extension
  },
  
  // Brand Colors (references to theme colors)
  brandColors: {
    primary: '#2E7D32',      // Main brand green
    primaryText: '#246628',   // Primary text color (primary-600)
    secondary: '#FF7900',     // Secondary orange
    accent: '#FFB300',        // Accent gold
  },
  
  // Typography for brand name
  brandTypography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontWeight: '700',    // Bold
    fontSize: 18,         // text-lg equivalent
  },
  
  // Tagline typography
  taglineTypography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontWeight: '400',    // Regular
    fontSize: 12,         // text-xs equivalent
  },
} as const;

// Type exports
export type Brand = typeof brand;

