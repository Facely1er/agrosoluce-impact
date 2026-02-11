// API functions for Value Tracking System

import { supabase } from '@/lib/supabase/client';
import type { BaselineMeasurement, MonthlyProgress, ValueMetric, ImpactSummary } from '../types';

/**
 * Get baseline measurement for a cooperative
 */
export async function getBaselineMeasurement(
  cooperativeId: string
): Promise<{ data: BaselineMeasurement | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('baseline_measurements')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const transformed = transformBaseline(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create or update baseline measurement
 */
export async function submitBaselineMeasurement(
  baseline: Omit<BaselineMeasurement, 'id' | 'createdAt'>
): Promise<{ data: BaselineMeasurement | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      cooperative_id: baseline.cooperativeId,
      measured_at: baseline.measuredAt || new Date().toISOString(),
    };

    if (baseline.measuredBy) payload.measured_by = baseline.measuredBy;
    if (baseline.hoursMemberManagement !== undefined) payload.hours_member_management = baseline.hoursMemberManagement;
    if (baseline.hoursMeetingOrganization !== undefined) payload.hours_meeting_organization = baseline.hoursMeetingOrganization;
    if (baseline.hoursReportPreparation !== undefined) payload.hours_report_preparation = baseline.hoursReportPreparation;
    if (baseline.hoursCertificationTracking !== undefined) payload.hours_certification_tracking = baseline.hoursCertificationTracking;
    if (baseline.hoursMemberCommunication !== undefined) payload.hours_member_communication = baseline.hoursMemberCommunication;
    if (baseline.hoursDocumentManagement !== undefined) payload.hours_document_management = baseline.hoursDocumentManagement;
    if (baseline.totalAdminHoursPerWeek !== undefined) payload.total_admin_hours_per_week = baseline.totalAdminHoursPerWeek;
    if (baseline.avgDaysToNegotiatePrice !== undefined) payload.avg_days_to_negotiate_price = baseline.avgDaysToNegotiatePrice;
    if (baseline.percentageSalesAtOptimalPrice !== undefined) payload.percentage_sales_at_optimal_price = baseline.percentageSalesAtOptimalPrice;
    if (baseline.marketPriceAccessFrequencyPerWeek !== undefined) payload.market_price_access_frequency_per_week = baseline.marketPriceAccessFrequencyPerWeek;
    if (baseline.exportDocumentPrepDays !== undefined) payload.export_document_prep_days = baseline.exportDocumentPrepDays;
    if (baseline.missedDeadlines12Months !== undefined) payload.missed_deadlines_12_months = baseline.missedDeadlines12Months;
    if (baseline.auditPreparationDays !== undefined) payload.audit_preparation_days = baseline.auditPreparationDays;
    if (baseline.lostMisplacedDocuments !== undefined) payload.lost_misplaced_documents = baseline.lostMisplacedDocuments;
    if (baseline.delayedSubmissions !== undefined) payload.delayed_submissions = baseline.delayedSubmissions;
    if (baseline.securityIncidents12Months !== undefined) payload.security_incidents_12_months = baseline.securityIncidents12Months;
    if (baseline.dataLossIncidents !== undefined) payload.data_loss_incidents = baseline.dataLossIncidents;
    if (baseline.internalCommunicationProblemsPerMonth !== undefined) payload.internal_communication_problems_per_month = baseline.internalCommunicationProblemsPerMonth;
    if (baseline.financialRecordErrors !== undefined) payload.financial_record_errors = baseline.financialRecordErrors;
    if (baseline.notes) payload.notes = baseline.notes;

    const { data, error } = await supabase
      .from('baseline_measurements')
      .upsert(payload, {
        onConflict: 'cooperative_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformBaseline(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get monthly progress for a cooperative
 */
export async function getMonthlyProgress(
  cooperativeId: string,
  month?: string
): Promise<{ data: MonthlyProgress[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase
      .from('monthly_progress')
      .select('*')
      .eq('cooperative_id', cooperativeId);

    if (month) {
      query = query.eq('progress_month', month);
    }

    const { data, error } = await query.order('progress_month', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformMonthlyProgress);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Submit monthly progress
 */
export async function submitMonthlyProgress(
  progress: Omit<MonthlyProgress, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ data: MonthlyProgress | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      cooperative_id: progress.cooperativeId,
      progress_month: progress.progressMonth,
      status: progress.status || 'submitted',
    };

    // Map all fields
    Object.keys(progress).forEach(key => {
      if (key !== 'id' && key !== 'cooperativeId' && key !== 'progressMonth' && key !== 'status' && key !== 'createdAt' && key !== 'updatedAt') {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (progress[key as keyof MonthlyProgress] !== undefined) {
          payload[dbKey] = progress[key as keyof MonthlyProgress];
        }
      }
    });

    if (progress.submittedBy) payload.submitted_by = progress.submittedBy;

    const { data, error } = await supabase
      .from('monthly_progress')
      .upsert(payload, {
        onConflict: 'cooperative_id,progress_month',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformMonthlyProgress(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get impact summary for a cooperative
 */
export async function getImpactSummary(
  cooperativeId: string
): Promise<{ data: ImpactSummary | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Get baseline
    const { data: baseline } = await getBaselineMeasurement(cooperativeId);
    
    // Get latest progress
    const { data: progressData } = await getMonthlyProgress(cooperativeId);
    const latestProgress = progressData && progressData.length > 0 ? progressData[0] : null;

    // Get latest metrics
    const { data: metricsData, error: metricsError } = await supabase
      .from('value_metrics')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('metric_month', { ascending: false })
      .limit(1)
      .single();

    const latestMetrics = metricsData ? transformValueMetric(metricsData) : null;

    // Calculate summary
    const summary: ImpactSummary = {
      cooperativeId,
      baseline: baseline?.data || undefined,
      latestProgress: latestProgress || undefined,
      latestMetrics: latestMetrics || undefined,
    };

    if (baseline?.data && latestProgress) {
      summary.totalTimeSaved = (baseline.data.totalAdminHoursPerWeek || 0) - (latestProgress.currentAdminHoursPerWeek || 0);
      summary.improvementPercentage = latestProgress.percentageReduction || 0;
    }

    if (latestMetrics) {
      summary.totalEconomicImpact = latestMetrics.totalEconomicImpactUsd || 0;
    }

    return { data: summary, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper functions

function transformBaseline(data: any): BaselineMeasurement {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    measuredAt: data.measured_at,
    measuredBy: data.measured_by,
    hoursMemberManagement: data.hours_member_management,
    hoursMeetingOrganization: data.hours_meeting_organization,
    hoursReportPreparation: data.hours_report_preparation,
    hoursCertificationTracking: data.hours_certification_tracking,
    hoursMemberCommunication: data.hours_member_communication,
    hoursDocumentManagement: data.hours_document_management,
    totalAdminHoursPerWeek: data.total_admin_hours_per_week,
    avgDaysToNegotiatePrice: data.avg_days_to_negotiate_price,
    percentageSalesAtOptimalPrice: data.percentage_sales_at_optimal_price,
    marketPriceAccessFrequencyPerWeek: data.market_price_access_frequency_per_week,
    exportDocumentPrepDays: data.export_document_prep_days,
    missedDeadlines12Months: data.missed_deadlines_12_months,
    auditPreparationDays: data.audit_preparation_days,
    lostMisplacedDocuments: data.lost_misplaced_documents,
    delayedSubmissions: data.delayed_submissions,
    securityIncidents12Months: data.security_incidents_12_months,
    dataLossIncidents: data.data_loss_incidents,
    internalCommunicationProblemsPerMonth: data.internal_communication_problems_per_month,
    financialRecordErrors: data.financial_record_errors,
    notes: data.notes,
    createdAt: data.created_at
  };
}

function transformMonthlyProgress(data: any): MonthlyProgress {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    progressMonth: data.progress_month,
    submittedBy: data.submitted_by,
    submittedAt: data.submitted_at,
    currentAdminHoursPerWeek: data.current_admin_hours_per_week,
    baselineAdminHoursPerWeek: data.baseline_admin_hours_per_week,
    hoursReduction: data.hours_reduction,
    percentageReduction: data.percentage_reduction,
    automatedTasksCount: data.automated_tasks_count,
    simplifiedProcessesCount: data.simplified_processes_count,
    avgPriceImprovementPercentage: data.avg_price_improvement_percentage,
    baselineAvgPrice: data.baseline_avg_price,
    currentAvgPrice: data.current_avg_price,
    negotiationTimeReductionDays: data.negotiation_time_reduction_days,
    newOpportunitiesIdentified: data.new_opportunities_identified,
    premiumBuyersContacted: data.premium_buyers_contacted,
    deadlinesMet: data.deadlines_met,
    totalDeadlines: data.total_deadlines,
    auditPrepTimeReductionDays: data.audit_prep_time_reduction_days,
    documentsOrganizedAutomaticallyPercentage: data.documents_organized_automatically_percentage,
    autoGeneratedReports: data.auto_generated_reports,
    securityIncidentsPrevented: data.security_incidents_prevented,
    successfulAutoBackups: data.successful_auto_backups,
    internalCommunicationImprovementPercentage: data.internal_communication_improvement_percentage,
    dataErrorReductionPercentage: data.data_error_reduction_percentage,
    memberSatisfactionScore: data.member_satisfaction_score,
    activePlatformUsersPercentage: data.active_platform_users_percentage,
    improvementSuggestionsReceived: data.improvement_suggestions_received,
    problemsReported: data.problems_reported,
    additionalTrainingRequired: data.additional_training_required,
    missingFeaturesIdentified: data.missing_features_identified,
    technicalSupportNeeded: data.technical_support_needed,
    configurationAdjustments: data.configuration_adjustments,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformValueMetric(data: any): ValueMetric {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    metricMonth: data.metric_month,
    calculatedAt: data.calculated_at,
    adminTimeSavedHours: data.admin_time_saved_hours,
    adminCostSavedUsd: data.admin_cost_saved_usd,
    deadlineCompliancePercentage: data.deadline_compliance_percentage,
    errorReductionPercentage: data.error_reduction_percentage,
    priceImprovementUsd: data.price_improvement_usd,
    newRevenueOpportunitiesUsd: data.new_revenue_opportunities_usd,
    totalEconomicImpactUsd: data.total_economic_impact_usd,
    digitalLiteracyImprovementScore: data.digital_literacy_improvement_score,
    autonomyIncreasePercentage: data.autonomy_increase_percentage,
    securityIncidentsAvoided: data.security_incidents_avoided,
    dataIntegrityScore: data.data_integrity_score,
    createdAt: data.created_at
  };
}

