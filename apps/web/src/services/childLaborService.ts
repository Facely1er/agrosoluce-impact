/**
 * Child Labor Monitoring Service
 * Handles all database interactions for child labor monitoring and documentation tracking
 * Note: This service tracks self-assessments and documentation, not compliance determinations
 */

import { supabase } from '@/lib/supabase';
import type {
  ChildLaborAssessment,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  RemediationAction,
  CreateRemediationRequest,
  LaborCertificationRecord,
  SocialImpactMetrics,
  CooperativeComplianceStatus, // Legacy type
  AssessmentFilters,
} from '@/types/child-labor-monitoring-types';

export class ChildLaborService {
  // ========================================
  // ASSESSMENTS
  // ========================================

  /**
   * Create a new child labor assessment
   */
  static async createAssessment(
    data: CreateAssessmentRequest
  ): Promise<ChildLaborAssessment> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: assessment, error } = await supabase
      .from('child_labor_assessments')
      .insert([{
        cooperative_id: data.cooperativeId,
        assessment_period_start: data.assessmentPeriodStart,
        assessment_period_end: data.assessmentPeriodEnd,
        total_children_in_community: data.totalChildrenInCommunity,
        children_enrolled_school: data.childrenEnrolledSchool,
        minimum_working_age: data.minimumWorkingAge,
        total_workers_assessed: data.totalWorkersAssessed,
        underage_workers_found: data.underageWorkersFound,
        age_verification_method: data.ageVerificationMethod,
        child_labor_violations: data.childLaborViolations,
        hazardous_work_violations: data.hazardousWorkViolations,
        worst_forms_violations: data.worstFormsViolations,
        violation_details: data.violationDetails || [],
        assessor_name: data.assessorName,
        assessor_organization: data.assessorOrganization,
        assessor_notes: data.assessorNotes,
        evidence_documents: data.evidenceDocuments || [],
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapAssessmentFromDB(assessment);
  }

  /**
   * Get assessment by ID
   */
  static async getAssessment(id: string): Promise<ChildLaborAssessment | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('child_labor_assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }

    return this.mapAssessmentFromDB(data);
  }

  /**
   * Get all assessments for a cooperative
   */
  static async getCooperativeAssessments(
    cooperativeId: string
  ): Promise<ChildLaborAssessment[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('child_labor_assessments')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('assessment_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapAssessmentFromDB);
  }

  /**
   * Get latest assessment for cooperative
   */
  static async getLatestAssessment(
    cooperativeId: string
  ): Promise<ChildLaborAssessment | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('child_labor_assessments')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapAssessmentFromDB(data);
  }

  /**
   * Search assessments with filters
   */
  static async searchAssessments(
    filters: AssessmentFilters
  ): Promise<ChildLaborAssessment[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    let query = supabase.from('child_labor_assessments').select('*');

    if (filters.cooperativeId) {
      query = query.eq('cooperative_id', filters.cooperativeId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    // Support both new and legacy filter names
    const minScore = filters.minReadinessScore ?? filters.minComplianceScore;
    const maxScore = filters.maxReadinessScore ?? filters.maxComplianceScore;
    if (minScore !== undefined) {
      // Query readiness_score (migration adds this column and trigger syncs with compliance_score)
      query = query.gte('readiness_score', minScore);
    }
    if (maxScore !== undefined) {
      query = query.lte('readiness_score', maxScore);
    }
    if (filters.dateFrom) {
      query = query.gte('assessment_date', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('assessment_date', filters.dateTo);
    }
    if (filters.hasViolations !== undefined) {
      if (filters.hasViolations) {
        query = query.gt('child_labor_violations', 0);
      } else {
        query = query.eq('child_labor_violations', 0);
      }
    }
    if (filters.violationSeverity) {
      query = query.eq('violation_severity', filters.violationSeverity);
    }

    const { data, error } = await query.order('assessment_date', {
      ascending: false,
    });

    if (error) throw new Error(error.message);
    return data.map(this.mapAssessmentFromDB);
  }

  /**
   * Update an assessment
   */
  static async updateAssessment(
    id: string,
    updates: UpdateAssessmentRequest
  ): Promise<ChildLaborAssessment> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('child_labor_assessments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapAssessmentFromDB(data);
  }

  // ========================================
  // REMEDIATION ACTIONS
  // ========================================

  /**
   * Create remediation action
   */
  static async createRemediationAction(
    data: CreateRemediationRequest
  ): Promise<RemediationAction> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: action, error } = await supabase
      .from('remediation_actions')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRemediationFromDB(action);
  }

  /**
   * Get remediation actions for assessment
   */
  static async getRemediationActions(
    assessmentId: string
  ): Promise<RemediationAction[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('remediation_actions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('start_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapRemediationFromDB);
  }

  /**
   * Update remediation action progress
   */
  static async updateRemediationProgress(
    id: string,
    progressPercentage: number,
    note: string
  ): Promise<RemediationAction> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Get current action to append note
    const { data: current } = await supabase
      .from('remediation_actions')
      .select('progress_notes')
      .eq('id', id)
      .single();

    const progressNotes = current?.progress_notes || [];
    progressNotes.push({
      date: new Date().toISOString(),
      note,
      progress: progressPercentage,
    });

    const { data, error } = await supabase
      .from('remediation_actions')
      .update({
        progress_percentage: progressPercentage,
        progress_notes: progressNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRemediationFromDB(data);
  }

  // ========================================
  // CERTIFICATIONS
  // ========================================

  /**
   * Get certifications for cooperative
   */
  static async getCooperativeCertifications(
    cooperativeId: string
  ): Promise<LaborCertificationRecord[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('labor_certifications')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('issue_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapCertificationFromDB);
  }

  /**
   * Get active certifications
   */
  static async getActiveCertifications(
    cooperativeId: string
  ): Promise<LaborCertificationRecord[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('labor_certifications')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true);

    if (error) throw new Error(error.message);
    return data.map(this.mapCertificationFromDB);
  }

  // ========================================
  // SOCIAL IMPACT METRICS
  // ========================================

  /**
   * Get social impact metrics for cooperative
   */
  static async getSocialImpactMetrics(
    cooperativeId: string
  ): Promise<SocialImpactMetrics[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('social_impact_metrics')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('measurement_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapImpactFromDB);
  }

  /**
   * Get latest social impact for cooperative
   */
  static async getLatestSocialImpact(
    cooperativeId: string
  ): Promise<SocialImpactMetrics | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('social_impact_metrics')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('measurement_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapImpactFromDB(data);
  }

  // ========================================
  // COMPLIANCE STATUS (VIEW)
  // ========================================

  /**
   * Get cooperative readiness status (self-assessment data)
   * Note: This returns self-assessment data, not compliance determinations
   */
  static async getComplianceStatus(
    cooperativeId?: string
  ): Promise<CooperativeComplianceStatus[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    let query = supabase.from('cooperative_readiness_status').select('*');

    if (cooperativeId) {
      query = query.eq('cooperative_id', cooperativeId);
    }

    const { data, error } = await query      .order('readiness_score', {
      ascending: false,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  // ========================================
  // ANALYTICS
  // ========================================

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Try new function first, fallback to old for backward compatibility
    let { data, error } = await supabase.rpc('get_readiness_dashboard_stats');
    if (error) {
      // Fallback to old function name if new one doesn't exist yet
      const fallback = await supabase.rpc('get_compliance_dashboard_stats');
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Get regional compliance breakdown
   */
  static async getRegionalCompliance() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('cooperative_readiness_status')
      .select('region, readiness_score, compliance_score, child_labor_violations');

    if (error) throw new Error(error.message);

    // Group by region
    const regionMap = new Map();
    data.forEach((row) => {
      if (!regionMap.has(row.region)) {
        regionMap.set(row.region, {
          region: row.region,
          totalScore: 0,
          count: 0,
          violations: 0,
        });
      }
      const region = regionMap.get(row.region);
      // Use readiness_score, fallback to compliance_score for backward compatibility
      region.totalScore += row.readiness_score || row.compliance_score || 0;
      region.count += 1;
      region.violations += row.child_labor_violations || 0;
    });

    return Array.from(regionMap.values()).map((r) => ({
      region: r.region,
      averageScore: r.count > 0 ? r.totalScore / r.count : 0,
      cooperatives: r.count,
      totalViolations: r.violations,
    }));
  }

  // ========================================
  // MAPPING FUNCTIONS (DB to TypeScript)
  // ========================================

  private static mapAssessmentFromDB(data: any): ChildLaborAssessment {
    return {
      id: data.id,
      cooperativeId: data.cooperative_id,
      assessorId: data.assessor_id,
      assessmentDate: data.assessment_date,
      assessmentPeriodStart: data.assessment_period_start,
      assessmentPeriodEnd: data.assessment_period_end,
      status: data.status,
      totalChildrenInCommunity: data.total_children_in_community,
      childrenEnrolledSchool: data.children_enrolled_school,
      schoolEnrollmentRate: data.school_enrollment_rate,
      minimumWorkingAge: data.minimum_working_age,
      totalWorkersAssessed: data.total_workers_assessed,
      underageWorkersFound: data.underage_workers_found,
      ageVerificationMethod: data.age_verification_method,
      childLaborViolations: data.child_labor_violations,
      hazardousWorkViolations: data.hazardous_work_violations,
      worstFormsViolations: data.worst_forms_violations,
      violationSeverity: data.violation_severity,
      violationDetails: data.violation_details,
      readinessScore: data.compliance_score, // Map DB column to readinessScore
      complianceScore: data.compliance_score, // Legacy field for backward compatibility
      evidenceDocuments: data.evidence_documents,
      photographs: data.photographs,
      witnessStatements: data.witness_statements,
      assessorName: data.assessor_name,
      assessorOrganization: data.assessor_organization,
      assessorCertification: data.assessor_certification,
      assessorNotes: data.assessor_notes,
      nextAssessmentDue: data.next_assessment_due,
      assessmentFrequencyMonths: data.assessment_frequency_months,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
    };
  }

  private static mapRemediationFromDB(data: any): RemediationAction {
    return {
      id: data.id,
      assessmentId: data.assessment_id,
      cooperativeId: data.cooperative_id,
      actionType: data.action_type,
      description: data.description,
      targetBeneficiaries: data.target_beneficiaries,
      actualBeneficiaries: data.actual_beneficiaries,
      status: data.status,
      startDate: data.start_date,
      targetCompletionDate: data.target_completion_date,
      actualCompletionDate: data.actual_completion_date,
      estimatedCost: data.estimated_cost,
      actualCost: data.actual_cost,
      fundingSource: data.funding_source,
      progressPercentage: data.progress_percentage,
      progressNotes: data.progress_notes,
      childrenReturnedToSchool: data.children_returned_to_school,
      familiesSupported: data.families_supported,
      incomeImprovementPercentage: data.income_improvement_percentage,
      alternativeJobsCreated: data.alternative_jobs_created,
      evidenceDocuments: data.evidence_documents,
      progressPhotos: data.progress_photos,
      beneficiaryTestimonials: data.beneficiary_testimonials,
      responsiblePerson: data.responsible_person,
      responsibleOrganization: data.responsible_organization,
      partnerOrganizations: data.partner_organizations,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at,
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
    };
  }

  private static mapCertificationFromDB(data: any): LaborCertificationRecord {
    return {
      id: data.id,
      cooperativeId: data.cooperative_id,
      certificationType: data.certification_type,
      certificationNumber: data.certification_number,
      issuingOrganization: data.issuing_organization,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      isActive: data.is_active,
      lastAuditDate: data.last_audit_date,
      nextAuditDate: data.next_audit_date,
      auditScore: data.audit_score,
      auditFindings: data.audit_findings,
      certificateDocumentUrl: data.certificate_document_url,
      auditReportUrl: data.audit_report_url,
      supportingDocuments: data.supporting_documents,
      certificationConditions: data.certification_conditions,
      notes: data.notes,
      renewalStatus: data.renewal_status,
      renewalApplicationDate: data.renewal_application_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private static mapImpactFromDB(data: any): SocialImpactMetrics {
    return {
      id: data.id,
      cooperativeId: data.cooperative_id,
      measurementDate: data.measurement_date,
      measurementPeriodStart: data.measurement_period_start,
      measurementPeriodEnd: data.measurement_period_end,
      childrenEnrolledTotal: data.children_enrolled_total,
      childrenEnrolledNew: data.children_enrolled_new,
      schoolAttendanceRate: data.school_attendance_rate,
      scholarshipRecipients: data.scholarship_recipients,
      schoolsBuiltOrRenovated: data.schools_built_or_renovated,
      familyIncomeIncreaseAvg: data.family_income_increase_avg,
      familyIncomeIncreasePercentage: data.family_income_increase_percentage,
      familiesReceivingAssistance: data.families_receiving_assistance,
      microloansProvided: data.microloans_provided,
      microloanTotalValue: data.microloan_total_value,
      youthJobsCreated: data.youth_jobs_created,
      adultJobsCreated: data.adult_jobs_created,
      womenEmployed: data.women_employed,
      vocationalTrainingParticipants: data.vocational_training_participants,
      familiesReceivingHealthcare: data.families_receiving_healthcare,
      nutritionProgramsParticipants: data.nutrition_programs_participants,
      safeDrinkingWaterAccessFamilies: data.safe_drinking_water_access_families,
      communityProjectsCompleted: data.community_projects_completed,
      communityInfrastructureInvestments: data.community_infrastructure_investments,
      cooperativeMemberSatisfactionScore: data.cooperative_member_satisfaction_score,
      baselineMeasurementId: data.baseline_measurement_id,
      yearOverYearImprovement: data.year_over_year_improvement,
      verifiedBy: data.verified_by,
      verificationDate: data.verification_date,
      verificationMethod: data.verification_method,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default ChildLaborService;

