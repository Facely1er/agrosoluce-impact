# AgroSoluce Brand Guidelines

**Status:** ✅ **ALIGNED** - Mobile app uses official AgroSoluce brand colors and assets

---

## 🎨 Official Brand Colors

### Primary Color - Green
- **Main Brand Color**: `#2E7D32` (primary-500)
- **Primary Text**: `#246628` (primary-600) - Used for "AgroSoluce™" text
- **Usage**: Logo text, primary buttons, active states, brand elements

### Secondary Color - Orange
- **Main Secondary**: `#FF7900` (secondary-500)
- **Hover State**: `#ea580c` (secondary-600)
- **Usage**: Secondary buttons, CTAs, highlights

### Accent Color - Gold
- **Accent**: `#FFB300`
- **Usage**: Special highlights, warnings, success indicators

---

## 🏷️ Brand Identity

### Brand Name
- **Full Name**: `AgroSoluce™`
- **Tagline**: `Source Intelligence`
- **Full Tagline**: `Source Intelligence by ERMITS`

### Logo
- **File**: `agrosoluce.png`
- **Default Height**: 56px (matches web app)
- **Location**: Should be in `assets/` folder for React Native

---

## 📐 Typography

### Brand Name Typography
- **Font**: System font (SF Pro on iOS, Roboto on Android)
- **Weight**: Bold (700)
- **Size**: 18px (text-lg equivalent)
- **Color**: `#246628` (primary-600)

### Tagline Typography
- **Font**: System font
- **Weight**: Regular (400)
- **Size**: 12px (text-xs equivalent)
- **Color**: Gray-500 (`#9E9E9E`)

---

## ✅ Theme Integration

The mobile app theme (`src/theme/`) uses the **exact same colors** as the web application:

| Element | Web App | Mobile App | Status |
|---------|---------|------------|--------|
| Primary Brand | `#2E7D32` | `theme.colors.primary[500]` | ✅ Matched |
| Primary Text | `#246628` | `theme.colors.primary[600]` | ✅ Matched |
| Secondary | `#FF7900` | `theme.colors.secondary[500]` | ✅ Matched |
| Accent | `#FFB300` | `theme.colors.accent` | ✅ Matched |

---

## 🚀 Usage

### Using Brand Logo Component

```typescript
import { BrandLogo } from '@/components/BrandLogo';

function MyHeader() {
  return (
    <BrandLogo 
      showTagline={true}
      height={56}
      showBrandName={true}
    />
  );
}
```

### Using Brand Colors

```typescript
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.primary[500], // #2E7D32
    }}>
      <Text style={{
        color: theme.colors.primary[600], // #246628 - brand text color
      }}>
        {theme.brand.nameWithTM} {/* AgroSoluce™ */}
      </Text>
    </View>
  );
}
```

---

## 📋 Logo Setup

To use the logo in React Native:

1. **Copy logo to assets:**
   ```bash
   # Copy from web app public folder
   cp apps/web/public/agrosoluce.png apps/mobile/assets/
   ```

2. **Or use remote URL:**
   ```typescript
   <Image 
     source={{ uri: 'https://your-domain.com/agrosoluce.png' }}
     style={{ height: 56 }}
   />
   ```

---

**The mobile app now uses the official AgroSoluce brand colors and assets!** 🎨

