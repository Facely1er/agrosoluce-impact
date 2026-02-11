# AgroSoluce Marketplace - Project Structure

## 📁 Directory Structure

```
agrosoluce-marketplace/
├── public/
│   ├── agrosoluce.png              # Logo
│   └── cooperatives_cote_ivoire.json  # Cooperative data (3,797+ records)
│
├── src/
│   ├── features/                   # Feature modules (domain-driven)
│   │   ├── cooperatives/
│   │   │   ├── components/
│   │   │   │   ├── CooperativeCard.tsx
│   │   │   │   └── CooperativeMap.tsx
│   │   │   ├── hooks/             # (future)
│   │   │   └── api/               # (future)
│   │   ├── products/               # (future)
│   │   ├── buyers/                 # (future)
│   │   ├── marketplace/            # (future)
│   │   └── transactions/           # (future)
│   │
│   ├── pages/                      # Page components (routes)
│   │   ├── marketplace/
│   │   │   ├── MarketplaceHome.tsx
│   │   │   ├── CooperativeDirectory.tsx
│   │   │   └── CooperativeProfile.tsx
│   │   ├── buyer/
│   │   │   └── BuyerPortal.tsx
│   │   └── cooperative/
│   │       └── CooperativeDashboard.tsx
│   │
│   ├── components/                 # Reusable components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                     # (future: Button, Card, etc.)
│   │   └── marketplace/            # (future)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useCooperatives.ts
│   │
│   ├── lib/                        # Libraries and utilities
│   │   ├── utils/
│   │   │   └── cooperativeUtils.ts  # Data processing utilities
│   │   ├── supabase/              # (future: Supabase client)
│   │   └── api/                    # (future: API utilities)
│   │
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── App.tsx                     # Main app component with routing
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles
│   └── vite-env.d.ts              # Vite type definitions
│
├── Configuration Files
│   ├── package.json                # Dependencies and scripts
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript config
│   ├── tsconfig.app.json           # App-specific TS config
│   ├── tsconfig.node.json          # Node-specific TS config
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   ├── eslint.config.js            # ESLint config
│   ├── netlify.toml                # Netlify deployment config
│   └── .gitignore                  # Git ignore rules
│
└── Documentation
    ├── README.md                   # Main documentation
    ├── MIGRATION_GUIDE.md          # Migration from HTML/JS
    └── PROJECT_STRUCTURE.md         # This file
```

## 🎯 Feature Modules

### Cooperatives (`src/features/cooperatives/`)
- **Purpose**: Manage cooperative data and display
- **Components**: Cards, maps, profiles
- **Status**: ✅ Implemented

### Products (`src/features/products/`)
- **Purpose**: Product listing and management
- **Status**: 🚧 Planned

### Buyers (`src/features/buyers/`)
- **Purpose**: Buyer portal and management
- **Status**: 🚧 Planned

### Marketplace (`src/features/marketplace/`)
- **Purpose**: Core marketplace features (search, matching, etc.)
- **Status**: 🚧 Planned

### Transactions (`src/features/transactions/`)
- **Purpose**: Transaction and payment processing
- **Status**: 🚧 Planned

## 📄 Pages

### Marketplace Pages (`src/pages/marketplace/`)
- **MarketplaceHome**: Landing page with hero and features
- **CooperativeDirectory**: Main directory with search, filters, map, and stats
- **CooperativeProfile**: Individual cooperative detail page

### Buyer Pages (`src/pages/buyer/`)
- **BuyerPortal**: Buyer dashboard (placeholder for future features)

### Cooperative Pages (`src/pages/cooperative/`)
- **CooperativeDashboard**: Cooperative management dashboard (placeholder)

## 🔧 Utilities

### Cooperative Utils (`src/lib/utils/cooperativeUtils.ts`)
- `normalizeText()` - Text normalization for search
- `toSlug()` - Convert text to URL-friendly slug
- `normalizeCIPhone()` - Normalize Côte d'Ivoire phone numbers
- `getRegionCoordinates()` - Get GPS coordinates for regions
- `enrichCooperatives()` - Enrich cooperative data with computed fields
- `extractNatureTags()` - Extract activity tags from text
- `splitContact()` - Split contact strings into parts

## 🗺️ Routing

Routes are defined in `src/App.tsx`:
- `/` → MarketplaceHome
- `/cooperatives` → CooperativeDirectory
- `/cooperatives/:id` → CooperativeProfile
- `/buyer/*` → BuyerPortal
- `/cooperative/*` → CooperativeDashboard

## 📊 Data Flow

1. **Data Loading**: `useCooperatives` hook fetches JSON from `/public/cooperatives_cote_ivoire.json`
2. **Data Enrichment**: Utilities enrich data with coordinates, slugs, tags, phone numbers
3. **State Management**: React state manages search, filters, and UI state
4. **Rendering**: Components render filtered and enriched data

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Colors**: Primary (green), Secondary (orange), Accent (gold)
- **Icons**: Lucide React
- **Maps**: Leaflet

## 🚀 Next Steps

1. **Backend Integration**
   - Set up Supabase project
   - Create database schema
   - Migrate cooperative data
   - Implement authentication

2. **Feature Development**
   - Product listing management
   - Buyer-seller matching engine
   - Transaction processing
   - Payment integration
   - Real-time messaging

3. **Enhancements**
   - Mobile applications
   - Analytics dashboard
   - EUDR compliance automation
   - Advanced search and filtering

## 📝 Notes

- All code follows TypeScript strict mode
- Components are functional with hooks
- Feature modules enable code organization by domain
- Utilities are pure functions for testability
- Ready for backend integration

