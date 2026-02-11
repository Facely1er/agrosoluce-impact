# Cooperative Dashboard Alignment Review

## Executive Summary

This document reviews the alignment between the current database schema and the **AgroSoluce Cooperative Dashboard** requirements. It identifies what exists, what's missing, and what needs to be added or modified.

**Overall Status**: ⚠️ **Partial Alignment** - Core structures exist but need enhancements for full dashboard functionality.

---

## 1️⃣ Dashboard Home (Executive Overview)

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Readiness Status Badge** | ❌ Missing | Not calculated or stored | Need computed field/function |
| **Evidence Coverage** | ⚠️ Partial | `field_declarations`, `certifications` exist | Need aggregation queries |
| **Active Lots** | ⚠️ Partial | `products` table exists | Need "lot" concept with status |
| **Buyer Interest** | ⚠️ Partial | `ag_buyer_requests` exists | Need status tracking (new/reviewed/responded) |
| **Urgent Alerts** | ❌ Missing | No notifications system | Need alerts/notifications table |

### What Exists ✅
- `cooperatives` table with basic info
- `field_declarations` for plot evidence
- `certifications` for compliance
- `ag_buyer_requests` for buyer interest

### What's Missing ❌
- **Readiness status calculation** (Not Ready / In Progress / Buyer-Ready)
- **Evidence coverage metrics** (X/Y farmers, X/Y plots, X/Y documents)
- **Notifications/alerts system**
- **Lot status tracking** (draft/active/on hold)

### Recommendations
1. Create `cooperative_readiness_status` computed view
2. Create `evidence_coverage_metrics` view
3. Add `notifications` table
4. Enhance `products` table to support "lots" concept

---

## 2️⃣ Cooperative Profile Management

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Legal name** | ✅ Exists | `cooperatives.name` | Good |
| **Country/region** | ✅ Exists | `cooperatives.country`, `region` | Good |
| **Registration ID** | ⚠️ Partial | Not explicitly stored | Add `registration_id` field |
| **Main crops** | ✅ Exists | `cooperatives.commodity`, `products` | Good |
| **Annual volume** | ✅ Exists | `cooperatives.annual_volume_tons` | Good |
| **Certifications** | ✅ Exists | `certifications` table | Good |
| **Public description** | ⚠️ Partial | `cooperatives.description` exists | Good |
| **Status (admin)** | ❌ Missing | No status field | Add `status` (pending/approved/rejected) |
| **Verification level** | ❌ Missing | No verification field | Add `verification_level` |

### What Exists ✅
- Basic cooperative fields
- Certifications table
- Description field

### What's Missing ❌
- `status` field (pending/approved/rejected)
- `verification_level` field (self-declared/docs reviewed)
- `registration_id` field

### Recommendations
```sql
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_level VARCHAR(50) DEFAULT 'self_declared'
    CHECK (verification_level IN ('self_declared', 'docs_reviewed'));
```

---

## 3️⃣ Farmer Registry (Coop-Managed)

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Farmer List Table** | ✅ Exists | `farmers` table | Good |
| **Internal Farmer ID** | ✅ Exists | `farmers.registration_number` | Good |
| **Village/Area** | ⚠️ Partial | `farmers.location_description` | Could add `village` field |
| **Crop type** | ⚠️ Partial | Enrichment adds `primary_crop` | Good |
| **Number of plots** | ⚠️ Partial | Need to count from `field_declarations` | Need computed field |
| **Declaration status** | ⚠️ Partial | `attestations` exists | Need specific declaration types |

### What Exists ✅
- `farmers` table with basic info
- `field_declarations` for plots
- `attestations` for declarations

### What's Missing ❌
- **Specific declaration types** (child labor, land-use legitimacy)
- **Declaration status tracking** (complete/partial/missing)
- **Plot count per farmer** (computed)

### Recommendations
1. Enhance `attestations` to track specific declaration types:
   ```sql
   -- Add declaration_type to attestations or create farmer_declarations table
   CREATE TABLE IF NOT EXISTS agrosoluce.farmer_declarations (
       id UUID PRIMARY KEY,
       farmer_id UUID REFERENCES farmers(id),
       declaration_type VARCHAR(50) CHECK (declaration_type IN ('child_labor', 'land_use_legitimacy')),
       declared_value BOOLEAN,
       declaration_date DATE,
       ...
   );
   ```

2. Create view for farmer registry:
   ```sql
   CREATE VIEW farmer_registry_summary AS
   SELECT 
       f.*,
       COUNT(DISTINCT fd.id) AS plot_count,
       -- Declaration status logic
   FROM farmers f
   LEFT JOIN field_declarations fd ON fd.farmer_id = f.id
   ...
   ```

---

## 4️⃣ Plot & Land Records

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Plot reference ID** | ⚠️ Partial | `field_declarations.id` | Could add `plot_reference_id` |
| **GPS location** | ✅ Exists | `field_declarations` has lat/long | Good |
| **Crop type** | ✅ Exists | `field_declarations.crop_type` | Good |
| **Declared land status** | ⚠️ Partial | Not explicitly stored | Add `land_status` field |
| **Linked evidence files** | ⚠️ Partial | No document linking | Need documents table |
| **Plot documented indicator** | ⚠️ Partial | Can compute from data | Need computed field |
| **Geo-reference indicator** | ✅ Exists | Can check lat/long presence | Good |

### What Exists ✅
- `field_declarations` with GPS coordinates
- Crop type and area tracking

### What's Missing ❌
- **Plot reference ID** (human-readable)
- **Land status** (declared field)
- **Document linking** to plots
- **Evidence completeness indicators**

### Recommendations
```sql
ALTER TABLE agrosoluce.field_declarations
ADD COLUMN IF NOT EXISTS plot_reference_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS land_status VARCHAR(100), -- 'legitimate', 'under_review', etc.
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false;
```

---

## 5️⃣ Compliance & Document Center

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Document Categories** | ⚠️ Partial | `certifications`, `attestations` | Need unified documents table |
| **Document metadata** | ⚠️ Partial | Some tables have `document_url` | Need comprehensive structure |
| **Upload tracking** | ❌ Missing | No upload metadata | Need documents table |
| **Expiry tracking** | ⚠️ Partial | `certifications.expiry_date` | Good for certs, need for all docs |
| **Visibility control** | ❌ Missing | No visibility flags | Need `is_internal_only` field |
| **Expiring soon alerts** | ❌ Missing | No alert system | Need computed field/view |

### What Exists ✅
- `certifications` with expiry dates
- `attestations` table
- Some `document_url` fields

### What's Missing ❌
- **Unified documents table** for all evidence types
- **Upload metadata** (uploaded_by, upload_date)
- **Visibility controls** (internal vs buyer-visible)
- **Expiry alerts** system

### Recommendations
```sql
CREATE TABLE IF NOT EXISTS agrosoluce.documents (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(50), -- 'cooperative', 'farmer', 'plot', 'lot'
    entity_id UUID,
    document_type VARCHAR(100), -- 'certification', 'policy', 'plot_evidence', 'other'
    title VARCHAR(255),
    file_url TEXT,
    uploaded_by UUID REFERENCES user_profiles(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    expiry_date DATE,
    is_internal_only BOOLEAN DEFAULT false,
    is_buyer_visible BOOLEAN DEFAULT false,
    ...
);
```

---

## 6️⃣ Product Lots Management

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Lot creation/edit** | ⚠️ Partial | `products` table exists | Need "lot" concept |
| **Crop** | ✅ Exists | `products` has category | Good |
| **Harvest season** | ⚠️ Partial | `products.harvest_date` | Could add season field |
| **Volume range** | ✅ Exists | `products.quantity_available` | Good |
| **Quality grade** | ❌ Missing | Not stored | Add `quality_grade` field |
| **Lot status** | ❌ Missing | Only `is_active` boolean | Need status (draft/active/on_hold) |
| **Evidence completeness** | ❌ Missing | No tracking | Need computed field |
| **Evidence warnings** | ❌ Missing | No warning system | Need computed checks |

### What Exists ✅
- `products` table with basic info
- Harvest date
- Quantity available

### What's Missing ❌
- **Lot status** (draft/active/on_hold)
- **Quality grade**
- **Evidence completeness tracking**
- **Warning system** for incomplete evidence

### Recommendations
```sql
ALTER TABLE agrosoluce.products
ADD COLUMN IF NOT EXISTS lot_status VARCHAR(50) DEFAULT 'draft'
    CHECK (lot_status IN ('draft', 'active', 'on_hold')),
ADD COLUMN IF NOT EXISTS quality_grade VARCHAR(50),
ADD COLUMN IF NOT EXISTS harvest_season VARCHAR(50),
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS evidence_warnings TEXT[]; -- Array of warning messages
```

---

## 7️⃣ Buyer Requests & Opportunities

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Contact Requests Inbox** | ⚠️ Partial | `ag_buyer_requests` exists | Need status tracking |
| **Buyer organization** | ✅ Exists | `buyer_org` field | Good |
| **Lots requested** | ⚠️ Partial | Not linked to products | Need linking table |
| **Expected volume** | ✅ Exists | `min_volume_tons`, `max_volume_tons` | Good |
| **Incoterms preference** | ❌ Missing | Not stored | Add field |
| **Message** | ❌ Missing | No message field | Add `message` field |
| **Status tracking** | ⚠️ Partial | Has status but not coop-focused | Need (new/reviewed/responded/closed) |
| **Response tracking** | ❌ Missing | No response metadata | Add response fields |

### What Exists ✅
- `ag_buyer_requests` table
- Basic buyer info
- Volume requirements

### What's Missing ❌
- **Message field** for buyer communication
- **Cooperative status** (new/reviewed/responded/closed)
- **Response tracking** (responded_at, response_method)
- **Incoterms preference**
- **Link to specific lots/products**

### Recommendations
```sql
ALTER TABLE agrosoluce.ag_buyer_requests
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS incoterms_preference VARCHAR(100),
ADD COLUMN IF NOT EXISTS coop_status VARCHAR(50) DEFAULT 'new'
    CHECK (coop_status IN ('new', 'reviewed', 'responded', 'closed')),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS response_method VARCHAR(50), -- 'email', 'phone', 'platform'
ADD COLUMN IF NOT EXISTS response_notes TEXT;

-- Link requests to products/lots
CREATE TABLE IF NOT EXISTS agrosoluce.buyer_request_lots (
    request_id UUID REFERENCES ag_buyer_requests(id),
    product_id UUID REFERENCES products(id),
    ...
);
```

---

## 8️⃣ Readiness & Gap Guidance

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Readiness Checklist** | ❌ Missing | No checklist system | Need checklist table |
| **Missing items tracking** | ❌ Missing | No gap tracking | Need gap analysis |
| **Effort level** | ❌ Missing | Not stored | Add effort field |
| **Actionable guidance** | ❌ Missing | No guidance system | Need guidance content |

### What Exists ✅
- Data exists to compute gaps
- Evidence tables exist

### What's Missing ❌
- **Readiness checklist** table
- **Gap tracking** system
- **Guidance content** storage

### Recommendations
```sql
CREATE TABLE IF NOT EXISTS agrosoluce.readiness_checklist (
    id UUID PRIMARY KEY,
    cooperative_id UUID REFERENCES cooperatives(id),
    checklist_item VARCHAR(255), -- 'farmer_declarations', 'plot_geo_references', etc.
    status VARCHAR(50) CHECK (status IN ('complete', 'partial', 'missing')),
    missing_count INTEGER,
    total_required INTEGER,
    effort_level VARCHAR(50) CHECK (effort_level IN ('low', 'medium', 'high')),
    guidance_text TEXT,
    last_checked_at TIMESTAMP,
    ...
);
```

---

## 9️⃣ Buyer-Facing Summary Preview

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Readiness badge** | ❌ Missing | Not computed | Need computed field |
| **Evidence coverage %** | ⚠️ Partial | Can compute | Need view/function |
| **Certifications summary** | ✅ Exists | `certifications` table | Good |
| **Lot availability** | ⚠️ Partial | `products` exists | Need active lots count |
| **Risk flags** | ⚠️ Partial | `compliance_flags` exists | Need high-level summary |

### What Exists ✅
- Certifications data
- Compliance flags
- Products/lots data

### What's Missing ❌
- **Buyer-facing summary view**
- **Readiness badge calculation**
- **Evidence coverage percentages**

### Recommendations
```sql
CREATE VIEW buyer_facing_summary AS
SELECT 
    c.id,
    c.name,
    -- Readiness badge calculation
    CASE 
        WHEN readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_badge,
    -- Evidence coverage
    (farmers_documented::NUMERIC / total_farmers * 100) AS farmer_coverage_pct,
    (plots_geo_referenced::NUMERIC / total_plots * 100) AS plot_coverage_pct,
    -- Certifications summary
    array_agg(DISTINCT cert.certification_type) AS certifications,
    -- Active lots
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots,
    -- Risk flags (high-level)
    c.compliance_flags->>'childLaborRisk' AS child_labor_risk,
    c.compliance_flags->>'eudrReady' AS eudr_ready
FROM cooperatives c
...
```

---

## 🔟 Notifications & Alerts

### Required Features

| Feature | Status | Current Implementation | Gap Analysis |
|---------|--------|----------------------|--------------|
| **Notification system** | ❌ Missing | No notifications table | Need full system |
| **Alert types** | ❌ Missing | Not defined | Need alert types |
| **In-app notifications** | ❌ Missing | No system | Need notifications table |
| **Email notifications** | ❌ Missing | No email flags | Need email preferences |

### What Exists ✅
- Nothing - completely missing

### What's Missing ❌
- **Notifications table**
- **Alert types** (new request, expiring doc, etc.)
- **Email preferences**

### Recommendations
```sql
CREATE TABLE IF NOT EXISTS agrosoluce.notifications (
    id UUID PRIMARY KEY,
    user_profile_id UUID REFERENCES user_profiles(id),
    notification_type VARCHAR(100), -- 'new_buyer_request', 'expiring_document', 'admin_status_change', 'system_warning'
    title VARCHAR(255),
    message TEXT,
    entity_type VARCHAR(50), -- 'cooperative', 'request', 'document', etc.
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    send_email BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    ...
);
```

---

## Summary: Required Migrations

### High Priority (Core Dashboard Features)

1. **Cooperative Profile Enhancements**
   - Add `status`, `verification_level`, `registration_id`

2. **Product Lots Enhancement**
   - Add `lot_status`, `quality_grade`, `harvest_season`, `evidence_complete`, `evidence_warnings`

3. **Buyer Requests Enhancement**
   - Add `message`, `coop_status`, response tracking fields, `incoterms_preference`

4. **Documents Table**
   - Unified documents table for all evidence types

5. **Farmer Declarations**
   - Specific declaration types (child labor, land-use)

6. **Notifications System**
   - Complete notifications and alerts system

### Medium Priority (Enhanced Features)

7. **Readiness Checklist**
   - Gap tracking and guidance system

8. **Buyer-Facing Summary View**
   - Computed view for buyer preview

9. **Plot Enhancements**
   - Plot reference IDs, land status, evidence linking

### Low Priority (Nice to Have)

10. **Enhanced Views**
    - Dashboard summary views
    - Evidence coverage metrics
    - Readiness calculations

---

## Next Steps

1. **Create migration file**: `010_cooperative_dashboard_enhancements.sql`
2. **Implement high-priority features** first
3. **Test with sample data**
4. **Create dashboard views** for easy querying
5. **Document API endpoints** needed for frontend

---

**Status**: Ready to create enhancement migration file.

