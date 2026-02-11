-- Migration: Cooperative Dashboard Enhancements
-- Aligns database schema with AgroSoluce Cooperative Dashboard requirements
-- Adds missing fields, tables, and views for full dashboard functionality

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('010_cooperative_dashboard_enhancements', 'Cooperative Dashboard enhancements: profile management, lots, buyer requests, documents, declarations, notifications')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- 1. COOPERATIVE PROFILE ENHANCEMENTS
-- =============================================

-- Add status and verification level for admin control
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_level VARCHAR(50) DEFAULT 'self_declared'
    CHECK (verification_level IN ('self_declared', 'docs_reviewed')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT; -- Internal only, buyers never see this

CREATE INDEX IF NOT EXISTS idx_cooperatives_status ON agrosoluce.cooperatives(status);
CREATE INDEX IF NOT EXISTS idx_cooperatives_verification_level ON agrosoluce.cooperatives(verification_level);

-- =============================================
-- 2. PRODUCT LOTS ENHANCEMENTS
-- =============================================

-- Enhance products table to support "lots" concept
ALTER TABLE agrosoluce.products
ADD COLUMN IF NOT EXISTS lot_status VARCHAR(50) DEFAULT 'draft'
    CHECK (lot_status IN ('draft', 'active', 'on_hold')),
ADD COLUMN IF NOT EXISTS quality_grade VARCHAR(50), -- 'premium', 'standard', 'bulk'
ADD COLUMN IF NOT EXISTS harvest_season VARCHAR(50), -- '2024-2025', 'Q1 2024', etc.
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS evidence_warnings TEXT[]; -- Array of warning messages

CREATE INDEX IF NOT EXISTS idx_products_lot_status ON agrosoluce.products(lot_status);
CREATE INDEX IF NOT EXISTS idx_products_evidence_complete ON agrosoluce.products(evidence_complete);

-- =============================================
-- 3. BUYER REQUESTS ENHANCEMENTS
-- =============================================

-- Enhance buyer requests for cooperative dashboard
ALTER TABLE agrosoluce.ag_buyer_requests
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS incoterms_preference VARCHAR(100),
ADD COLUMN IF NOT EXISTS coop_status VARCHAR(50) DEFAULT 'new'
    CHECK (coop_status IN ('new', 'reviewed', 'responded', 'closed')),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_method VARCHAR(50) CHECK (response_method IN ('email', 'phone', 'platform', 'other')),
ADD COLUMN IF NOT EXISTS response_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_buyer_requests_coop_status ON agrosoluce.ag_buyer_requests(coop_status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_reviewed_at ON agrosoluce.ag_buyer_requests(reviewed_at);

-- Link buyer requests to specific products/lots
CREATE TABLE IF NOT EXISTS agrosoluce.buyer_request_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES agrosoluce.ag_buyer_requests(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES agrosoluce.products(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_buyer_request_lots_request_id ON agrosoluce.buyer_request_lots(request_id);
CREATE INDEX IF NOT EXISTS idx_buyer_request_lots_product_id ON agrosoluce.buyer_request_lots(product_id);

-- =============================================
-- 4. UNIFIED DOCUMENTS TABLE
-- =============================================

-- Centralized documents table for all evidence types
CREATE TABLE IF NOT EXISTS agrosoluce.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('cooperative', 'farmer', 'plot', 'lot', 'certification', 'other')),
    entity_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'certification', 'policy', 'plot_evidence', 'child_labor_declaration', 'land_use_declaration', 'other'
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE,
    is_internal_only BOOLEAN DEFAULT false,
    is_buyer_visible BOOLEAN DEFAULT false,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_entity ON agrosoluce.documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON agrosoluce.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON agrosoluce.documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON agrosoluce.documents(uploaded_at DESC);

-- =============================================
-- 5. FARMER DECLARATIONS TABLE
-- =============================================

-- Specific declarations for child labor and land-use legitimacy
CREATE TABLE IF NOT EXISTS agrosoluce.farmer_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES agrosoluce.farmers(id) ON DELETE CASCADE,
    declaration_type VARCHAR(50) NOT NULL CHECK (declaration_type IN ('child_labor', 'land_use_legitimacy')),
    declared_value BOOLEAN NOT NULL, -- true = compliant, false = non-compliant
    declaration_date DATE NOT NULL,
    signed_by VARCHAR(255), -- Name of person making declaration
    witness_name VARCHAR(255), -- Coop officer who witnessed
    witness_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    document_id UUID REFERENCES agrosoluce.documents(id) ON DELETE SET NULL, -- Link to uploaded document
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(farmer_id, declaration_type, declaration_date) -- One declaration per type per date
);

CREATE INDEX IF NOT EXISTS idx_farmer_declarations_farmer_id ON agrosoluce.farmer_declarations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_type ON agrosoluce.farmer_declarations(declaration_type);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_date ON agrosoluce.farmer_declarations(declaration_date DESC);

-- =============================================
-- 6. PLOT ENHANCEMENTS
-- =============================================

-- Enhance field_declarations to support plot concept better
ALTER TABLE agrosoluce.field_declarations
ADD COLUMN IF NOT EXISTS plot_reference_id VARCHAR(100), -- Human-readable plot ID
ADD COLUMN IF NOT EXISTS land_status VARCHAR(100), -- 'legitimate', 'under_review', 'disputed', etc.
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS linked_document_ids UUID[]; -- Array of document IDs

CREATE INDEX IF NOT EXISTS idx_field_declarations_plot_reference ON agrosoluce.field_declarations(plot_reference_id);
CREATE INDEX IF NOT EXISTS idx_field_declarations_land_status ON agrosoluce.field_declarations(land_status);
CREATE INDEX IF NOT EXISTS idx_field_declarations_evidence_complete ON agrosoluce.field_declarations(evidence_complete);

-- =============================================
-- 7. NOTIFICATIONS SYSTEM
-- =============================================

-- Comprehensive notifications and alerts system
CREATE TABLE IF NOT EXISTS agrosoluce.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL, -- 'new_buyer_request', 'expiring_document', 'admin_status_change', 'system_warning', 'missing_declaration', 'rejected_request'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'cooperative', 'request', 'document', 'farmer', 'lot', etc.
    entity_id UUID,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    send_email BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_sent_status VARCHAR(50), -- 'pending', 'sent', 'failed'
    action_url TEXT, -- URL to relevant page in dashboard
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_profile ON agrosoluce.notifications(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON agrosoluce.notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON agrosoluce.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON agrosoluce.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON agrosoluce.notifications(priority);

-- =============================================
-- 8. READINESS CHECKLIST
-- =============================================

-- Gap tracking and guidance system
CREATE TABLE IF NOT EXISTS agrosoluce.readiness_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    checklist_item VARCHAR(255) NOT NULL, -- 'farmer_declarations', 'plot_geo_references', 'required_documents', 'lot_evidence', etc.
    status VARCHAR(50) DEFAULT 'missing' CHECK (status IN ('complete', 'partial', 'missing')),
    missing_count INTEGER DEFAULT 0,
    total_required INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    effort_level VARCHAR(50) CHECK (effort_level IN ('low', 'medium', 'high')),
    guidance_text TEXT, -- Simple language explanation
    guidance_url TEXT, -- Link to help/documentation
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, checklist_item)
);

CREATE INDEX IF NOT EXISTS idx_readiness_checklist_cooperative ON agrosoluce.readiness_checklist(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_readiness_checklist_status ON agrosoluce.readiness_checklist(status);
CREATE INDEX IF NOT EXISTS idx_readiness_checklist_last_checked ON agrosoluce.readiness_checklist(last_checked_at DESC);

-- =============================================
-- 9. BUYER-FACING SUMMARY VIEW
-- =============================================

-- Computed view showing what buyers see
CREATE OR REPLACE VIEW agrosoluce.buyer_facing_summary AS
SELECT 
    c.id,
    c.name,
    c.country,
    c.region,
    c.commodity,
    c.annual_volume_tons,
    -- Readiness badge calculation
    CASE 
        WHEN readiness.readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness.readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_badge,
    -- Evidence coverage percentages
    COALESCE(
        ROUND((farmer_stats.documented_farmers::NUMERIC / NULLIF(farmer_stats.total_farmers, 0) * 100), 1),
        0
    ) AS farmer_coverage_pct,
    COALESCE(
        ROUND((plot_stats.geo_referenced_plots::NUMERIC / NULLIF(plot_stats.total_plots, 0) * 100), 1),
        0
    ) AS plot_coverage_pct,
    COALESCE(
        ROUND((doc_stats.required_docs_uploaded::NUMERIC / NULLIF(doc_stats.total_required_docs, 0) * 100), 1),
        0
    ) AS document_coverage_pct,
    -- Certifications summary
    array_agg(DISTINCT cert.certification_type) FILTER (WHERE cert.status = 'active') AS certifications,
    -- Active lots count
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots_count,
    -- Risk flags (high-level only)
    c.compliance_flags->>'childLaborRisk' AS child_labor_risk,
    c.compliance_flags->>'eudrReady' AS eudr_ready,
    -- Status (only approved cooperatives visible to buyers)
    c.status
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM agrosoluce.farmer_declarations fd 
            WHERE fd.farmer_id = f.id 
            AND fd.declaration_type = 'child_labor'
        )) AS documented_farmers,
        COUNT(*) AS total_farmers
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id AND f.is_active = true
) farmer_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL) AS geo_referenced_plots,
        COUNT(*) AS total_plots
    FROM agrosoluce.field_declarations fd
    WHERE fd.cooperative_id = c.id
) plot_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE is_buyer_visible = true) AS required_docs_uploaded,
        COUNT(*) AS total_required_docs
    FROM agrosoluce.documents d
    WHERE d.entity_type = 'cooperative' AND d.entity_id = c.id
) doc_stats ON true
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT 
        (
            CASE WHEN farmer_stats.documented_farmers > 0 THEN 20 ELSE 0 END +
            CASE WHEN plot_stats.geo_referenced_plots > 0 THEN 20 ELSE 0 END +
            CASE WHEN doc_stats.required_docs_uploaded > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT cert.id) > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') > 0 THEN 20 ELSE 0 END
        ) AS readiness_score
) readiness ON true
WHERE c.status = 'approved' -- Only show approved cooperatives to buyers
GROUP BY 
    c.id, c.name, c.country, c.region, c.commodity, c.annual_volume_tons,
    c.compliance_flags, c.status,
    farmer_stats.documented_farmers, farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots, plot_stats.total_plots,
    doc_stats.required_docs_uploaded, doc_stats.total_required_docs,
    readiness.readiness_score;

-- =============================================
-- 10. DASHBOARD SUMMARY VIEWS
-- =============================================

-- Executive overview metrics for dashboard home
CREATE OR REPLACE VIEW agrosoluce.dashboard_executive_overview AS
SELECT 
    c.id AS cooperative_id,
    c.name,
    -- Readiness status
    CASE 
        WHEN readiness.readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness.readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_status,
    readiness.readiness_score,
    -- Evidence coverage
    farmer_stats.documented_farmers,
    farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots,
    plot_stats.total_plots,
    doc_stats.uploaded_documents,
    doc_stats.required_documents,
    -- Active lots
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots,
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active' AND p.evidence_complete = false) AS lots_with_warnings,
    -- Buyer interest
    COUNT(DISTINCT br.id) FILTER (WHERE br.coop_status = 'new') AS new_buyer_requests,
    COUNT(DISTINCT br.id) FILTER (WHERE br.coop_status = 'reviewed') AS reviewed_requests,
    -- Urgent alerts
    COUNT(DISTINCT n.id) FILTER (WHERE n.is_read = false AND n.priority IN ('high', 'urgent')) AS urgent_alerts,
    COUNT(DISTINCT d.id) FILTER (WHERE d.expiry_date IS NOT NULL AND d.expiry_date < CURRENT_DATE + INTERVAL '90 days') AS expiring_documents
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM agrosoluce.farmer_declarations fd 
            WHERE fd.farmer_id = f.id 
            AND fd.declaration_type IN ('child_labor', 'land_use_legitimacy')
        )) AS documented_farmers,
        COUNT(*) AS total_farmers
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id AND f.is_active = true
) farmer_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL) AS geo_referenced_plots,
        COUNT(*) AS total_plots
    FROM agrosoluce.field_declarations fd
    WHERE fd.cooperative_id = c.id
) plot_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) AS uploaded_documents,
        COUNT(*) FILTER (WHERE is_buyer_visible = true) AS required_documents
    FROM agrosoluce.documents d
    WHERE d.entity_type = 'cooperative' AND d.entity_id = c.id
) doc_stats ON true
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.ag_buyer_requests br ON br.id IN (
    SELECT request_id FROM agrosoluce.ag_request_matches 
    WHERE cooperative_id = c.id
)
LEFT JOIN agrosoluce.notifications n ON n.user_profile_id = c.user_profile_id
LEFT JOIN agrosoluce.documents d ON d.entity_type = 'cooperative' AND d.entity_id = c.id
LEFT JOIN LATERAL (
    SELECT 
        (
            CASE WHEN farmer_stats.documented_farmers > 0 THEN 20 ELSE 0 END +
            CASE WHEN plot_stats.geo_referenced_plots > 0 THEN 20 ELSE 0 END +
            CASE WHEN doc_stats.uploaded_documents > 0 THEN 20 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.certifications WHERE cooperative_id = c.id AND status = 'active') THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') > 0 THEN 20 ELSE 0 END
        ) AS readiness_score
) readiness ON true
GROUP BY 
    c.id, c.name,
    farmer_stats.documented_farmers, farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots, plot_stats.total_plots,
    doc_stats.uploaded_documents, doc_stats.required_documents,
    readiness.readiness_score;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on new tables
ALTER TABLE agrosoluce.buyer_request_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.farmer_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.readiness_checklist ENABLE ROW LEVEL SECURITY;

-- Buyer request lots: cooperative members can view lots for their requests
CREATE POLICY "Cooperative members can view their request lots" ON agrosoluce.buyer_request_lots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.ag_buyer_requests br
            JOIN agrosoluce.ag_request_matches arm ON arm.request_id = br.id
            JOIN agrosoluce.cooperatives c ON c.id = arm.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE br.id = buyer_request_lots.request_id
            AND up.user_id = auth.uid()
        )
    );

-- Documents: cooperative members can manage their documents
CREATE POLICY "Cooperative members can view their documents" ON agrosoluce.documents
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
    );

CREATE POLICY "Cooperative members can upload documents" ON agrosoluce.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE id = documents.uploaded_by AND user_id = auth.uid()
        )
    );

-- Farmer declarations: cooperative members can manage declarations for their farmers
CREATE POLICY "Cooperative members can view farmer declarations" ON agrosoluce.farmer_declarations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = auth.uid()
        )
    );

CREATE POLICY "Cooperative members can create farmer declarations" ON agrosoluce.farmer_declarations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = auth.uid()
        )
    );

-- Notifications: users can only view their own notifications
CREATE POLICY "Users can view their notifications" ON agrosoluce.notifications
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their notifications" ON agrosoluce.notifications
    FOR UPDATE USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Readiness checklist: cooperative members can view their checklist
CREATE POLICY "Cooperative members can view their checklist" ON agrosoluce.readiness_checklist
    FOR SELECT USING (
        cooperative_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- =============================================
-- TRIGGERS
-- =============================================

-- Update updated_at for new tables
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON agrosoluce.documents
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_farmer_declarations_updated_at BEFORE UPDATE ON agrosoluce.farmer_declarations
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_readiness_checklist_updated_at BEFORE UPDATE ON agrosoluce.readiness_checklist
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.buyer_request_lots TO authenticated;
GRANT ALL ON agrosoluce.documents TO authenticated;
GRANT ALL ON agrosoluce.farmer_declarations TO authenticated;
GRANT ALL ON agrosoluce.notifications TO authenticated;
GRANT ALL ON agrosoluce.readiness_checklist TO authenticated;

GRANT SELECT ON agrosoluce.buyer_facing_summary TO authenticated;
GRANT SELECT ON agrosoluce.buyer_facing_summary TO anon;
GRANT SELECT ON agrosoluce.dashboard_executive_overview TO authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.buyer_request_lots IS 'Links buyer requests to specific product lots';
COMMENT ON TABLE agrosoluce.documents IS 'Unified documents table for all evidence types (certifications, policies, plot evidence, etc.)';
COMMENT ON TABLE agrosoluce.farmer_declarations IS 'Specific declarations for child labor and land-use legitimacy';
COMMENT ON TABLE agrosoluce.notifications IS 'Notifications and alerts system for cooperatives';
COMMENT ON TABLE agrosoluce.readiness_checklist IS 'Gap tracking and guidance system for cooperative readiness';
COMMENT ON VIEW agrosoluce.buyer_facing_summary IS 'What buyers see - computed summary of cooperative readiness and evidence';
COMMENT ON VIEW agrosoluce.dashboard_executive_overview IS 'Executive overview metrics for cooperative dashboard home page';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('010_cooperative_dashboard_enhancements', 'Cooperative Dashboard enhancements: profile management, lots, buyer requests, documents, declarations, notifications')
ON CONFLICT (migration_name) DO NOTHING;

