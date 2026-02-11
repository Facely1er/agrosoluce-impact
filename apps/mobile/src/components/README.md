# Mobile App Components

Shared components for the AgroSoluce Intelligence mobile app.

## Theme Integration

All components use the centralized theme system (`src/theme/`) which matches the web application's design system.

## Usage

```typescript
import { useTheme } from '@/components/ThemeProvider';
import { View, Text } from 'react-native';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4] 
    }}>
      <Text style={theme.typography.heading}>
        Heading Text
      </Text>
    </View>
  );
}
```

## Design Consistency

Components follow the same design tokens as the web app:
- Colors: Primary green (#2E7D32), Secondary orange (#FF7900)
- Typography: System fonts with consistent sizing
- Spacing: 4px base unit scale
- Shadows: Platform-appropriate elevation

