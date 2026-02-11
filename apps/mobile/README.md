# AgroSoluce Intelligence Mobile App (PWA)

**Status:** Development in Progress  
**Platform:** Progressive Web App (PWA)  
**Type:** Three-Tier Mobile Intelligence Platform  
**Technology:** React + Vite + PWA

---

## 🎯 Purpose & Scope

**This mobile app serves a DIFFERENT purpose than the web application:**

### Web App (apps/web)
- **Purpose**: B2B Marketplace Platform
- **Users**: Buyers, Cooperatives (web interface)
- **Features**: Directory browsing, buyer portal, cooperative profiles, marketplace transactions
- **Use Case**: Desktop/web-based trading platform

### Mobile App (apps/mobile) 
- **Purpose**: Field Intelligence & Operations Platform
- **Users**: ERMITS Team, Cooperative Managers, Farmers
- **Features**: 
  - **ERMITS Command Center**: Real-time monitoring, compliance alerts, cooperative management
  - **Cooperative Dashboard**: Member management, sales tracking, compliance status
  - **Farmer Field App**: Offline-first, voice-guided interface, multi-language support
- **Use Case**: Mobile-first field operations and intelligence gathering

**These are separate applications with different user bases and purposes.**

---

## 🚀 Development Setup

This mobile app is a **separate PWA** developed **in parallel** with the web application and does **NOT** impact the main codebase or build process.

### Prerequisites

- Node.js >= 18.0.0
- Modern web browser (Chrome, Safari, Firefox, Edge)

### Installation

```bash
# Navigate to mobile app directory
cd apps/mobile

# Install dependencies
npm install

# Start development server (runs on port 5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access the PWA

- **Development:** http://localhost:5174
- **Production:** Deploy `dist/` folder to any static hosting

### Install as PWA

1. Open the app in a mobile browser (Chrome, Safari)
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Add to Home Screen"
4. App will install and work offline

---

## 📁 Project Structure

```
apps/mobile/
├── src/
│   ├── components/      # Shared components
│   │   ├── ThemeProvider.tsx  # Theme context provider
│   │   └── BrandLogo.tsx      # Brand logo component
│   ├── screens/         # Screen components (ERMITS, Cooperative, Farmer)
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Constants and mock data
│   ├── theme/           # Design system (matches web app)
│   │   ├── colors.ts    # Color palette (matches Tailwind)
│   │   ├── typography.ts # Typography system
│   │   ├── spacing.ts   # Spacing scale
│   │   ├── brand.ts     # Brand assets
│   │   └── index.ts     # Main theme export
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
│   └── agrosoluce.png   # Logo
├── assets/              # Additional assets
├── package.json         # Mobile app dependencies
├── vite.config.ts       # Vite + PWA configuration
├── tsconfig.json        # TypeScript config (isolated)
├── index.html           # HTML entry point
└── README.md            # This file
```

## 🎨 Design System

The mobile app uses the **same design system as the web application** for consistency:

- **Colors**: Primary green (#2E7D32), Secondary orange (#FF7900), Accent gold (#FFB300)
- **Typography**: System fonts with consistent sizing (matches web scale)
- **Spacing**: 4px base unit scale (matches Tailwind spacing)
- **Shadows**: Platform-appropriate elevation

See `DESIGN_SYSTEM_ALIGNMENT.md` for detailed alignment documentation.

---

## 🔒 Isolation from Main Build

### Build Separation

- ✅ **Separate package.json** - Own dependencies, no conflicts
- ✅ **Separate TypeScript config** - Doesn't extend root config
- ✅ **Separate build process** - Vite (different from web app)
- ✅ **Different port** - Runs on port 5174 (web app uses 5173)
- ✅ **Excluded from root builds** - Root `package.json` doesn't include mobile
- ✅ **Own node_modules** - Completely isolated dependencies
- ✅ **Separate dist/ output** - Builds to `apps/mobile/dist/`

### Root Build Safety

The root build process (`npm run build`) only builds the web app:
- Root `package.json` scripts only reference `apps/web`
- TypeScript config excludes `apps/mobile`
- Vercel deployment only builds `apps/web`
- No interference with existing build pipeline

---

## 📱 Features

### Three-Tier User Interface System

1. **ERMITS Team Command Center**
   - Real-time monitoring of 3,797+ cooperatives
   - Compliance alerts and risk management
   - Market intelligence and trends
   - Weather and price monitoring
   - GPS verification and mapping

2. **Cooperative Management Dashboard**
   - Member management and farmer tracking
   - Sales and orders tracking
   - Compliance status monitoring
   - EUDR documentation management
   - Child labor monitoring

3. **Farmer Field App**
   - **Offline-first** functionality (works without internet)
   - **Voice-guided interface** (for low-literacy users)
   - **Multi-language support** (French, local languages)
   - Field data collection
   - GPS location tracking
   - Photo documentation

---

## 📚 Documentation

- **Implementation Guide:** `docs/guides/AgroSoluce_Intelligence_App_IMPLEMENTATION_GUIDE.md`
- **Demo:** `docs/prototypes/AgroSoluce_Intelligence_App_DEMO.html`

---

## 🛠️ Development Workflow

### Working on Mobile App

```bash
# Terminal 1: Start Metro bundler
cd apps/mobile
npm start

# Terminal 2: Run on device/emulator
npm run android  # or npm run ios
```

### Working on Web App

```bash
# From root directory
npm run dev      # Starts web app (unchanged)
npm run build    # Builds web app (unchanged)
```

**Both can run simultaneously without conflicts!**

---

## 📋 Implementation Status

- [x] Project structure created
- [x] Package.json configured
- [x] TypeScript config isolated
- [x] Build separation verified
- [ ] React Native project initialized
- [ ] Components refactored
- [ ] Backend integration
- [ ] Testing setup
- [ ] Deployment configuration

---

## ⚠️ Important Notes

1. **Do NOT modify root build configs** - Mobile app is completely separate
2. **Do NOT add mobile dependencies to root** - Use `apps/mobile/package.json`
3. **Do NOT import mobile code in web app** - They are separate applications
4. **Mobile app has its own gitignore** - Build artifacts stay isolated

---

**This mobile app development does NOT impact the main codebase or build process.**
