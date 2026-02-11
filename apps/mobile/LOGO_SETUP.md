# Logo Setup Instructions

To use the AgroSoluce logo in the mobile app, you need to add it to the assets folder.

## Option 1: Copy from Web App (Recommended)

```bash
# From project root
cp apps/web/public/agrosoluce.png apps/mobile/assets/agrosoluce.png
```

Then update `BrandLogo.tsx` to use:
```typescript
const imageSource = require('../../assets/agrosoluce.png');
```

## Option 2: Use Remote URL

If the logo is hosted online, update `BrandLogo.tsx`:
```typescript
const imageSource = { uri: 'https://your-domain.com/agrosoluce.png' };
```

## Option 3: Bundle with App

For React Native, you can also bundle the logo:
1. Add to `android/app/src/main/res/drawable/` (Android)
2. Add to `ios/` assets catalog (iOS)
3. Use `Image.resolveAssetSource()` in component

---

**Current Status:** Logo file needs to be copied to `apps/mobile/assets/` folder.

