# AgroSoluce Baseline Documentation

**Generated:** 2024  
**Purpose:** Comprehensive inventory of current routes, data models, services, and marketplace/transaction logic

---

## 1. Routes and Pages

### Main Application Routes (from `src/App.tsx`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `MarketplaceHome` | Homepage/marketplace landing page |
| `/cooperatives` | `CooperativeDirectory` | Directory listing of all cooperatives |
| `/cooperatives/:id` | `CooperativeProfile` | Individual cooperative profile page |
| `/buyer` | `BuyerPortal` | Buyer dashboard/portal |
| `/buyer/request` | `BuyerRequestForm` | Form to create buyer sourcing requests |
| `/buyer/requests/:requestId/matches` | `BuyerMatches` | View matching results for a buyer request |
| `/buyer/*` | `BuyerPortal` | Catch-all for buyer routes |
| `/cooperative/*` | `CooperativeDashboard` | Cooperative dashboard (catch-all) |
| `/cooperative/:id/farmers-first` | `FarmersFirstDashboard` | Farmers First toolkit dashboard |

### Page Components Location
- **Marketplace Pages:** `src/pages/marketplace/`
  - `MarketplaceHome.tsx`
  - `CooperativeDirectory.tsx`
  - `CooperativeProfile.tsx`

- **Buyer Pages:** `src/pages/buyer/`
  - `BuyerPortal.tsx`
  - `BuyerRequestForm.tsx`
  - `BuyerMatches.tsx`

- **Cooperative Pages:** `src/pages/cooperative/`
  - `CooperativeDashboard.tsx`
  - `FarmersFirstDashboard.tsx`

- **Admin Pages:** `src/pages/admin/` (directory exists, contents not detailed)
- **Auth Pages:** `src/pages/auth/` (directory exists, contents not detailed)

---

## 2. Data Models

### Database Schema: `agrosoluce`

#### Core Tables

**User Management**
- `migrations` - Migration tracking
- `user_profiles` - User profiles (buyers, cooperatives, admins)

**Cooperatives**
- `cooperatives` - Cooperative organizations
  - Fields: id, name, region, department, commune, sector, phone, email, address, latitude, longitude, description, products[], certifications[], is_verified, user_profile_id, country, commodity, annual_volume_tons, compliance_flags (JSONB), contact_email, contact_phone, profile_source, contextual_risks (JSONB), regulatory_context (JSONB), coverage_metrics (JSONB), readiness_status

**Products**
- `product_categories` - Product category hierarchy
- `products` - Products listed by cooperatives
  - Fields: id, cooperative_id, category_id, name, description, price, currency (default: XOF), unit, quantity_available, harvest_date, organic, certifications[], images[], is_active, metadata (JSONB)

**Transactions/Orders**
- `orders` - Orders placed by buyers
  - Fields: id, buyer_id, cooperative_id, status (pending|confirmed|processing|shipped|delivered|cancelled), total_amount, currency (default: XOF), shipping_address, notes, completed_at
- `order_items` - Individual items within orders
  - Fields: id, order_id, product_id, quantity, unit_price, total_price

**Messaging**
- `messages` - Messages between buyers and cooperatives
  - Fields: id, sender_id, receiver_id, order_id, subject, content, is_read

**Producer Registry**
- `farmers` - Individual farmers/producers
  - Fields: id, cooperative_id, name, registration_number, phone, email, address, latitude, longitude, location_description, date_of_birth, gender, is_active, metadata (JSONB)

**Traceability**
- `batches` - Product batches for traceability
  - Fields: id, product_id, cooperative_id, farmer_id, harvest_date, origin_gps_latitude, origin_gps_longitude, quantity, unit, metadata (JSONB)
- `batch_transactions` - Traceability chain transactions
  - Fields: id, batch_id, from_entity_type, from_entity_id, to_entity_type, to_entity_id, transaction_type (harvest|transfer|sale|processing), quantity, timestamp, notes

**Compliance**
- `certifications` - Certifications (organic, fair trade, etc.)
  - Fields: id, cooperative_id, farmer_id, certification_type, issuer, issue_date, expiry_date, status (active|expired|revoked|pending), document_url
- `eudr_verifications` - EUDR compliance verifications
  - Fields: id, batch_id, gps_coordinates, deforestation_check, child_labor_check, status, verified_at, verified_by, notes
- `compliance_requirements` - Compliance requirement definitions
  - Fields: id, requirement_type, description, applicable_to

**Evidence**
- `field_declarations` - Field/plot declarations
  - Fields: id, cooperative_id, farmer_id, field_location_latitude, field_location_longitude, crop_type, area (hectares), declaration_date, status, verified_by, verified_at
- `audits` - Audit records
  - Fields: id, cooperative_id, audit_type, auditor_name, audit_date, findings, document_url, status
- `attestations` - Attestations/signed statements
  - Fields: id, entity_id, entity_type, attestation_type, content, signed_by, signed_at, document_url

**Logistics**
- `shipping_records` - Shipping records
  - Fields: id, order_id, carrier, tracking_number, status, shipped_at, estimated_delivery, actual_delivery
- `shipping_tracking_events` - Shipping tracking events
  - Fields: id, shipping_record_id, event_type, location, timestamp, notes

**Buyer Requests (v1 Scope)**
- `ag_buyer_requests` - Buyer sourcing requests
  - Fields: id, buyer_org, buyer_contact_email, target_country, commodity, min_volume_tons, max_volume_tons, requirements (JSONB), status (draft|open|matched|closed)
- `ag_request_matches` - Matching results between requests and cooperatives
  - Fields: id, request_id, cooperative_id, match_score, status (suggested|shortlisted|contacted|rejected)

**Farmers First Toolkit**
- `cooperative_onboarding` - Onboarding tracking
  - Fields: id, cooperative_id, status, current_step, started_at, completed_at, welcome_call_scheduled_at, welcome_call_completed_at, onboarding_champion_id, notes
- `onboarding_steps` - Onboarding step checklist
  - Fields: id, onboarding_id, step_number, step_name, step_description, is_completed, completed_at, completed_by, notes
- `training_sessions` - Training sessions
  - Fields: id, cooperative_id, session_type, session_title, session_description, scheduled_at, completed_at, duration_minutes, trainer_id, location, status, attendance_count, materials_url, recording_url, feedback_notes
- `training_champions` - Training champions
  - Fields: id, cooperative_id, user_profile_id, role, training_completed_at, is_active, responsibilities
- `training_completions` - Training module completions
  - Fields: id, training_session_id, user_profile_id, completed_at, score, feedback
- `satisfaction_surveys` - Monthly satisfaction surveys
  - Fields: id, cooperative_id, survey_month, submitted_by, submitted_at, overall_satisfaction, price_improvement_percentage, ease_of_use_rating, support_quality_rating, recommendation_likelihood, additional_feedback
- `feedback_submissions` - Feedback submissions
  - Fields: id, cooperative_id, user_profile_id, feedback_type (bug|feature_request|complaint|compliment|suggestion), subject, content, priority (low|medium|high|urgent), status (open|in_progress|resolved|closed), assigned_to, created_at, updated_at
- `baseline_measurements` - Baseline value tracking measurements
  - Fields: id, cooperative_id, measurement_date, avg_days_to_negotiate_price, percentage_sales_at_optimal_price, market_price_access_frequency_per_week, notes
- `monthly_progress` - Monthly progress tracking
  - Fields: id, cooperative_id, progress_month, avg_price_improvement_percentage, baseline_avg_price, current_avg_price, total_volume_sold_tons, total_revenue_usd, notes
- `value_metrics` - Value tracking metrics
  - Fields: id, cooperative_id, metric_date, metric_type, metric_value, baseline_value, improvement_percentage, admin_cost_saved_usd, price_improvement_usd, notes

**Phase 1 Data Enrichment**
- `buyer_request_lots` - Lots within buyer requests
  - Fields: id, request_id, lot_number, commodity, quantity_tons, quality_requirements, delivery_date, status
- `documents` - Document management
  - Fields: id, entity_type, entity_id, document_type, doc_type (certification|policy|land_evidence|other), title, file_url, file_name, file_size_bytes, mime_type, uploaded_by, uploaded_at, expiry_date, expires_at, issued_at, issuer, is_required_type, is_internal_only, is_buyer_visible, description, metadata (JSONB)
- `farmer_declarations` - Farmer declarations
  - Fields: id, cooperative_id, farmer_id, declaration_type, declaration_date, content, status, verified_by, verified_at
- `notifications` - System notifications
  - Fields: id, user_profile_id, notification_type, title, message, is_read, read_at, action_url, created_at
- `readiness_checklist` - Readiness checklist items
  - Fields: id, cooperative_id, checklist_item, category, is_completed, completed_at, notes
- `market_prices` - Market price data
  - Fields: id, commodity, country, region, price_per_ton, currency, price_date, source
- `geographic_data` - Geographic reference data
  - Fields: id, country, region, department, commune, latitude, longitude, metadata (JSONB)
- `certification_standards` - Certification standard definitions
  - Fields: id, standard_name, standard_code, description, issuer, applicable_commodities[], requirements (JSONB)
- `enrichment_log` - Enrichment operation logging
  - Fields: id, cooperative_id, enrichment_type, enrichment_data (JSONB), computed_at, computed_by

### TypeScript Types (from `src/types/index.ts`)

**Core Types:**
- `VerificationStatus`: 'pending' | 'verified' | 'rejected'
- `TransactionStatus`: 'initiated' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
- `OrderStatus`: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- `UserType`: 'buyer' | 'cooperative' | 'admin'
- `QualityGrade`: 'premium' | 'standard' | 'basic'

**Main Interfaces:**
- `Cooperative` - Comprehensive cooperative type with enrichment fields
- `Product` - Product listing type
- `ProductCategory` - Product category type
- `Document` - Document type with Phase 1 enrichment fields
- `UserProfile` - User profile type
- `Buyer` - Buyer type
- `Order` - Order type
- `OrderItem` - Order item type
- `Message` - Message type
- `Transaction` - Legacy transaction type
- `Farmer` - Farmer/producer type
- `Batch` - Batch traceability type
- `BatchTransaction` - Batch transaction type
- `Certification` - Certification type
- `EUDRVerification` - EUDR verification type
- `ComplianceRequirement` - Compliance requirement type
- `FieldDeclaration` - Field declaration type
- `Audit` - Audit type
- `Attestation` - Attestation type

**Feature-Specific Types:**
- `FeedbackType`: 'bug' | 'feature_request' | 'complaint' | 'compliment' | 'suggestion'
- `FeedbackPriority`: 'low' | 'medium' | 'high' | 'urgent'
- `FeedbackStatus`: 'open' | 'in_progress' | 'resolved' | 'closed'
- `SatisfactionSurvey` - Satisfaction survey type
- `FeedbackSubmission` - Feedback submission type
- `OnboardingStepDefinition` - Onboarding step type
- `TrainingModule` - Training module type
- `BaselineMeasurement` - Baseline measurement type
- `MonthlyProgress` - Monthly progress type
- `ImpactSummary` - Impact summary type

---

## 3. Services and Utilities

### Core Services (`src/services/`)

**enrichmentService.ts**
- `computeContextualRisks(cooperative)` - Computes deforestation, protected area, and climate risks
- `computeRegulatoryContext(cooperative, buyerRegions?)` - Determines applicable regulations (EUDR, child labor, etc.)
- `computeCoverageMetrics(...)` - Calculates coverage metrics from raw counts
- `deriveReadinessStatus(coverage)` - Derives readiness status from coverage metrics

**enrichmentOrchestrationService.ts**
- `recomputeCooperativeEnrichment(cooperativeId, buyerRegions?)` - Orchestrates full enrichment recomputation
- `inferDocTypeFromDocumentType(documentType)` - Helper to infer doc_type from legacy field

**documentMetadataService.ts**
- Document metadata management service (file exists, details not fully explored)

### Utilities (`src/lib/utils/`)

**cooperativeUtils.ts**
- `normalizeText(value)` - Normalizes text (removes accents, lowercases)
- `toSlug(value)` - Converts text to URL-friendly slug
- `splitContact(raw)` - Splits contact strings by delimiters
- `normalizeCIPhone(raw)` - Normalizes Côte d'Ivoire phone numbers to E.164 format
- `extractNatureTags(natureActivite)` - Extracts activity tags from nature of activity text
- `canonicalizeSecteur(value)` - Canonicalizes sector names
- `getRegionCoordinates(regionName)` - Gets coordinates for Côte d'Ivoire regions
- `enrichCooperatives(cooperatives)` - Enriches cooperative data with computed fields

### Supabase Client (`src/lib/supabase/`)

**client.ts**
- `supabase` - Main Supabase client instance (configured with 'agrosoluce' schema)
- `getCurrentUser()` - Gets current authenticated user
- `signOut()` - Signs out current user
- `schemaManager` - Schema management utilities

**storage.ts**
- Supabase storage utilities (file exists, details not fully explored)

**index.ts**
- Supabase module exports

### API Services (by Feature)

**Buyers API** (`src/features/buyers/api/`)
- `buyerRequestsApi.ts`
  - `createBuyerRequest(request)`
  - `getBuyerRequestById(id)`
  - `createRequestMatches(requestId, matches)`
  - `getRequestMatches(requestId)`
  - `updateMatchStatus(matchId, status)`

**Compliance API** (`src/features/compliance/api/`)
- `complianceApi.ts`
  - `getCertifications(cooperativeId)`
  - `addCertification(certification)`
  - `verifyEUDR(batchId, verification)`
  - `checkChildLabor(batchId)`
  - `getComplianceStatus(cooperativeId)`
  - `getComplianceRequirements()`
  - `updateEUDRVerification(verificationId, updates)`

**Cooperatives API** (`src/features/cooperatives/api/`)
- `cooperativesApi.ts`
  - `getCooperatives()`
  - `getCooperativeById(id)`
  - `searchCooperatives(query)`
  - `getCooperativesByRegion(region)`
  - `getCooperativesByDepartment(department)`
  - `getVerifiedCooperatives()`

**Evidence API** (`src/features/evidence/api/`)
- `evidenceApi.ts`
  - `createFieldDeclaration(declaration)`
  - `getFieldDeclarations(cooperativeId)`
  - `getAudits(cooperativeId)`
  - `createAttestation(attestation)`
  - `getAttestations(entityType, entityId)`
  - `uploadEvidenceDocument(document)`

**Feedback API** (`src/features/feedback/api/`)
- `feedbackApi.ts`
  - `getSatisfactionSurvey(cooperativeId, month)`
  - `submitSatisfactionSurvey(cooperativeId, month, survey)`
  - `getCooperativeSurveys(cooperativeId)`
  - `submitFeedback(feedback)`
  - `getCooperativeFeedback(cooperativeId)`

**Onboarding API** (`src/features/onboarding/api/`)
- `onboardingApi.ts`
  - `getOnboardingByCooperativeId(cooperativeId)`
  - `createOrUpdateOnboarding(cooperativeId, onboarding)`
  - `updateOnboardingStep(onboardingId, stepNumber, updates)`
  - `getOnboardingSteps()`
  - `completeOnboarding(cooperativeId)`

**Producers API** (`src/features/producers/api/`)
- `farmersApi.ts`
  - `getFarmers()`
  - `getFarmerById(id)`
  - `getFarmersByCooperative(cooperativeId)`
  - `getFarmerCountByCooperative(cooperativeId)`
  - `createFarmer(farmer)`
  - `updateFarmer(id, updates)`
  - `deleteFarmer(id)`
  - `searchFarmers(query)`

**Products API** (`src/features/products/api/`)
- `productsApi.ts`
  - `getProducts(cooperativeId?)`
  - `getProductById(id)`
  - `getProductsByCategory(categoryId)`
  - `getProductCategories()`
  - `createProduct(product)`
  - `updateProduct(id, updates)`

**Traceability API** (`src/features/traceability/api/`)
- `traceabilityApi.ts`
  - `createBatch(batch)`
  - `getBatchById(id)`
  - `getBatchesByProduct(productId)`
  - `getBatchesByCooperative(cooperativeId)`
  - `getBatchChain(batchId)`
  - `verifyOrigin(batchId)`
  - `addBatchTransaction(transaction)`
  - `updateBatch(id, updates)`

**Training API** (`src/features/training/api/`)
- `trainingApi.ts`
  - `getTrainingSessions(cooperativeId)`
  - `createTrainingSession(session)`
  - `updateTrainingSession(id, updates)`
  - `getTrainingChampions(cooperativeId)`
  - `addTrainingChampion(champion)`
  - `recordTrainingCompletion(completion)`

**Transactions API** (`src/features/transactions/api/`)
- `ordersApi.ts`
  - `getBuyerOrders(buyerId)`
  - `getCooperativeOrders(cooperativeId)`
  - `getOrderById(orderId)`
  - `createOrder(order, items)`
  - `updateOrderStatus(orderId, status)`

**Value Tracking API** (`src/features/value-tracking/api/`)
- `valueTrackingApi.ts`
  - `getBaselineMeasurement(cooperativeId)`
  - `submitBaselineMeasurement(cooperativeId, baseline)`
  - `getMonthlyProgress(cooperativeId, month)`
  - `submitMonthlyProgress(cooperativeId, month, progress)`
  - `getImpactSummary(cooperativeId)`

### Marketplace Services (`src/features/marketplace/services/`)

**matchingService.ts**
- `findSuppliers(requirements, cooperatives)` - Finds suppliers matching buyer requirements
- `findBuyers(product, cooperative, buyerProfiles)` - Finds buyers for supplier products (placeholder)
- `scoreMatch(product, cooperative, requirements)` - Scores a product-cooperative match (internal)

**Matching Logic:**
- Base score: 30 points for matching product
- Certifications: +30 points if all required certifications present
- Region match: +20 points
- EUDR compliance: +20 points if verified
- Quantity bonus: +5-10 points based on availability
- Maximum score: 100 points

---

## 4. Marketplace / Transaction / Pricing Logic

### Pricing Fields

**Products:**
- `price` (DECIMAL 10,2) - Product price
- `currency` (VARCHAR 10, default: 'XOF') - Currency code
- `unit` (VARCHAR 50) - Unit of measurement (kg, ton, bag, etc.)
- `quantity_available` (DECIMAL 10,2) - Available quantity

**Orders:**
- `total_amount` (DECIMAL 10,2) - Total order amount
- `currency` (VARCHAR 10, default: 'XOF') - Currency code

**Order Items:**
- `unit_price` (DECIMAL 10,2) - Price per unit at time of order
- `total_price` (DECIMAL 10,2) - Total price for line item (quantity × unit_price)

### Transaction Flow

**Order Status Lifecycle:**
1. `pending` - Order created, awaiting confirmation
2. `confirmed` - Order confirmed by cooperative
3. `processing` - Order being prepared
4. `shipped` - Order shipped
5. `delivered` - Order delivered
6. `cancelled` - Order cancelled

**Order Creation Process:**
1. Buyer creates order with `createOrder(order, items)`
2. Order record created in `orders` table
3. Order items created in `order_items` table
4. Total amount calculated from items
5. Status set to 'pending' by default

**Order Status Updates:**
- `updateOrderStatus(orderId, status)` updates order status
- If status is 'delivered', `completed_at` timestamp is set automatically

### Marketplace Matching Logic

**Buyer Request Matching:**
- Buyers create requests via `ag_buyer_requests` table
- Matching algorithm scores cooperatives against requirements
- Matches stored in `ag_request_matches` with `match_score` (0-100)
- Match status: `suggested` → `shortlisted` → `contacted` → `rejected`

**Matching Criteria (from `matchingService.ts`):**
- Product name match
- Category match
- Minimum quantity availability
- Maximum price constraint
- Required certifications
- Region preference
- EUDR compliance requirement

**Match Scoring Algorithm:**
- Base score: 30 points (product available)
- Certifications: +30 points (all required certs present)
- Region match: +20 points
- EUDR compliance: +20 points (if verified)
- Quantity bonus: +5-10 points (based on availability vs. requirement)
- Maximum score: 100 points

### Value Tracking / Pricing Metrics

**Baseline Measurements:**
- `avg_days_to_negotiate_price` - Average days to negotiate price
- `percentage_sales_at_optimal_price` - Percentage of sales at optimal price
- `market_price_access_frequency_per_week` - Market price access frequency

**Monthly Progress:**
- `avg_price_improvement_percentage` - Average price improvement percentage
- `baseline_avg_price` - Baseline average price
- `current_avg_price` - Current average price
- `total_volume_sold_tons` - Total volume sold
- `total_revenue_usd` - Total revenue in USD

**Impact Metrics:**
- `admin_cost_saved_usd` - Administrative cost savings
- `price_improvement_usd` - Price improvement value in USD
- `improvement_percentage` - Overall improvement percentage

### Payment/Transaction Processing

**Current Implementation:**
- No explicit payment gateway integration found
- Orders track `total_amount` and `currency`
- No commission/fee calculation logic found in codebase
- Transaction status tracking via order status field

**Transaction References:**
- Legacy `Transaction` type exists in types but appears unused
- Current implementation uses `Order` and `OrderItem` model
- Batch transactions exist for traceability (`batch_transactions`)

### Marketplace Features

**Product Search/Filtering:**
- Product search by name, category
- Price range filtering (minPrice, maxPrice)
- Quantity availability filtering
- Active products only (`is_active = true`)

**Cooperative Filtering:**
- By region
- By department
- By commodity
- By verification status
- By country

**Buyer Request Features:**
- Create buyer requests with volume requirements
- Specify commodity, country, certifications
- EUDR and child labor requirements
- Automatic matching with cooperatives
- Match scoring and ranking

---

## Summary

### Technology Stack
- **Frontend:** React 18.3.1, TypeScript, Vite
- **Routing:** React Router DOM 6.22.1
- **Database:** Supabase (PostgreSQL with `agrosoluce` schema)
- **UI:** Tailwind CSS, Lucide React icons
- **Maps:** Leaflet, React Leaflet
- **Charts:** Chart.js, React Chart.js 2
- **State Management:** React hooks (no Redux/Zustand found)

### Key Architectural Patterns
- Feature-based folder structure (`src/features/`)
- API layer separation (`api/` folders)
- Component composition
- Service layer for business logic
- TypeScript for type safety
- Supabase for backend/database

### Data Flow
1. Frontend components call API functions
2. API functions use Supabase client
3. Supabase queries `agrosoluce` schema tables
4. Data transformed to TypeScript types
5. Components render with data

### Notable Gaps/Observations
- No payment gateway integration
- No commission/fee calculation logic
- No explicit transaction fees
- Matching algorithm is rule-based (not ML-based)
- Enrichment service provides context only (not legal guarantees)
- Phase 1 data enrichment is partially implemented
- Admin and auth pages exist but not detailed

---

**End of Baseline Documentation**

