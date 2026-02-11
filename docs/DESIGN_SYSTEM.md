# AgroSoluce Design System

**Version**: 1.0.0  
**Last Updated**: 2025-01-27

---

## Overview

The AgroSoluce Design System provides a consistent visual language and reusable components for building user interfaces across the platform. This system ensures consistency, accessibility, and maintainability.

---

## Design Tokens

### Colors

#### Primary Colors
- **Primary 50**: `#f0f9f0` - Lightest tint
- **Primary 100**: `#dcf2dc` - Very light tint
- **Primary 200**: `#bce4bc` - Light tint
- **Primary 300**: `#8fcf8f` - Medium-light tint
- **Primary 400**: `#5ab35a` - Medium tint
- **Primary 500**: `#2E7D32` - Main brand color (green)
- **Primary 600**: `#246628` - Primary text, hover states
- **Primary 700**: `#1f5322` - Dark variant
- **Primary 800**: `#1c421e` - Darker variant
- **Primary 900**: `#17371a` - Darkest variant

#### Secondary Colors
- **Secondary 50**: `#fff7ed` - Lightest tint
- **Secondary 100**: `#ffedd5` - Very light tint
- **Secondary 200**: `#fed7aa` - Light tint
- **Secondary 300**: `#fdba74` - Medium-light tint
- **Secondary 400**: `#fb923c` - Medium tint
- **Secondary 500**: `#FF7900` - Main secondary color (orange)
- **Secondary 600**: `#ea580c` - Hover state
- **Secondary 700**: `#c2410c` - Dark variant
- **Secondary 800**: `#9a3412` - Darker variant
- **Secondary 900**: `#7c2d12` - Darkest variant

#### Semantic Colors
- **Accent**: `#FFB300` - Gold accent color
- **Success**: `#2E7D32` - Success states (green)
- **Warning**: `#FFB300` - Warning states (gold)
- **Error**: `#d32f2f` - Error states (red)

#### Usage Guidelines
- Use primary colors for main actions, links, and brand elements
- Use secondary colors for accents and complementary actions
- Use semantic colors consistently for their intended purposes
- Ensure sufficient contrast ratios (WCAG AA minimum)

---

### Typography

#### Font Family
- **Primary**: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif

#### Font Sizes
- **Display**: `text-4xl` (36px) - `font-extrabold` - Hero headings
- **Heading 1**: `text-3xl` (30px) - `font-bold` - Page titles
- **Heading 2**: `text-2xl` (24px) - `font-bold` - Section titles
- **Heading 3**: `text-xl` (20px) - `font-semibold` - Subsection titles
- **Body Large**: `text-lg` (18px) - `font-normal` - Large body text
- **Body**: `text-base` (16px) - `font-normal` - Default body text
- **Small**: `text-sm` (14px) - `font-normal` - Small text, captions
- **Caption**: `text-xs` (12px) - `font-normal` - Fine print, labels

#### Line Heights
- **Tight**: `leading-tight` - Headings
- **Normal**: `leading-normal` - Body text
- **Relaxed**: `leading-relaxed` - Long-form content

---

### Spacing Scale

The spacing scale is based on a 4px base unit:

- **1**: 4px - `p-1`, `m-1`, `gap-1`
- **2**: 8px - `p-2`, `m-2`, `gap-2`
- **3**: 12px - `p-3`, `m-3`, `gap-3`
- **4**: 16px - `p-4`, `m-4`, `gap-4` - Default spacing
- **6**: 24px - `p-6`, `m-6`, `gap-6` - Card padding
- **8**: 32px - `p-8`, `m-8`, `gap-8` - Large spacing
- **12**: 48px - `p-12`, `m-12`, `gap-12` - Section spacing
- **16**: 64px - `p-16`, `m-16`, `gap-16` - Large section spacing
- **24**: 96px - `p-24`, `m-24`, `gap-24` - Hero section spacing

#### Usage Guidelines
- **Cards**: Use `p-6` for default padding, `p-8` for large cards
- **Sections**: Use `py-12` for default vertical spacing, `py-16` for large sections, `py-24` for hero sections
- **Gaps**: Use `gap-4` for default grid/flex gaps, `gap-6` for larger gaps

---

### Border Radius

- **sm**: 4px - `rounded-sm` - Small elements
- **md**: 8px - `rounded-md` - Medium elements
- **lg**: 12px - `rounded-lg` - Buttons, default elements
- **xl**: 16px - `rounded-xl` - Cards, containers (default)
- **2xl**: 20px - `rounded-2xl` - Large cards
- **full**: 9999px - `rounded-full` - Badges, pills, avatars

#### Usage Guidelines
- **Cards**: Use `rounded-xl` (16px)
- **Buttons**: Use `rounded-lg` (12px)
- **Badges**: Use `rounded-full`
- **Small elements**: Use `rounded-md` (8px)

---

### Shadows

- **sm**: `shadow-sm` - `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- **md**: `shadow-md` - `0 4px 6px -1px rgba(0, 0, 0, 0.1)` - Default cards
- **lg**: `shadow-lg` - `0 10px 15px -3px rgba(0, 0, 0, 0.1)` - Elevated cards
- **xl**: `shadow-xl` - `0 20px 25px -5px rgba(0, 0, 0, 0.1)` - Hover states, modals

#### Usage Guidelines
- **Default cards**: Use `shadow-md`
- **Elevated cards**: Use `shadow-lg`
- **Hover states**: Use `shadow-xl`
- **Subtle elements**: Use `shadow-sm`

---

### Animations & Transitions

#### Transitions
- **Default**: `transition-all duration-200` - Standard transitions
- **Fast**: `transition-all duration-150` - Quick interactions
- **Slow**: `transition-all duration-300` - Smooth animations

#### Animations
- **Fade In**: `animate-fade-in` - 0.5s ease-in-out
- **Slide Up**: `animate-slide-up` - 0.5s ease-out
- **Slide Down**: `animate-slide-down` - 0.5s ease-out

#### Usage Guidelines
- Use transitions for hover states and interactive elements
- Use animations sparingly for emphasis
- Keep animation durations under 500ms for better UX

---

## Component Patterns

### Buttons

#### Variants
- **Primary**: Main actions, CTAs
- **Secondary**: Secondary actions, alternative CTAs
- **Outline**: Tertiary actions, less emphasis
- **Ghost**: Subtle actions, minimal emphasis
- **Danger**: Destructive actions

#### Sizes
- **sm**: Small buttons (px-4 py-2)
- **md**: Default buttons (px-6 py-3)
- **lg**: Large buttons (px-8 py-4)

### Cards

#### Variants
- **Default**: Standard card with border and shadow
- **Accent**: Card with left border accent
- **Elevated**: Card with stronger shadow
- **Gradient**: Card with gradient background

### Badges

#### Variants
- **Success**: Green - Completed, active states
- **Warning**: Yellow - Pending, caution states
- **Error**: Red - Error, failed states
- **Info**: Blue - Informational states
- **Primary**: Primary color - Brand-related badges
- **Secondary**: Secondary color - Accent badges

### Alerts

#### Variants
- **Success**: Green - Success messages
- **Error**: Red - Error messages
- **Warning**: Yellow - Warning messages
- **Info**: Blue - Informational messages

---

## Accessibility Guidelines

### Color Contrast
- All text must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have clear focus states
- Use color in combination with icons or text, not alone

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators must be visible (2px ring)
- Logical tab order throughout the interface

### Screen Readers
- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure form inputs have associated labels
- Use proper heading hierarchy (h1 → h2 → h3)

### Focus States
- All interactive elements must have visible focus states
- Use `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2` pattern
- Ensure focus states are clearly visible

---

## Responsive Design

### Breakpoints
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Small desktops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large desktops

### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Use responsive utilities: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on multiple device sizes

---

## Best Practices

### Do's
✅ Use design system components instead of custom styles  
✅ Follow spacing scale consistently  
✅ Use semantic color variants  
✅ Ensure accessibility compliance  
✅ Test responsive behavior  
✅ Use consistent border radius values  
✅ Apply shadows according to elevation hierarchy  

### Don'ts
❌ Don't create custom button styles - use Button component  
❌ Don't use arbitrary spacing values - use the scale  
❌ Don't mix shadow patterns - follow the hierarchy  
❌ Don't ignore accessibility requirements  
❌ Don't use colors alone to convey information  
❌ Don't skip focus states on interactive elements  

---

## Implementation

### Using Components

```tsx
import { Button, Card, Badge, Alert } from '@/components/ui';

// Button
<Button variant="primary" size="md">Click me</Button>

// Card
<Card variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Badge
<Badge variant="success">Active</Badge>

// Alert
<Alert variant="error" title="Error">Something went wrong</Alert>
```

### Customization

Components can be customized using the `className` prop:

```tsx
<Button variant="primary" className="w-full">
  Full width button
</Button>
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Component Library Documentation](./COMPONENT_LIBRARY.md)

---

**Status**: Active - Version 1.0.0

