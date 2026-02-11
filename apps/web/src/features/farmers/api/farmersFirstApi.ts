// API functions for Farmers First Dashboard Summary
// Aggregates data from farmers, declarations, training, and value tracking

import { supabase } from '@/lib/supabase/client';
import { getFarmersByCooperative } from '@/features/producers/api/farmersApi';
import { getFarmerDeclarations } from './farmerDeclarationsApi';
import { getTrainingSessions } from '@/features/training/api/trainingApi';
import { getBaselineMeasurement, getMonthlyProgress } from '@/features/value-tracking/api/valueTrackingApi';

export interface FarmersFirstSummary {
  cooperativeId: string;
  // Onboarding coverage
  totalFarmers: number;
  farmersOnboarded: number;
  onboardingCoveragePercentage: number;
  
  // Declarations coverage
  totalDeclarations: number;
  farmersWithDeclarations: number;
  declarationsCoveragePercentage: number;
  
  // Training coverage
  totalTrainingSessions: number;
  completedTrainingSessions: number;
  trainingCoveragePercentage: number;
  
  // Impact tracking
  hasBaseline: boolean;
  hasProgressData: boolean;
  latestProgressMonth: string | null;
  impactDataPoints: number; // Number of progress snapshots available
}

/**
 * Get comprehensive Farmers First summary for a cooperative
 */
export async function getFarmersFirstSummary(
  coopId: string
): Promise<{
  data: FarmersFirstSummary | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Fetch all data in parallel
    const [
      farmersResult,
      declarationsResult,
      trainingResult,
      baselineResult,
      progressResult,
    ] = await Promise.all([
      getFarmersByCooperative(coopId),
      getFarmerDeclarations(coopId),
      getTrainingSessions(coopId),
      getBaselineMeasurement(coopId),
      getMonthlyProgress(coopId),
    ]);

    // Handle errors
    if (farmersResult.error) {
      console.error('Error fetching farmers:', farmersResult.error);
    }
    if (declarationsResult.error) {
      console.error('Error fetching declarations:', declarationsResult.error);
    }
    if (trainingResult.error) {
      console.error('Error fetching training:', trainingResult.error);
    }
    if (baselineResult.error) {
      console.error('Error fetching baseline:', baselineResult.error);
    }
    if (progressResult.error) {
      console.error('Error fetching progress:', progressResult.error);
    }

    const farmers = farmersResult.data || [];
    const declarations = declarationsResult.data || [];
    const trainingSessions = trainingResult.data || [];
    const baseline = baselineResult.data;
    const progressData = progressResult.data || [];

    // Calculate onboarding coverage
    const totalFarmers = farmers.length;
    const farmersOnboarded = farmers.filter(f => f.is_active).length;
    const onboardingCoveragePercentage = totalFarmers > 0 
      ? (farmersOnboarded / totalFarmers) * 100 
      : 0;

    // Calculate declarations coverage
    const totalDeclarations = declarations.length;
    const uniqueFarmersWithDeclarations = new Set(
      declarations.map(d => d.farmer_reference)
    ).size;
    const declarationsCoveragePercentage = totalFarmers > 0
      ? (uniqueFarmersWithDeclarations / totalFarmers) * 100
      : 0;

    // Calculate training coverage
    const totalTrainingSessions = trainingSessions.length;
    const completedTrainingSessions = trainingSessions.filter(
      t => t.status === 'completed'
    ).length;
    const trainingCoveragePercentage = totalTrainingSessions > 0
      ? (completedTrainingSessions / totalTrainingSessions) * 100
      : 0;

    // Impact tracking
    const hasBaseline = baseline !== null;
    const hasProgressData = progressData.length > 0;
    const latestProgressMonth = progressData.length > 0 
      ? progressData[0].progressMonth 
      : null;
    const impactDataPoints = progressData.length;

    const summary: FarmersFirstSummary = {
      cooperativeId: coopId,
      totalFarmers,
      farmersOnboarded,
      onboardingCoveragePercentage,
      totalDeclarations,
      farmersWithDeclarations: uniqueFarmersWithDeclarations,
      declarationsCoveragePercentage,
      totalTrainingSessions,
      completedTrainingSessions,
      trainingCoveragePercentage,
      hasBaseline,
      hasProgressData,
      latestProgressMonth,
      impactDataPoints,
    };

    return { data: summary, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error generating Farmers First summary:', error);
    return { data: null, error };
  }
}

