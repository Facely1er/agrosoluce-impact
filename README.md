# AgroSoluce®

**Agricultural Security & Sustainability Platform**

AgroSoluce is a comprehensive platform for managing agricultural cooperatives, tracking compliance, and ensuring sustainable practices across West Africa.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm
- Supabase account (for database)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

1. Copy `docs/deployment/ENV_TEMPLATE.txt` to `.env` in the root directory
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_SCHEMA=agrosoluce
   ```

---

## 📁 Repository Structure

```
agrosoluce/
├── apps/
│   └── web/                    # Main application
│       ├── src/                # Source code
│       ├── public/             # Static assets
│       └── package.json
│
├── packages/                   # Shared packages
│   ├── database/              # Database migrations
│   ├── types/                 # Shared TypeScript types
│   ├── ui/                    # Shared UI components
│   ├── config/                # Shared configurations
│   └── supabase/              # Supabase client
│
├── docs/                      # Documentation
│   ├── strategic/             # Strategic planning documents
│   ├── guides/                # Implementation guides
│   ├── deployment/            # Deployment instructions
│   ├── testing/               # Testing procedures
│   ├── architecture/          # Architecture documentation
│   └── prototypes/            # HTML prototypes
│
├── scripts/                   # Utility scripts
│   ├── *.ps1                  # PowerShell scripts
│   ├── *.sh                   # Shell scripts
│   └── *.py                   # Python scripts
│
├── archived/                  # Historical documentation
│   └── README.md              # Archive index
│
└── legacy/                    # Legacy code (excluded from builds)
```

---

## 📚 Documentation

### Getting Started
- **Quick Start**: See `docs/deployment/QUICK_START.md`
- **Setup Guide**: See `docs/deployment/ENV_SETUP.md`
- **Project Structure**: See `docs/architecture/PROJECT_STRUCTURE.md`

### Implementation
- **Implementation Guide**: `docs/guides/AgroSoluce_Implementation_Guide.md`
- **Complete Implementation Plan**: `docs/guides/AgroSoluce_Complete_Implementation_Plan.md`
- **Development Guide**: `docs/guides/AgroSoluce_Cursor_Development_Guide.md`

### Deployment
- **Deployment Checklist**: `docs/deployment/DEPLOYMENT_CHECKLIST.md`
- **Vercel Setup**: `docs/deployment/VERCEL_SETUP_GUIDE.md`
- **Database Migration**: `docs/deployment/DATABASE_MIGRATION_GUIDE.md`

### Testing
- **Testing Guide**: `docs/testing/MANUAL_TESTING_GUIDE.md`
- **Testing Checklist**: `docs/testing/MANUAL_TESTING_CHECKLIST.md`

### Strategic Planning
- **Strategic Plan**: `docs/strategic/AgroSoluce_Strategic_Reorganization_Plan.md`
- **Executive Summary**: `docs/strategic/AgroSoluce_Executive_Summary.md`

### Architecture
- **Monorepo Structure**: `docs/architecture/MONOREPO_STRUCTURE.md`
- **Migration Guide**: `docs/architecture/MONOREPO_MIGRATION.md`

---

## 🎯 Key Features

### Core Functionality
- **Cooperative Directory** - Browse and search 3,797+ cooperatives in Côte d'Ivoire
- **Workspace Management** - Comprehensive workspace for each cooperative
- **Evidence Tracking** - Document upload and management system
- **Coverage Metrics** - Real-time documentation coverage tracking
- **Gap Analysis** - Identify missing documentation with guidance
- **Assessment System** - Cocoa-specific due-diligence assessments
- **Pilot Management** - Assign and track cooperatives in pilot programs

### Compliance & Monitoring
- **Child Labor Monitoring** - Comprehensive compliance tracking
- **Certification Management** - Track Fair Trade & Rainforest Alliance certifications
- **EUDR Compliance** - European Union Deforestation Regulation compliance tools
- **Documentation Readiness** - Self-reported documentation status tracking

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (aliases to dev:web)
npm run dev:web          # Start web app dev server

# Building
npm run build            # Build all apps (aliases to build:web)
npm run build:web        # Build web app for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code
npm run typecheck        # Type check TypeScript

# Database
npm run migrate:check    # Check migration status
npm run migrate:run      # Run database migrations
npm run migrate:data     # Migrate cooperative data
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 📊 Project Status

### ✅ Completed
- Monorepo structure migration
- Core application features
- Database schema and migrations
- Documentation organization
- Deployment configuration

### 🚧 In Progress
- Production deployment
- User testing and feedback
- Performance optimization

### 📅 Planned
- Mobile application
- Advanced analytics
- ERMITS ecosystem integration
- Geographic expansion

---

## 🔗 Related Resources

### ERMITS Ecosystem
- **VendorSoluce** - Supplier risk assessment
- **ImpactSoluce** - ESG data aggregation
- **CyberCaution** - Threat monitoring
- **STEEL™** - Strategic intelligence

### External Links
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)

---

## 📝 License & Copyright

© 2025 ERMITS Corporation. All Rights Reserved.

**Trademarks:**
- AgroSoluce® is a registered trademark of ERMITS Corporation
- ERMITS®, CyberCaution®, VendorSoluce®, ImpactSoluce®, STEEL™ and The Resilience Operating System™ are trademarks of ERMITS Corporation

---

## 🆘 Support

### Documentation
- Check the `docs/` directory for detailed guides
- See `docs/guides/TROUBLESHOOTING.md` for common issues

### Contact
- **Email**: support@ermits.com
- **Documentation**: See organized docs in `docs/` directory

---

## 📋 Recent Changes

### Repository Cleanup (Current)
- ✅ Organized documentation into `docs/` subdirectories
- ✅ Moved scripts to `scripts/` directory
- ✅ Consolidated archived documentation
- ✅ Updated README with current structure
- ✅ Created archive index in `archived/README.md`

---

**Last Updated**: Repository cleanup and reorganization  
**Version**: 1.0.0  
**Status**: Production Ready

© 2025 ERMITS Corporation. Cultivating Secure Agriculture.
