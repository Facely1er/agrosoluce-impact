# React Native Setup Guide

**Status:** ✅ Dependencies installed - Ready for native project initialization

---

## ✅ Completed

1. **Dependencies Installed**
   - React Native 0.72.6
   - React 18.2.0
   - All required dev dependencies
   - TypeScript configuration

2. **Configuration Files Created**
   - `babel.config.js` - Babel configuration
   - `metro.config.js` - Metro bundler configuration
   - `index.js` - App entry point
   - `app.json` - App metadata
   - `.eslintrc.js` - ESLint configuration
   - `jest.config.js` - Jest testing configuration

3. **App Structure**
   - `src/App.tsx` - Main app component with ThemeProvider
   - Theme system integrated
   - Brand components ready

---

## 🚀 Next Steps: Initialize Native Projects

### Option 1: Use React Native CLI (Recommended)

```bash
cd apps/mobile

# Initialize Android and iOS projects
npx react-native init AgroSoluceIntelligence --skip-install --directory .

# This will create:
# - android/ directory
# - ios/ directory
# - Update package.json if needed
```

**Note:** The `--skip-install` flag prevents overwriting your existing package.json and dependencies.

### Option 2: Manual Setup (If CLI doesn't work)

#### For Android:

1. **Create Android project structure:**
   ```bash
   # Use React Native template
   npx @react-native-community/cli init AgroSoluceIntelligence --skip-install
   # Then copy android/ and ios/ folders to apps/mobile/
   ```

2. **Update Android configuration:**
   - Update `android/app/build.gradle` package name
   - Update `AndroidManifest.xml` with app name
   - Configure signing keys

#### For iOS (macOS only):

1. **Create iOS project:**
   ```bash
   cd ios
   pod install
   ```

2. **Update iOS configuration:**
   - Update `ios/AgroSoluceIntelligence/Info.plist`
   - Configure bundle identifier
   - Set up signing certificates

---

## 📋 Required Native Dependencies

After initializing native projects, you'll need to install:

### Core Navigation
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

### Gesture Handler
```bash
npm install react-native-gesture-handler react-native-reanimated
```

### Offline Storage
```bash
npm install @react-native-async-storage/async-storage
```

### Voice Support (for farmers)
```bash
npm install react-native-tts @react-native-voice/voice
```

### Location Services
```bash
npm install react-native-geolocation-service
```

### Icons
```bash
npm install react-native-vector-icons
```

---

## 🔧 Configuration Updates Needed

### 1. Update Android Package Name

In `android/app/build.gradle`:
```gradle
applicationId "com.agrosoluce.intelligence"
```

### 2. Update iOS Bundle Identifier

In `ios/AgroSoluceIntelligence/Info.plist`:
```xml
<key>CFBundleIdentifier</key>
<string>com.agrosoluce.intelligence</string>
```

### 3. Add Permissions

**Android (`android/app/src/main/AndroidManifest.xml`):**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS (`ios/AgroSoluceIntelligence/Info.plist`):**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to map farm boundaries</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice commands</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos of farms</string>
```

---

## ✅ Verification

After setup, verify everything works:

```bash
# Start Metro bundler
npm start

# Run on Android (in separate terminal)
npm run android

# Run on iOS (macOS only, in separate terminal)
npm run ios
```

---

## 📝 Current Status

- ✅ Dependencies installed
- ✅ Configuration files created
- ✅ Theme system integrated
- ✅ App entry point ready
- ⏳ Native projects need initialization (android/ios folders)

---

**Next:** Initialize native Android and iOS projects using React Native CLI.

