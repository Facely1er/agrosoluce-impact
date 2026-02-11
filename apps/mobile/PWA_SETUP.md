# AgroSoluce Mobile App - PWA Setup

## ✅ PWA Configuration Complete

The mobile app is now configured as a **Progressive Web App (PWA)** that is completely separate from the main web application.

## 🎯 Purpose

**This mobile app serves a DIFFERENT purpose than the web app:**
- **Mobile App**: Field Intelligence & Operations Platform (ERMITS team, cooperative managers, farmers)
- **Web App**: B2B Marketplace Platform (buyers, cooperatives, directory)

See `PURPOSE.md` for detailed comparison.

## 🎯 Key Features

- ✅ **Separate Build System**: Uses Vite (different from web app)
- ✅ **Different Port**: Runs on port 5174 (web app uses 5173)
- ✅ **PWA Manifest**: Configured with AgroSoluce branding
- ✅ **Service Worker**: Auto-updating service worker for offline support
- ✅ **Theme Integration**: Uses AgroSoluce brand colors and design system
- ✅ **Isolated Dependencies**: Own `package.json` and `node_modules`

## 🚀 Quick Start

```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Access the PWA

- **Development**: http://localhost:5174
- **Production**: Deploy the `dist/` folder to any static hosting

## 📦 Installation as PWA

### On Mobile Devices:

1. **Chrome (Android)**:
   - Open the app in Chrome
   - Tap the menu (3 dots) → "Add to Home Screen"
   - App will install and work offline

2. **Safari (iOS)**:
   - Open the app in Safari
   - Tap the Share button → "Add to Home Screen"
   - App will install and work offline

### On Desktop:

1. **Chrome/Edge**:
   - Look for install icon in address bar
   - Click to install as desktop app

## 🎨 Brand Integration

The PWA uses the official AgroSoluce brand:
- **Primary Color**: `#2E7D32` (Green)
- **Secondary Color**: `#FF7900` (Orange)
- **Accent Color**: `#FFB300` (Gold)
- **Logo**: `/agrosoluce.png`
- **Theme**: Matches web app design system

## 📁 Project Structure

```
apps/mobile/
├── src/
│   ├── components/
│   │   ├── BrandLogo.tsx      # Web-compatible logo component
│   │   └── ThemeProvider.tsx   # Theme context provider
│   ├── theme/                  # Design system (colors, typography, spacing)
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── agrosoluce.png          # Logo asset
├── vite.config.ts              # Vite + PWA configuration
├── package.json                # PWA dependencies
└── index.html                  # HTML entry with PWA meta tags
```

## 🔒 Isolation from Main Web App

- ✅ **Separate package.json** - No dependency conflicts
- ✅ **Separate TypeScript config** - Independent compilation
- ✅ **Different port** - Runs on 5174 (web app on 5173)
- ✅ **Separate build output** - Builds to `dist/` (web app builds to `build/`)
- ✅ **Not included in root builds** - Root `package.json` doesn't reference mobile

## 🛠️ PWA Features

### Service Worker
- Auto-updating service worker
- Offline support
- Asset caching
- API response caching (Supabase)

### Manifest
- Standalone display mode
- Portrait orientation
- App shortcuts
- Brand icons

### Caching Strategy
- **Static Assets**: Cache first
- **API Calls**: Network first with fallback
- **Images**: Cache first (30 days)

## 📝 Next Steps

1. **Add Screens**: Implement ERMITS, Cooperative, and Farmer screens
2. **Add Routing**: Set up React Router for navigation
3. **Add API Integration**: Connect to Supabase backend
4. **Add Offline Features**: Implement offline data sync
5. **Add Push Notifications**: Optional PWA push notifications

## 🐛 Troubleshooting

### Service Worker Not Registering
- Clear browser cache
- Check browser console for errors
- Ensure HTTPS in production (required for service workers)

### Logo Not Showing
- Verify `public/agrosoluce.png` exists
- Check browser console for 404 errors
- Ensure logo path is correct in manifest

### Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📚 Resources

- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

