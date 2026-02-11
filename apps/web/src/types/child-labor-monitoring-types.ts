/**
 * =====================================================
 * AGROSOLUCE® CHILD LABOR MONITORING MODULE
 * TypeScript Type Definitions
 * =====================================================
 * Version: 1.0
 * Purpose: Type-safe interfaces for child labor monitoring and documentation tracking
 * Note: This module tracks documentation and self-assessments, not compliance determinations
 * =====================================================
 */

// =====================================================
// 1. ENUMERATIONS
// =====================================================

export enum AgeVerificationMethod {
  BirthCertificate = 'birth_certificate',
  NationalId = 'national_id',
  SchoolRecords = 'school_records',
  Biometric = 'biometric',
  VisualEstimate = 'visual_estimate',
  ParentAttestation = 'parent_attestation',
}

export enum ViolationSeverity {
  None = 'none',
  Minor = 'minor',
  Moderate = 'moderate',
  Severe = 'severe',
  Critical = 'critical',
}

export enum RemediationStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
  Verified = 'verified',
  Failed = 'failed',
}

export enum AssessmentStatus {
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  Verified = 'verified',
  Expired = 'expired',
  Disputed = 'disputed',
}

export enum LaborCertification {
  FairTrade = 'fair_trade',
  RainforestAlliance = 'rainforest_alliance',
  ILO140Compliant = 'ilo_140_compliant',
  ChildLaborFree = 'child_labor_free',
  USDAOrganic = 'usda_organic',
  EUOrganic = 'eu_organic',
  GlobalGAP = 'globalgap',
}

export enum ReadinessRating {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

// Legacy alias for backward compatibility during migration
/** @deprecated Use ReadinessRating instead. This will be removed in a future version. */
export const ComplianceRating = ReadinessRating;

// =====================================================
// 2. BASE INTERFACES
// =====================================================

export interface Violation {
  id: string;
  type: string;
  description: string;
  severity: ViolationSeverity;
  date: string;
  location?: string;
  childrenAffected: number;
  evidence?: string[];
}

export interface ProgressNote {
  date: string;
  author: string;
  note: string;
  status: RemediationStatus;
  milestonesAchieved?: string[];
}

export interface BeneficiaryTestimonial {
  date: string;
  beneficiaryName?: string; // Optional for privacy
  age?: number;
  relationship: string; // parent, child, community_member
  testimonial: string;
  consentGiven: boolean;
}

export interface CorrectiveAction {
  action: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  completionDate?: string;
  evidence?: string[];
}

// =====================================================
// 3. MAIN DATA MODELS
// =====================================================

export interface ChildLaborAssessment {
  // Primary Key
  id: string;

  // Relationships
  cooperativeId: string;
  assessorId?: string;

  // Assessment Details
  assessmentDate: string;
  assessmentPeriodStart: string;
  assessmentPeriodEnd: string;
  status: AssessmentStatus;

  // School Enrollment Data
  totalChildrenInCommunity: number;
  childrenEnrolledSchool: number;
  schoolEnrollmentRate: number; // Auto-calculated

  // Labor Verification
  minimumWorkingAge: number;
  totalWorkersAssessed: number;
  underageWorkersFound: number;
  ageVerificationMethod: AgeVerificationMethod;

  // Violations
  childLaborViolations: number;
  hazardousWorkViolations: number;
  worstFormsViolations: number; // ILO Convention 182
  violationSeverity: ViolationSeverity;
  violationDetails: Violation[];

  // Readiness Score (0-100, auto-calculated from self-assessment)
  // This is not a compliance determination - it reflects documentation and self-reported data
  readinessScore: number;
  
  // Legacy field for backward compatibility during migration
  /** @deprecated Use readinessScore instead. This will be removed in a future version. */
  complianceScore?: number;

  // Supporting Evidence
  evidenceDocuments: string[];
  photographs: string[];
  witnessStatements: WitnessStatement[];

  // Assessor Information
  assessorName: string;
  assessorOrganization?: string;
  assessorCertification?: string;
  assessorNotes?: string;

  // Next Assessment
  nextAssessmentDue?: string;
  assessmentFrequencyMonths: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface WitnessStatement {
  witnessName?: string; // Optional for anonymity
  witnessRole: string;
  date: string;
  statement: string;
  consentGiven: boolean;
}

export interface RemediationAction {
  // Primary Key
  id: string;

  // Relationships
  assessmentId: string;
  cooperativeId: string;

  // Action Details
  actionType: string;
  description: string;
  targetBeneficiaries: number;
  actualBeneficiaries: number;

  // Status Tracking
  status: RemediationStatus;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;

  // Financial Data
  estimatedCost?: number;
  actualCost?: number;
  fundingSource?: string;

  // Progress Tracking
  progressPercentage: number;
  progressNotes: ProgressNote[];

  // Outcomes
  childrenReturnedToSchool: number;
  familiesSupported: number;
  incomeImprovementPercentage?: number;
  alternativeJobsCreated: number;

  // Supporting Evidence
  evidenceDocuments: string[];
  progressPhotos: string[];
  beneficiaryTestimonials: BeneficiaryTestimonial[];

  // Responsible Parties
  responsiblePerson: string;
  responsibleOrganization?: string;
  partnerOrganizations: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface LaborCertificationRecord {
  // Primary Key
  id: string;

  // Relationships
  cooperativeId: string;

  // Certification Details
  certificationType: LaborCertification;
  certificationNumber?: string;
  issuingOrganization: string;

  // Validity Period
  issueDate: string;
  expiryDate: string;
  isActive: boolean; // Auto-calculated

  // Audit Information
  lastAuditDate?: string;
  nextAuditDate?: string;
  auditScore?: number;
  auditFindings: AuditFinding[];

  // Supporting Documents
  certificateDocumentUrl?: string;
  auditReportUrl?: string;
  supportingDocuments: string[];

  // Conditions & Notes
  certificationConditions: string[];
  notes?: string;

  // Renewal Tracking
  renewalStatus: 'active' | 'pending' | 'expired' | 'suspended';
  renewalApplicationDate?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AuditFinding {
  category: string;
  finding: string;
  severity: 'major' | 'minor' | 'observation';
  correctiveAction?: string;
  dueDate?: string;
  status: 'open' | 'closed' | 'pending';
}

export interface SocialImpactMetrics {
  // Primary Key
  id: string;

  // Relationships
  cooperativeId: string;

  // Measurement Period
  measurementDate: string;
  measurementPeriodStart: string;
  measurementPeriodEnd: string;

  // Education Impact
  childrenEnrolledTotal: number;
  childrenEnrolledNew: number;
  schoolAttendanceRate?: number;
  scholarshipRecipients: number;
  schoolsBuiltOrRenovated: number;

  // Economic Impact
  familyIncomeIncreaseAvg?: number;
  familyIncomeIncreasePercentage?: number;
  familiesReceivingAssistance: number;
  microloansProvided: number;
  microloanTotalValue?: number;

  // Employment Impact
  youthJobsCreated: number;
  adultJobsCreated: number;
  womenEmployed: number;
  vocationalTrainingParticipants: number;

  // Health & Wellbeing
  familiesReceivingHealthcare: number;
  nutritionProgramsParticipants: number;
  safeDrinkingWaterAccessFamilies: number;

  // Community Development
  communityProjectsCompleted: number;
  communityInfrastructureInvestments?: number;
  cooperativeMemberSatisfactionScore?: number; // 0-5 scale

  // Comparative Data
  baselineMeasurementId?: string;
  yearOverYearImprovement: Record<string, number>;

  // Verification
  verifiedBy?: string;
  verificationDate?: string;
  verificationMethod?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface ChildLaborIncident {
  // Primary Key
  id: string;

  // Relationships
  cooperativeId: string;
  assessmentId?: string;

  // Incident Details
  incidentDate: string;
  incidentType: string;
  incidentDescription: string;
  severity: ViolationSeverity;

  // Affected Individuals
  childrenAffected: number;
  ageRangeMin?: number;
  ageRangeMax?: number;

  // Location
  incidentLocation?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };

  // Reporting
  reportedBy: string;
  reporterOrganization?: string;
  reportDate: string;
  reportMethod?: string;

  // Investigation
  investigationStatus: 'pending' | 'ongoing' | 'completed' | 'closed';
  investigationStartDate?: string;
  investigationCompletionDate?: string;
  investigatorName?: string;
  investigationFindings?: string;

  // Resolution
  resolutionStatus: 'unresolved' | 'resolved' | 'partially_resolved';
  resolutionDate?: string;
  resolutionDetails?: string;
  correctiveActions: CorrectiveAction[];

  // Follow-up
  followUpRequired: boolean;
  nextFollowUpDate?: string;
  followUpNotes?: string;

  // Supporting Evidence
  evidenceDocuments: string[];
  witnessStatements: WitnessStatement[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// 4. VIEW MODELS & AGGREGATIONS
// =====================================================

export interface CooperativeReadinessStatus {
  cooperativeId: string;
  cooperativeName: string;
  region: string;
  department: string;
  latestAssessmentId?: string;
  assessmentDate?: string;
  readinessScore?: number; // Self-assessment score, not a compliance determination
  violationSeverity?: ViolationSeverity;
  childrenEnrolledSchool?: number;
  schoolEnrollmentRate?: number;
  childLaborViolations?: number;
  nextAssessmentDue?: string;
  readinessRating: ReadinessRating;
  activeCertifications: number;
}

// Legacy alias for backward compatibility during migration
/** @deprecated Use CooperativeReadinessStatus instead. This will be removed in a future version. */
export type CooperativeComplianceStatus = CooperativeReadinessStatus;

export interface SocialImpactSummary {
  cooperativeId: string;
  totalChildrenEnrolled: number;
  totalYouthJobs: number;
  avgIncomeIncrease?: number;
  totalFamiliesHelped: number;
  measurementCount: number;
}

// =====================================================
// 5. API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateAssessmentRequest {
  cooperativeId: string;
  assessmentPeriodStart: string;
  assessmentPeriodEnd: string;
  totalChildrenInCommunity: number;
  childrenEnrolledSchool: number;
  minimumWorkingAge: number;
  totalWorkersAssessed: number;
  underageWorkersFound: number;
  ageVerificationMethod: AgeVerificationMethod;
  childLaborViolations: number;
  hazardousWorkViolations: number;
  worstFormsViolations: number;
  violationDetails?: Violation[];
  assessorName: string;
  assessorOrganization?: string;
  assessorNotes?: string;
  evidenceDocuments?: string[];
}

export interface UpdateAssessmentRequest extends Partial<CreateAssessmentRequest> {
  status?: AssessmentStatus;
  verifiedBy?: string;
}

export interface CreateRemediationRequest {
  assessmentId: string;
  cooperativeId: string;
  actionType: string;
  description: string;
  targetBeneficiaries: number;
  startDate: string;
  targetCompletionDate: string;
  estimatedCost?: number;
  fundingSource?: string;
  responsiblePerson: string;
  responsibleOrganization?: string;
  partnerOrganizations?: string[];
}

export interface UpdateRemediationRequest extends Partial<CreateRemediationRequest> {
  status?: RemediationStatus;
  progressPercentage?: number;
  actualBeneficiaries?: number;
  actualCost?: number;
  actualCompletionDate?: string;
  childrenReturnedToSchool?: number;
  familiesSupported?: number;
  alternativeJobsCreated?: number;
}

export interface CreateCertificationRequest {
  cooperativeId: string;
  certificationType: LaborCertification;
  certificationNumber?: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  certificateDocumentUrl?: string;
  certificationConditions?: string[];
}

export interface ReportIncidentRequest {
  cooperativeId: string;
  incidentDate: string;
  incidentType: string;
  incidentDescription: string;
  severity: ViolationSeverity;
  childrenAffected: number;
  ageRangeMin?: number;
  ageRangeMax?: number;
  incidentLocation?: string;
  reportedBy: string;
  reporterOrganization?: string;
  reportMethod?: string;
}

// =====================================================
// 6. ANALYTICS & REPORTING TYPES
// =====================================================

export interface MonitoringDashboard {
  totalCooperatives: number;
  cooperativesWithGoodScores: number; // Cooperatives with assessment scores ≥75
  documentationCoverageRate: number; // Percentage of cooperatives with documentation scores ≥75
  averageReadinessScore: number; // Average self-assessment score, not a compliance determination
  totalAssessments: number;
  assessmentsDueThisMonth: number;
  totalViolations: number;
  criticalViolations: number;
  activeCertifications: number;
  expiringSoonCertifications: number;
}

// Legacy alias for backward compatibility during migration
/** @deprecated Use MonitoringDashboard instead. This will be removed in a future version. */
export type ComplianceDashboard = MonitoringDashboard;

export interface SocialImpactDashboard {
  totalChildrenHelped: number;
  totalFamiliesSupported: number;
  totalJobsCreated: number;
  averageIncomeIncrease: number;
  totalInvestment: number;
  schoolEnrollmentIncrease: number;
  cooperativesWithProgress: number;
}

export interface RegionalMonitoring {
  region: string;
  totalCooperatives: number;
  cooperativesWithGoodScores: number; // Cooperatives with assessment scores ≥75
  documentationCoverageRate: number; // Percentage of cooperatives with documentation scores ≥75
  averageReadinessScore: number; // Average self-assessment score
  totalChildrenInSchool: number;
  totalViolations: number;
}

// Legacy alias for backward compatibility during migration
/** @deprecated Use RegionalMonitoring instead. This will be removed in a future version. */
export type RegionalCompliance = RegionalMonitoring;

export interface ReadinessTrend {
  date: string;
  averageReadinessScore: number; // Average self-assessment score over time
  totalViolations: number;
  childrenEnrolled: number;
}

// Legacy alias for backward compatibility during migration
/** @deprecated Use ReadinessTrend instead. This will be removed in a future version. */
export type ComplianceTrend = ReadinessTrend;

export interface CertificationDistribution {
  certificationType: LaborCertification;
  count: number;
  percentage: number;
}

// =====================================================
// 7. FILTER & QUERY TYPES
// =====================================================

export interface AssessmentFilters {
  cooperativeId?: string;
  region?: string;
  department?: string;
  status?: AssessmentStatus;
  minReadinessScore?: number; // Minimum self-assessment score filter
  maxReadinessScore?: number; // Maximum self-assessment score filter
  
  // Legacy fields for backward compatibility during migration
  /** @deprecated Use minReadinessScore instead. This will be removed in a future version. */
  minComplianceScore?: number;
  /** @deprecated Use maxReadinessScore instead. This will be removed in a future version. */
  maxComplianceScore?: number;
  dateFrom?: string;
  dateTo?: string;
  hasViolations?: boolean;
  violationSeverity?: ViolationSeverity;
  assessor?: string;
}

export interface RemediationFilters {
  cooperativeId?: string;
  assessmentId?: string;
  status?: RemediationStatus;
  actionType?: string;
  dateFrom?: string;
  dateTo?: string;
  minProgress?: number;
  maxProgress?: number;
}

export interface CertificationFilters {
  cooperativeId?: string;
  certificationType?: LaborCertification;
  isActive?: boolean;
  expiringWithinDays?: number;
  region?: string;
}

// =====================================================
// 8. UTILITY TYPES
// =====================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BatchImportResult {
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// =====================================================
// 9. EXPORT TYPES
// =====================================================

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  includeEvidence?: boolean;
  includePhotos?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: AssessmentFilters | RemediationFilters;
}

// =====================================================
// 10. VALIDATION TYPES
// =====================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// =====================================================
// END OF TYPE DEFINITIONS
// =====================================================

