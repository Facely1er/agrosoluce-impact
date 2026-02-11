# AgroSoluce Mobile App - Purpose & Scope

## 🎯 Different Purpose from Web App

The mobile app and web app serve **completely different purposes** and user bases:

---

## 📱 Mobile App: Field Intelligence & Operations Platform

**Purpose**: Operational intelligence tool for field work, monitoring, and data collection

**Target Users**:
1. **ERMITS Team** - Internal operations and monitoring
2. **Cooperative Managers** - Managing their operations and members
3. **Farmers** - Field data collection and access to information

**Key Features**:
- Real-time monitoring and alerts
- Offline-first functionality (critical for field work)
- Voice-guided interface (for low-literacy users)
- Multi-language support (French, local languages)
- GPS tracking and mapping
- Photo documentation
- Compliance monitoring
- Market intelligence

**Use Cases**:
- ERMITS team monitoring 3,797+ cooperatives
- Cooperative managers tracking members and sales
- Farmers collecting field data without internet
- Compliance officers verifying EUDR requirements
- Field agents conducting assessments

---

## 🌐 Web App: B2B Marketplace Platform

**Purpose**: Trading platform connecting cooperatives with international buyers

**Target Users**:
- International buyers
- Cooperative representatives (web interface)
- General public browsing directory

**Key Features**:
- Cooperative directory
- Buyer portal
- Marketplace transactions
- Profile browsing
- Request management
- Web-based interface

**Use Cases**:
- Buyers searching for cooperatives
- Cooperatives showcasing their profiles
- Marketplace transactions
- Directory browsing

---

## 🔄 Key Differences

| Aspect | Mobile App | Web App |
|--------|-----------|---------|
| **Primary Purpose** | Field operations & intelligence | B2B marketplace |
| **User Base** | ERMITS team, Cooperative managers, Farmers | Buyers, Cooperative web users |
| **Interface** | Mobile-first, offline-capable | Desktop/web-optimized |
| **Key Feature** | Offline-first, voice-guided | Marketplace, directory |
| **Deployment** | PWA (installable) | Web application |
| **Use Case** | Field work, monitoring | Trading, browsing |

---

## ✅ Why Separate Applications?

1. **Different User Needs**: Field workers need offline access, voice guidance, and mobile-optimized interfaces. Marketplace users need rich web interfaces for browsing and transactions.

2. **Different Technical Requirements**: 
   - Mobile: Offline-first, GPS, camera, voice input
   - Web: Rich UI, complex forms, large data tables

3. **Different Development Priorities**: 
   - Mobile: Field usability, offline sync, multi-language
   - Web: Marketplace features, buyer experience, SEO

4. **Independent Deployment**: Can be deployed and updated independently based on different user needs.

---

## 📋 Implementation Notes

- Mobile app uses **AgroSoluce brand** (same logo, colors, design system)
- Mobile app is **completely separate** from web app codebase
- Mobile app can be developed **in parallel** without affecting web app
- Both apps can share **backend APIs** but have different frontend implementations
- Mobile app focuses on **operational intelligence**, web app focuses on **marketplace transactions**

