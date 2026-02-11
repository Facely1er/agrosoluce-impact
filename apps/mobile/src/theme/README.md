# AgroSoluce Mobile Theme

This theme system matches the web application's design system (Tailwind CSS) and adapts it for React Native.

## Design Consistency

### Colors
- **Primary (Green)**: `#2E7D32` - Agricultural/leaf green (matches web `primary-500`)
- **Secondary (Orange)**: `#FF7900` - Warm, accessible (matches web `secondary-500`)
- **Accent (Gold)**: `#FFB300` - Harvest, prosperity (matches web `accent`)
- **Semantic Colors**: Success, Warning, Error, Info

### Typography
- **Font Family**: System fonts (SF Pro on iOS, Roboto on Android)
- **Font Sizes**: Matches web app scale (12px to 48px)
- **Font Weights**: Light (300) to Extrabold (800)

### Spacing
- **Base Unit**: 4px (matching Tailwind's spacing scale)
- **Scale**: 0, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96px

## Usage

```typescript
import { theme } from '@/theme';

// Colors
const primaryColor = theme.colors.primary[500];
const backgroundColor = theme.colors.background.primary;

// Typography
const headingStyle = theme.typography.heading;

// Spacing
const padding = theme.spacing[4]; // 16px
const margin = theme.spacingSemantic.lg; // 24px

// Border Radius
const borderRadius = theme.borderRadius.lg; // 12px

// Shadows
const cardShadow = theme.shadows.md;
```

## Design Tokens Alignment

| Web (Tailwind) | Mobile (React Native) | Value |
|----------------|----------------------|-------|
| `primary-500` | `colors.primary[500]` | `#2E7D32` |
| `secondary-500` | `colors.secondary[500]` | `#FF7900` |
| `accent` | `colors.accent` | `#FFB300` |
| `text-lg` | `typography.subheading` | 20px |
| `p-4` | `spacing[4]` | 16px |
| `rounded-lg` | `borderRadius.lg` | 12px |

## Platform Adaptations

- **Fonts**: Uses system fonts (better performance, native feel)
- **Shadows**: Uses elevation for Android, shadow for iOS
- **Colors**: Same hex values, ensuring visual consistency

