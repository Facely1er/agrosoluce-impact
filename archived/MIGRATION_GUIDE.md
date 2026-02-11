# Migration Guide: From Cooperatives Directory to Marketplace

This guide documents the reorganization of AgroSoluce projects into a unified marketplace platform.

## 📋 Overview

The reorganization transforms the vanilla HTML/JS cooperatives directory into a modern React/TypeScript marketplace application while preserving all existing functionality.

## 🔄 What Changed

### Structure Changes

**Before:**
```
AgroSoluce-Cooperatives-directory/
├── index.html (vanilla HTML/JS)
├── package.json (minimal)
└── public/
    └── cooperatives_cote_ivoire.json
```

**After:**
```
agrosoluce-marketplace/
├── src/
│   ├── features/          # Feature modules
│   ├── pages/            # Page components
│   ├── components/       # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── public/
│   └── cooperatives_cote_ivoire.json
└── package.json (full React setup)
```

### Key Migrations

1. **HTML/JS → React Components**
   - `index.html` → `src/pages/marketplace/CooperativeDirectory.tsx`
   - Inline JavaScript → React hooks (`useCooperatives`)
   - CSS styles → Tailwind CSS classes

2. **Functionality Preserved**
   - ✅ Cooperative search and filtering
   - ✅ Interactive map with Leaflet
   - ✅ Statistics dashboard
   - ✅ CSV/JSON export
   - ✅ Region-based filtering
   - ✅ Cooperative detail views

3. **New Features Added**
   - ✅ React Router for navigation
   - ✅ TypeScript type safety
   - ✅ Component-based architecture
   - ✅ Feature module organization
   - ✅ Reusable UI components

## 🗂️ File Mapping

| Original File | New Location | Notes |
|-------------|-------------|-------|
| `index.html` (JS logic) | `src/pages/marketplace/CooperativeDirectory.tsx` | Converted to React component |
| `index.html` (map logic) | `src/features/cooperatives/components/CooperativeMap.tsx` | Extracted to reusable component |
| `index.html` (utils) | `src/lib/utils/cooperativeUtils.ts` | Utility functions extracted |
| `index.html` (styles) | `src/index.css` + Tailwind | Converted to Tailwind CSS |
| `cooperatives_cote_ivoire.json` | `public/cooperatives_cote_ivoire.json` | Unchanged location |

## 🔧 Utility Functions Migration

All utility functions from the original HTML/JS have been migrated to TypeScript:

- `normalizeText()` → `src/lib/utils/cooperativeUtils.ts`
- `toSlug()` → `src/lib/utils/cooperativeUtils.ts`
- `normalizeCIPhone()` → `src/lib/utils/cooperativeUtils.ts`
- `getRegionCoordinates()` → `src/lib/utils/cooperativeUtils.ts`
- `enrichCooperatives()` → `src/lib/utils/cooperativeUtils.ts`

## 🎨 Component Structure

### Pages
- `MarketplaceHome` - Landing page
- `CooperativeDirectory` - Main directory with search/filter/map
- `CooperativeProfile` - Individual cooperative details
- `BuyerPortal` - Buyer dashboard (placeholder)
- `CooperativeDashboard` - Cooperative dashboard (placeholder)

### Features
- `cooperatives/components/CooperativeCard` - Card display
- `cooperatives/components/CooperativeMap` - Leaflet map integration

### Layout
- `layout/Navbar` - Navigation bar
- `layout/Footer` - Footer component

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   cd agrosoluce-marketplace
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open http://localhost:5173
   - Navigate to `/cooperatives` to see the directory

## 📊 Data Flow

1. **Data Loading**: `useCooperatives` hook loads JSON from `/public/cooperatives_cote_ivoire.json`
2. **Data Enrichment**: Utilities enrich cooperative data with coordinates, slugs, tags
3. **Filtering**: React state manages search and filter criteria
4. **Display**: Components render filtered results

## 🔐 Access Control

The access control system from the original implementation is preserved:
- Access key: `AGRO-ACCESS-2025`
- Stored in localStorage
- Can be extended for Supabase authentication

## 🎯 Next Steps

1. **Backend Integration**
   - Set up Supabase project
   - Migrate cooperative data to database
   - Implement authentication

2. **Marketplace Features**
   - Product listing management
   - Buyer-seller matching
   - Transaction processing
   - Payment integration

3. **Enhanced Features**
   - Real-time messaging
   - Order management
   - Analytics dashboard
   - Mobile applications

## 📝 Notes

- All original functionality is preserved
- TypeScript provides type safety
- Component architecture enables reusability
- Feature modules organize code by domain
- Ready for backend integration

## 🐛 Troubleshooting

**Issue**: Map not displaying
- **Solution**: Ensure Leaflet CSS is imported in `CooperativeMap.tsx`

**Issue**: Data not loading
- **Solution**: Verify `cooperatives_cote_ivoire.json` exists in `public/` folder

**Issue**: TypeScript errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

