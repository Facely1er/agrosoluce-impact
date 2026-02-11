# AgroSoluce Component Library

**Version**: 1.0.0  
**Last Updated**: 2025-01-27

---

## Overview

This document provides comprehensive documentation for all reusable UI components in the AgroSoluce design system. Each component includes usage examples, props documentation, and best practices.

---

## Button

A versatile button component with multiple variants and sizes.

### Import

```tsx
import { Button } from '@/components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button content |

### Variants

- **primary**: Main brand color, for primary actions
- **secondary**: White with primary border, for secondary actions
- **outline**: Transparent with border, for tertiary actions
- **ghost**: Minimal styling, for subtle actions
- **danger**: Red color, for destructive actions

### Examples

```tsx
// Primary button
<Button variant="primary" size="md">
  Submit
</Button>

// Secondary button
<Button variant="secondary" size="lg">
  Cancel
</Button>

// Loading state
<Button variant="primary" isLoading>
  Processing...
</Button>

// Disabled state
<Button variant="primary" disabled>
  Disabled
</Button>

// With icon
<Button variant="primary">
  <ArrowRight className="mr-2" />
  Next
</Button>
```

---

## Card

A flexible card component with multiple variants and sub-components.

### Import

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
```

### Props

#### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'accent' \| 'elevated' \| 'gradient'` | `'default'` | Card style variant |
| `accentColor` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Accent border color (for accent variant) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Card content |

#### CardHeader, CardContent, CardFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Content |

### Variants

- **default**: Standard card with border and shadow
- **accent**: Card with colored left border accent
- **elevated**: Card with stronger shadow for emphasis
- **gradient**: Card with gradient background

### Examples

```tsx
// Default card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Accent card
<Card variant="accent" accentColor="primary">
  <CardContent>
    Content with primary accent border
  </CardContent>
</Card>

// Elevated card
<Card variant="elevated">
  <CardContent>
    Content with elevated shadow
  </CardContent>
</Card>

// Gradient card
<Card variant="gradient">
  <CardContent className="text-white">
    Content with gradient background
  </CardContent>
</Card>
```

---

## Badge

A small badge component for status indicators and labels.

### Import

```tsx
import { Badge } from '@/components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'primary' \| 'secondary'` | `'primary'` | Badge color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Badge content |

### Variants

- **success**: Green - Completed, active states
- **warning**: Yellow - Pending, caution states
- **error**: Red - Error, failed states
- **info**: Blue - Informational states
- **primary**: Primary color - Brand-related badges
- **secondary**: Secondary color - Accent badges

### Examples

```tsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>

// Sizes
<Badge variant="primary" size="sm">Small</Badge>
<Badge variant="primary" size="md">Medium</Badge>
<Badge variant="primary" size="lg">Large</Badge>

// With icons
<Badge variant="success">
  <CheckCircle className="mr-1 h-3 w-3" />
  Verified
</Badge>
```

---

## Alert

An alert component for displaying important messages to users.

### Import

```tsx
import { Alert } from '@/components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Alert style variant |
| `title` | `string` | - | Optional alert title |
| `onClose` | `() => void` | - | Optional close handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Alert message content |

### Variants

- **success**: Green - Success messages
- **error**: Red - Error messages
- **warning**: Yellow - Warning messages
- **info**: Blue - Informational messages

### Examples

```tsx
// Simple alert
<Alert variant="info">
  This is an informational message
</Alert>

// Alert with title
<Alert variant="error" title="Error">
  Something went wrong. Please try again.
</Alert>

// Dismissible alert
const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <Alert variant="success" title="Success" onClose={() => setShowAlert(false)}>
    Your changes have been saved.
  </Alert>
)}

// Warning alert
<Alert variant="warning" title="Warning">
  This action cannot be undone.
</Alert>
```

---

## LoadingSpinner

A loading spinner component for indicating loading states.

### Import

```tsx
import { LoadingSpinner } from '@/components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size |
| `variant` | `'primary' \| 'secondary' \| 'white'` | `'primary'` | Spinner color |
| `text` | `string` | - | Optional loading text |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic spinner
<LoadingSpinner />

// With text
<LoadingSpinner text="Loading..." />

// Different sizes
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />

// Different variants
<LoadingSpinner variant="primary" />
<LoadingSpinner variant="secondary" />
<LoadingSpinner variant="white" />

// Full page loading
<div className="min-h-screen flex items-center justify-center">
  <LoadingSpinner size="lg" text="Loading page..." />
</div>
```

---

## Input

A form input component with label, error, and helper text support.

### Import

```tsx
import { Input } from '@/components/ui';
```

### Props

Extends all standard HTML input props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text below input |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic input
<Input
  type="text"
  placeholder="Enter your name"
/>

// With label
<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
/>

// With error
<Input
  label="Email"
  type="email"
  error="Please enter a valid email address"
/>

// With helper text
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>

// Required field
<Input
  label="Username"
  type="text"
  required
/>
```

---

## Textarea

A textarea component with label, error, and helper text support.

### Import

```tsx
import { Textarea } from '@/components/ui';
```

### Props

Extends all standard HTML textarea props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Textarea label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text below textarea |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic textarea
<Textarea
  placeholder="Enter your message"
  rows={4}
/>

// With label
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={5}
/>

// With error
<Textarea
  label="Comments"
  error="Comments must be at least 10 characters"
/>

// With helper text
<Textarea
  label="Feedback"
  helperText="Please provide detailed feedback"
  rows={6}
/>
```

---

## Select

A select dropdown component with label, error, and helper text support.

### Import

```tsx
import { Select } from '@/components/ui';
```

### Props

Extends all standard HTML select props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text below select |
| `options` | `Array<{ value: string; label: string }>` | - | Select options |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic select
<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>

// With label
<Select
  label="Country"
  options={[
    { value: 'ci', label: 'Côte d\'Ivoire' },
    { value: 'gh', label: 'Ghana' },
  ]}
/>

// With error
<Select
  label="Commodity"
  error="Please select a commodity"
  options={[
    { value: 'cocoa', label: 'Cocoa' },
    { value: 'coffee', label: 'Coffee' },
  ]}
/>

// With default value
<Select
  label="Status"
  defaultValue="active"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
/>
```

---

## Best Practices

### Component Composition

Use sub-components for better structure:

```tsx
// Good: Using Card sub-components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid: Manual structure
<div className="card">
  <div className="card-header">Title</div>
  <div className="card-content">Content</div>
</div>
```

### Accessibility

Always provide labels for form inputs:

```tsx
// Good
<Input label="Email" type="email" />

// Avoid
<input type="email" placeholder="Email" />
```

### Error Handling

Use the built-in error prop:

```tsx
// Good
<Input
  label="Email"
  error={errors.email}
/>

// Avoid
<Input label="Email" />
{errors.email && <div className="error">{errors.email}</div>}
```

### Loading States

Use the LoadingSpinner component:

```tsx
// Good
{loading ? (
  <LoadingSpinner text="Loading..." />
) : (
  <Content />
)}

// Avoid
{loading && <div>Loading...</div>}
```

---

## Migration Guide

### Replacing Inline Buttons

**Before:**
```tsx
<button className="bg-primary-600 text-white px-6 py-3 rounded-lg">
  Click me
</button>
```

**After:**
```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Replacing Inline Cards

**Before:**
```tsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  Content
</div>
```

**After:**
```tsx
<Card>
  <CardContent>Content</CardContent>
</Card>
```

### Replacing Inline Alerts

**Before:**
```tsx
<div className="bg-red-50 border border-red-200 rounded-xl p-4">
  Error message
</div>
```

**After:**
```tsx
<Alert variant="error">Error message</Alert>
```

---

## Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Component Source Code](../apps/web/src/components/ui/)

---

**Status**: Active - Version 1.0.0

