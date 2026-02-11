# Design System Alignment

**Status:** ✅ **ALIGNED** - Mobile app uses the official AgroSoluce brand colors and design system

**Note:** This theme uses the **exact brand colors** from the AgroSoluce web application, not generic design tokens.

---

## 🎨 Design Consistency

The mobile app theme system uses the **official AgroSoluce brand colors** from the web application's Tailwind CSS config, ensuring perfect brand consistency across platforms.

### Color Palette Alignment

| Design Token | Web (Tailwind) | Mobile (React Native) | Value |
|--------------|----------------|----------------------|-------|
| Primary | `primary-500` | `theme.colors.primary[500]` | `#2E7D32` |
| Primary Dark | `primary-700` | `theme.colors.primary[700]` | `#1f5322` |
| Secondary | `secondary-500` | `theme.colors.secondary[500]` | `#FF7900` |
| Accent | `accent` | `theme.colors.accent` | `#FFB300` |
| Success | `success` | `theme.colors.success` | `#2E7D32` |
| Warning | `warning` | `theme.colors.warning` | `#FFB300` |
| Error | `error` | `theme.colors.error` | `#d32f2f` |

### Typography Alignment

| Element | Web | Mobile | Size |
|---------|-----|--------|------|
| Display | `text-4xl font-extrabold` | `theme.typography.display` | 36px |
| Heading | `text-2xl font-bold` | `theme.typography.heading` | 24px |
| Subheading | `text-xl font-semibold` | `theme.typography.subheading` | 20px |
| Body | `text-base font-normal` | `theme.typography.body` | 16px |
| Small | `text-sm font-normal` | `theme.typography.bodySmall` | 14px |
| Caption | `text-xs font-normal` | `theme.typography.caption` | 12px |

### Spacing Alignment

| Web (Tailwind) | Mobile | Value |
|----------------|--------|-------|
| `p-1` / `m-1` | `theme.spacing[1]` | 4px |
| `p-2` / `m-2` | `theme.spacing[2]` | 8px |
| `p-4` / `m-4` | `theme.spacing[4]` | 16px |
| `p-6` / `m-6` | `theme.spacing[6]` | 24px |
| `p-8` / `m-8` | `theme.spacing[8]` | 32px |

### Border Radius Alignment

| Web (Tailwind) | Mobile | Value |
|----------------|--------|-------|
| `rounded-sm` | `theme.borderRadius.sm` | 4px |
| `rounded-md` | `theme.borderRadius.md` | 8px |
| `rounded-lg` | `theme.borderRadius.lg` | 12px |
| `rounded-xl` | `theme.borderRadius.xl` | 16px |
| `rounded-2xl` | `theme.borderRadius['2xl']` | 20px |

---

## 📁 Theme Structure

```
apps/mobile/src/theme/
├── colors.ts          # Color palette (matches web)
├── typography.ts      # Font system (adapted for mobile)
├── spacing.ts         # Spacing scale (matches web)
└── index.ts           # Main theme export
```

---

## 🔄 Migration from Old Colors

The original mobile app used "earth tones" (soil brown, terracotta, etc.). These have been replaced with the web app's design system:

### Old → New Mapping

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `earth.forest` (#1B5E20) | `primary[700]` (#1f5322) | ERMITS Team header |
| `earth.leaf` (#388E3C) | `primary[500]` (#2E7D32) | Cooperative header |
| `earth.terracotta` (#D84315) | `secondary[500]` (#FF7900) | Farmer header |
| `earth.wheat` (#F9A825) | `accent` (#FFB300) | Accents |
| `earth.sky` (#0277BD) | `info` (#0277BD) | Info/weather |

---

## ✅ Benefits

1. **Visual Consistency** - Same colors, spacing, and typography across platforms
2. **Maintainability** - Single source of truth for design tokens
3. **Brand Identity** - Consistent AgroSoluce branding
4. **Developer Experience** - Familiar design tokens for web developers

---

## 🚀 Usage Example

```typescript
import { useTheme } from '@/components/ThemeProvider';
import { View, Text, StyleSheet } from 'react-native';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing[4],
        borderRadius: theme.borderRadius.lg,
      }
    ]}>
      <Text style={[
        theme.typography.heading,
        { color: theme.colors.primary[500] }
      ]}>
        AgroSoluce
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.shadows.md, // Spread shadow styles
  },
});
```

---

**The mobile app now uses the same design system as the web app, ensuring perfect design consistency!** 🎨

