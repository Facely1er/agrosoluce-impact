// API functions for compliance
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Certification, EUDRVerification, ComplianceRequirement } from '@/types';

/**
 * Get certifications for a cooperative or farmer
 */
export async function getCertifications(
  cooperativeId?: string,
  farmerId?: string
): Promise<{
  data: Certification[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase.from('certifications').select('*');

    if (cooperativeId) {
      query = query.eq('cooperative_id', cooperativeId);
    } else if (farmerId) {
      query = query.eq('farmer_id', farmerId);
    }

    const { data, error } = await query.order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching certifications:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((cert: any) => ({
      ...cert,
      id: cert.id.toString(),
    })) as Certification[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Add a new certification
 */
export async function addCertification(
  certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
): Promise<{
  data: Certification | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('certifications')
      .insert([certification])
      .select()
      .single();

    if (error) {
      console.error('Error adding certification:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Certification;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Verify EUDR compliance for a batch
 */
export async function verifyEUDR(
  batchId: string,
  gpsCoordinates?: { latitude: number; longitude: number }
): Promise<{
  data: EUDRVerification | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Check if verification already exists
    const { data: existing } = await supabase
      .from('eudr_verifications')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (existing) {
      // Update existing verification
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (gpsCoordinates) {
        updateData.gps_coordinates = gpsCoordinates;
      }

      // Perform basic checks (in production, this would call external APIs)
      updateData.deforestation_check = 'pending';
      updateData.child_labor_check = 'pending';
      updateData.status = 'pending';

      const { data, error } = await supabase
        .from('eudr_verifications')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return {
        data: {
          ...data,
          id: data.id.toString(),
        } as EUDRVerification,
        error: null,
      };
    } else {
      // Create new verification
      const verification: Omit<EUDRVerification, 'id' | 'created_at' | 'updated_at'> = {
        batch_id: batchId,
        gps_coordinates: gpsCoordinates,
        deforestation_check: 'pending',
        child_labor_check: 'pending',
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('eudr_verifications')
        .insert([verification])
        .select()
        .single();

      if (error) {
        console.error('Error creating EUDR verification:', error);
        return { data: null, error: new Error(error.message) };
      }

      return {
        data: {
          ...data,
          id: data.id.toString(),
        } as EUDRVerification,
        error: null,
      };
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Check child labor compliance
 */
export async function checkChildLabor(batchId: string): Promise<{
  data: { compliant: boolean; notes?: string } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data: verification, error } = await supabase
      .from('eudr_verifications')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (error || !verification) {
      return { data: null, error: error ? new Error(error.message) : new Error('Verification not found') };
    }

    return {
      data: {
        compliant: verification.child_labor_check === 'passed',
        notes: verification.notes,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get compliance status for a cooperative
 */
export async function getComplianceStatus(cooperativeId: string): Promise<{
  data: {
    certifications: Certification[];
    eudrCompliant: boolean;
    overallStatus: 'pending' | 'documented' | 'not_documented';
  } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Get certifications
    const { data: certs, error: certError } = await getCertifications(cooperativeId);

    if (certError) {
      return { data: null, error: certError };
    }

    // Get EUDR verifications for batches from this cooperative
    const { data: batches } = await supabase
      .from('batches')
      .select('id')
      .eq('cooperative_id', cooperativeId);

    const batchIds = (batches || []).map((b: any) => b.id);

    // Check for EUDR-aligned documentation and verification context (not compliance determination)
    let eudrAligned = true;
    if (batchIds.length > 0) {
      const { data: verifications } = await supabase
        .from('eudr_verifications')
        .select('status')
        .in('batch_id', batchIds);

      eudrAligned =
        (verifications || []).length > 0 &&
        (verifications || []).every((v: any) => v.status === 'verified');
    }

    const activeCerts = (certs || []).filter((c) => c.status === 'active');
    // Note: overallStatus is informational only, not a compliance determination
    const overallStatus =
      activeCerts.length > 0 && eudrAligned ? 'documented' : activeCerts.length === 0 ? 'not_documented' : 'pending';

    return {
      data: {
        certifications: certs || [],
        eudrCompliant: eudrAligned, // Keep for backward compatibility, but represents alignment not compliance
        overallStatus,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get compliance requirements
 */
export async function getComplianceRequirements(
  applicableTo?: 'cooperative' | 'farmer' | 'product' | 'batch'
): Promise<{
  data: ComplianceRequirement[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase.from('compliance_requirements').select('*');

    if (applicableTo) {
      query = query.eq('applicable_to', applicableTo);
    }

    const { data, error } = await query.order('requirement_type', { ascending: true });

    if (error) {
      console.error('Error fetching compliance requirements:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((req: any) => ({
      ...req,
      id: req.id.toString(),
    })) as ComplianceRequirement[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update EUDR verification status (admin only)
 */
export async function updateEUDRVerification(
  id: string,
  updates: Partial<EUDRVerification>
): Promise<{
  data: EUDRVerification | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { id: _, created_at: __, updated_at: ___, ...updateData } = updates;

    const { data, error } = await supabase
      .from('eudr_verifications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating EUDR verification:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        ...data,
        id: data.id.toString(),
      } as EUDRVerification,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

